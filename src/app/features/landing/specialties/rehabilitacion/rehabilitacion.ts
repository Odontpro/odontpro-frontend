import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BannerEspecialidad} from '../../../../shared/components/banner-especialidad/banner-especialidad';
import {Router} from '@angular/router';

@Component({
  selector: 'app-rehabilitacion',
  standalone: true,
  imports: [CommonModule, BannerEspecialidad],
  templateUrl: './rehabilitacion.html',
  styleUrl: './rehabilitacion.css',
})
export class Rehabilitacion {
  tabActiva = 0;
  currentFaseIndex = 0;
  fasesPerPage = 3;

  constructor(private router: Router) {
    this.updatePerPage();
  }

  irAFundamentos() {
    const rutaActual = this.router.url;
    this.router.navigate([`${rutaActual}/fundamentos`]);
  }

  @HostListener('window:resize')
  updatePerPage() {
    this.fasesPerPage = window.innerWidth < 768 ? 1 : (window.innerWidth < 1100 ? 2 : 3);
  }

  tabsEspecialidad = [
    {
      titulo: "Prótesis Fija",
      subtitulo: "Protocolo de Restauración Indirecta",
      intro: "Procedimientos para coronas y puentes sobre dientes naturales.",
      detalles: [
        { nombre: "Tallado Biomecánico", descripcion: "Preparación de pilares con líneas de terminación definidas y respeto al espesor biológico.", imgUrl: "https://picsum.photos/400/300?fixed-1" },
        { nombre: "Gestión de Tejidos", descripcion: "Uso de hilos retractores para exponer el margen gingival antes de la impresión.", imgUrl: "https://picsum.photos/400/300?fixed-2" },
        { nombre: "Impresión Definitiva", descripcion: "Técnica de doble mezcla con siliconas de adición o escaneo digital.", imgUrl: "https://picsum.photos/400/300?fixed-3" },
        { nombre: "Prueba de Estructura", descripcion: "Verificación de ajuste marginal y espacio para la cerámica en metal o zirconio.", imgUrl: "https://picsum.photos/400/300?fixed-4" },
        { nombre: "Cementación", descripcion: "Protocolos de adhesión según el sustrato (cerámica ácida o zirconio).", imgUrl: "https://picsum.photos/400/300?fixed-5" }
      ]
    },
    {
      titulo: "Prótesis Removible y Total",
      subtitulo: "Protocolo de Grandes Rehabilitaciones",
      intro: "Restauración de pacientes edéntulos parciales o totales.",
      detalles: [
        { nombre: "Diseño de Estructura", descripcion: "Análisis de paralelismo, apoyos y retenedores en modelos de estudio.", imgUrl: "https://picsum.photos/400/300?removable-1" },
        { nombre: "Dimensión Vertical", descripcion: "Determinación de la altura facial óptima y espacio interoclusal.", imgUrl: "https://picsum.photos/400/300?removable-2" },
        { nombre: "Relación Céntrica", descripcion: "Registro de la posición maxilo-mandibular más estable y repetible.", imgUrl: "https://picsum.photos/400/300?removable-3" },
        { nombre: "Prueba de Enfilado", descripcion: "Evaluación estética y fonética de los dientes montados en cera.", imgUrl: "https://picsum.photos/400/300?removable-4" },
        { nombre: "Instalación", descripcion: "Ajuste de flancos, alivio de zonas de presión y enseñanza de higiene.", imgUrl: "https://picsum.photos/400/300?removable-5" }
      ]
    }
  ];

  nextFase() {
    const total = this.tabsEspecialidad[this.tabActiva].detalles.length;
    if (this.currentFaseIndex < total - this.fasesPerPage) this.currentFaseIndex++;
  }

  prevFase() {
    if (this.currentFaseIndex > 0) this.currentFaseIndex--;
  }

  cambiarTab(i: number) {
    this.tabActiva = i;
    this.currentFaseIndex = 0;
  }
}
