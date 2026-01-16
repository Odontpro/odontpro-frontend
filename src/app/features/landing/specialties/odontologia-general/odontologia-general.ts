import { Component, OnDestroy, OnInit, NgZone, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  imports: [CommonModule],
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
        { nombre: "Fase 1: Diagnóstico", descripcion: "Historia clínica, examen ATM e intrabucal (Imágenes 1-5)", imgUrl: "https://picsum.photos/400/300?1" },
        { nombre: "Fase 2: Terapia Control", descripcion: "Eliminación de infección y motivación (Imágenes 6-10)", imgUrl: "https://picsum.photos/400/300?2" },
        { nombre: "Fase 3: Preparación", descripcion: "Protección dentino-pulpar y biomecánica (Imágenes 11-15)", imgUrl: "https://picsum.photos/400/300?3" },
        { nombre: "Fase 4: Restauración", descripcion: "Técnica incremental y grabado ácido (Imágenes 16-20)", imgUrl: "https://picsum.photos/400/300?4" },
        { nombre: "Fase 5: Restauración Clase V", descripcion: "Tratamiento de lesiones cervicales con retracción gingival, bisel en esmalte y materiales de baja contracción (Imágenes 21-25)", imgUrl: "https://picsum.photos/400/300?5" },
        { nombre: "Fase 6: Restauración Clase VI", descripcion: "Reconstrucción de cúspides y bordes incisales con énfasis en la resistencia al desgaste y oclusión (Imágenes 26-30)", imgUrl: "https://picsum.photos/400/300?6" }
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
        { nombre: "Aislamiento Absoluto", descripcion: "Uso de dique de goma y clamps especiales. (Imágenes 33-35)", imgUrl: "https://picsum.photos/400/300?9" },
        { nombre: "Elevación de Margen", descripcion: "Uso de matrices seccionales y resinas flow. (Imágenes 36-38)", imgUrl: "https://picsum.photos/400/300?10" },
        { nombre: "Ajuste Oclusal", descripcion: "Papel de articular de 8 micras y guías. (Imágenes 39-45)", imgUrl: "https://picsum.photos/400/300?11" }
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

  constructor(private ngZone: NgZone) {
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


  ngOnDestroy() {
    this.isDragging = false;
    if ((this as any)._moveHandler) {
      document.removeEventListener('mousemove', (this as any)._moveHandler);
      document.removeEventListener('mouseup', (this as any)._upHandler);
    }
  }
}
