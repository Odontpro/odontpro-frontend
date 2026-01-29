import { Component, OnDestroy, OnInit, NgZone, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {BannerEspecialidad} from '../../../../shared/components/banner-especialidad/banner-especialidad';

interface Caso {
  id: number;
  titulo: string;
  subtitulo: string;
  descripcion: string;
  imagenAntes: string;
  imagenDespues: string;
}

@Component({
  selector: 'app-odontologia-general',
  standalone: true,
  imports: [CommonModule, BannerEspecialidad],
  templateUrl: './odontologia-general.html',
  styleUrl: './odontologia-general.css',
})
export class OdontologiaGeneral implements OnDestroy, OnInit {

  tabActiva = 0;
  sliderPosition = 50;
  isDragging = false;
  casoActual = 0;

  currentFaseIndex = 0;
  fasesPerPage = 3; // Cuántas tarjetas se ven a la vez (puedes ajustarlo)

  // MAPEO DE LAS 14 PÁGINAS DEL PDF
  tabsEspecialidad = [
    {
      "titulo": "Protocolo (Fases 1-6)",
      "subtitulo": "Fases de Barrancos Mooney",
      "intro": "Protocolo integral para restauraciones de alta longevidad.",
      "detalles": [
        { "nombre": "Fase 1: Diagnóstico", "descripcion": "Historia clínica, examen ATM e intrabucal", "imgUrl": "https://res.cloudinary.com/de3nau9kv/image/upload/v1769536723/Imagen8_goehez.webp" },
        { "nombre": "Fase 2: Terapia Control", "descripcion": "Eliminación de infección y motivación", "imgUrl": "https://res.cloudinary.com/de3nau9kv/image/upload/v1769536826/Imagen10_fgwi9s.webp" },
        { "nombre": "Fase 3: Restauración Directa", "descripcion": "Operatoria dental adhesiva y resinas", "imgUrl": "https://res.cloudinary.com/de3nau9kv/image/upload/v1769536824/Imagen17_oclssn.webp" },
        { "nombre": "Fase 4: Restauración Indirecta", "descripcion": "Prótesis fija y reconstrucción extensa", "imgUrl": "https://res.cloudinary.com/de3nau9kv/image/upload/v1769537371/Imagen25_ll00qz.webp" },
        { "nombre": "Fase 5: Control y Ajuste", "descripcion": "Oclusión estable y ajuste funcional", "imgUrl": "https://res.cloudinary.com/de3nau9kv/image/upload/v1769537371/Imagen26_ybo90q.webp" },
        { "nombre": "Fase 6: Mantenimiento", "descripcion": "Terapia de soporte y monitoreo clínico", "imgUrl": "https://res.cloudinary.com/de3nau9kv/image/upload/v1769537366/Imagen30_qtevzq.webp" }
      ]
    },
    {
      "titulo": "Clasificación de Black",
      "subtitulo": "Tipos de Cavidades y Restauraciones",
      "intro": "Tratamiento específico según la localización de la lesión.",
      "detalles": [
        {
          "nombre": "Clase I",
          "descripcion": "Fosas y fisuras en caras oclusales de posteriores y fosas de anteriores.",
          "imgUrl": "https://res.cloudinary.com/de3nau9kv/image/upload/v1769537168/Imagen20_bwztyq.webp"
        },
        {
          "nombre": "Clase II",
          "descripcion": "Superficies proximales (mesial o distal) en premolares y molares.",
          "imgUrl": "https://res.cloudinary.com/de3nau9kv/image/upload/v1769537367/Imagen23_zhiqs8.webp"
        },
        {
          "nombre": "Clase III",
          "descripcion": "Superficies proximales de dientes anteriores sin afectar el borde incisal.",
          "imgUrl": "https://res.cloudinary.com/de3nau9kv/image/upload/v1769538080/Imagen33_wh7v1j.webp"
        },
        {
          "nombre": "Clase IV",
          "descripcion": "Superficies proximales de dientes anteriores con afectación del borde incisal.",
          "imgUrl": "https://res.cloudinary.com/de3nau9kv/image/upload/v1769538086/Imagen38_zszn2q.webp"
        },
        {
          "nombre": "Clase V",
          "descripcion": "Tercio cervical de todos los dientes; incluye caries y defectos como abfracción.",
          "imgUrl": "https://res.cloudinary.com/de3nau9kv/image/upload/v1769538243/Imagen42_srm4v1.webp"
        },
        {
          "nombre": "Clase VI",
          "descripcion": "Puntas de cúspides en posteriores o bordes incisales por desgaste.",
          "imgUrl": "https://res.cloudinary.com/de3nau9kv/image/upload/v1769538244/Imagen43_lpij67.webp"
        }
      ]
    },
    {
      "titulo": "Técnicas Especiales (DME)",
      "subtitulo": "Deep Margin Elevation",
      "intro": "Protocolo para elevar márgenes subgingivales a una posición supragingival.",
      "detalles": [
        {
          "nombre": "Diagnóstico y Espacio Biológico",
          "descripcion": "El margen final debe estar a ≥3 mm de la cresta ósea para evitar cirugía.",
          "imgUrl": "https://res.cloudinary.com/de3nau9kv/image/upload/v1769539641/Imagen51_ytcvsj.webp"
        },
        {
          "nombre": "Aislamiento y Retracción",
          "descripcion": "Dique de goma obligatorio y retracción atraumática con hilo o cuña.",
          "imgUrl": "https://res.cloudinary.com/de3nau9kv/image/upload/v1769538503/Imagen52_psum78.webp"
        },
        {
          "nombre": "Técnica de Levantamiento",
          "descripcion": "Aplicación de capas de composite fluido (Bulk-Fill) hasta superar el margen gingival.",
          "imgUrl": "https://res.cloudinary.com/de3nau9kv/image/upload/v1769539702/Imagen54_em6wkg.webp"
        },
        {
          "nombre": "Preparación Final",
          "descripcion": "Tallado de restauración indirecta sobre el nuevo margen artificial liso y seco.",
          "imgUrl": "https://res.cloudinary.com/de3nau9kv/image/upload/v1769538380/Imagen49_zxudq0.webp"
        }
      ]
    }
  ];

  casos = [
    { id: 1, titulo: 'REPARACIÓN DE MUELAS', descripcion: 'Reconstrucción proximal en molares mediante técnica incremental con resina microhíbrida. Se utilizaron matrices metálicas y cuñas para devolver el punto de contacto y la anatomía oclusal funcional.', imagenAntes: 'https://res.cloudinary.com/de3nau9kv/image/upload/v1769537367/Imagen21_ffr0x3.webp', imagenDespues: 'https://res.cloudinary.com/de3nau9kv/image/upload/v1769705014/caso-1-despues_itcs5q.webp' },
    { id: 2, titulo: 'ESTÉTICA EN DIENTES FRONTALES', descripcion: 'Tratamiento de caries proximales en sector anterior sin compromiso incisal. Uso de resinas nanómeras de alta estética y matrices de Mylar para un pulido óptimo y mimetismo con el esmalte natural.', imagenAntes: 'https://res.cloudinary.com/de3nau9kv/image/upload/v1769538045/Imagen31_pqh11v.webp', imagenDespues: 'https://res.cloudinary.com/de3nau9kv/image/upload/v1769705322/caso-2-despues_avwahg.webp' },
    { id: 3, titulo: 'RESCATE DE DIENTE PROFUNDO', descripcion: 'Elevación de margen profundo subgingival mediante aislamiento absoluto y composite fluido Bulk-Fill. Se observa el levantamiento del margen para permitir una futura restauración indirecta sellada y funcional.', imagenAntes: 'https://res.cloudinary.com/de3nau9kv/image/upload/v1769538380/Imagen47_t4y6vg.webp', imagenDespues: 'https://res.cloudinary.com/de3nau9kv/image/upload/v1769705999/caso-3-despues_ozfjri.webp' }
  ];

  ngOnInit() {
    this.updatePerPage();
  }

  @HostListener('window:resize')
  onResize() {
    this.updatePerPage();
  }

  constructor(private ngZone: NgZone, private router: Router) {
    this.updatePerPage();
    window.onresize = () => this.updatePerPage();
  }

  updatePerPage() {
    this.fasesPerPage = window.innerWidth < 768 ? 1 : (window.innerWidth < 1100 ? 2 : 3);
  }

  nextFase() {
    const totalFases = this.tabsEspecialidad[this.tabActiva].detalles.length;
    if (this.currentFaseIndex < totalFases - this.fasesPerPage) {
      this.currentFaseIndex++;
    }
  }

  prevFase() {
    if (this.currentFaseIndex > 0) {
      this.currentFaseIndex--;
    }
  }

  cambiarTab(index: number) {
    this.tabActiva = index;
    this.currentFaseIndex = 0; // Reiniciar carrusel al cambiar de pestaña
  }

  get casoSeleccionado() { return this.casos[this.casoActual]; }
  seleccionarCaso(i: number) { this.casoActual = i; this.sliderPosition = 50; }

  updateSliderPosition(event: MouseEvent) {
    const container = (event.target as HTMLElement).closest('.image-comparison');
    if (container) {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      this.sliderPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));
    }
  }

  onMouseDown(e: MouseEvent) { this.isDragging = true; this.updateSliderPosition(e); }
  onMouseMove(e: MouseEvent) { if (this.isDragging) this.updateSliderPosition(e); }
  onMouseUp() { this.isDragging = false; }

  irAFundamentos() {
    const rutaActual = this.router.url;
    this.router.navigate([`${rutaActual}/fundamentos`]);
  }

  ngOnDestroy() {
    this.isDragging = false;
    if ((this as any)._moveHandler) {
      document.removeEventListener('mousemove', (this as any)._moveHandler);
      document.removeEventListener('mouseup', (this as any)._upHandler);
    }
  }
}
