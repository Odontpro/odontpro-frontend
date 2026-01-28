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
      titulo: "Protocolo (Fases 1-6)",
      subtitulo: "Fases de Barrancos Mooney",
      intro: "Protocolo integral para restauraciones de alta longevidad.",
      detalles: [
        { nombre: "Fase 1: Diagnóstico", descripcion: "Historia clínica, examen ATM e intrabucal", imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769536723/Imagen8_goehez.webp" },
        { nombre: "Fase 2: Terapia Control", descripcion: "Eliminación de infección y motivación", imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769536826/Imagen10_fgwi9s.webp" },
        { nombre: "Fase 3: Tratamientos restauradores directos", descripcion: "", imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769536824/Imagen17_oclssn.webp" },
        { nombre: "Fase 4: Tratamientos restauradores indirectos", descripcion: "", imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769537371/Imagen25_ll00qz.webp" },
        { nombre: "Fase 5: Control final y ajuste", descripcion: "", imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769537371/Imagen26_ybo90q.webp" },
        { nombre: "Fase 6: Mantenimiento", descripcion: "", imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769537366/Imagen30_qtevzq.webp" }
      ]
    },
    {
      titulo: "Clasificación de Black",
      subtitulo: "Tipos de Cavidades y Restauraciones",
      intro: "Tratamiento específico según la localización de la lesión.",
      detalles: [
        { nombre: "Clase I", descripcion: "Fosas y fisuras en oclusal. (Imágenes 21-23)", imgUrl: "https://picsum.photos/400/300?5" },
        { nombre: "Clase II", descripcion: "Superficies proximales de molares. (Imágenes 24-26)", imgUrl: "https://picsum.photos/400/300?6" },
        { nombre: "Clase III y IV", descripcion: "Dientes anteriores con/sin compromiso incisal. (Imágenes 27-29)", imgUrl: "https://picsum.photos/400/300?7" },
        { nombre: "Clase V", descripcion: "Cuellos dentales / Abfracciones. (Imágenes 30-32)", imgUrl: "https://picsum.photos/400/300?8" }
      ]
    },
    {
      titulo: "Técnicas Especiales (DME)",
      subtitulo: "Deep Margin Elevation",
      intro: "Técnica avanzada para márgenes profundos sin cirugía.",
      detalles: [
        { nombre: "Aislamiento Absoluto", descripcion: "Uso de dique de goma y clamps especiales.", imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769539641/Imagen51_ytcvsj.webp" },
        { nombre: "Elevación de Margen", descripcion: "Uso de matrices seccionales y resinas flow.", imgUrl: "https://picsum.photos/400/300?10" },
        { nombre: "Ajuste Oclusal", descripcion: "Papel de articular de 8 micras y guías.", imgUrl: "https://picsum.photos/400/300?11" }
      ]
    }
  ];

  casos = [
    { id: 1, titulo: 'SONRISAS TOP', descripcion: '10 carillas de cerámica ultrafinas.', imagenAntes: 'https://picsum.photos/800/600?before1', imagenDespues: 'https://picsum.photos/800/600?after1' },
    { id: 2, titulo: 'REHABILITACIÓN', descripcion: 'Cierre de diastemas con resina.', imagenAntes: 'https://picsum.photos/800/600?before2', imagenDespues: 'https://picsum.photos/800/600?after2' }
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
