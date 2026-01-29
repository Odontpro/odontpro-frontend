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
      titulo: "Planificación y Registro de Precisión",
      subtitulo: "Del Diagnóstico a la Captura de Datos",
      intro: "Protocolos para el mantenimiento de la función, confort y salud.",
      detalles: [
        {
          nombre: "Diagnóstico Integral",
          descripcion: "Anamnesis, modelos en articulador semiajustable y análisis de la sonrisa.",
          imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769550863/Imagen2_ah0ms5.webp"
        },
        {
          nombre: "Técnica Análoga Élite",
          descripcion: "Impresiones con Siliconas por Adición (Panasil) mediante técnica de doble mezcla.",
          imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769550966/Imagen9_xjtqwd.webp"
        },
        {
          nombre: "Escaneo Digital Helios 600",
          descripcion: "Captura de alta precisión (≤ 10 μm) con flujo de trabajo eficiente y cómodo.",
          imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769551014/Imagen11_ve9ayf.webp"
        },
        {
          nombre: "Fase de Provisionales",
          descripcion: "Validación de función masticatoria, oclusión, estética y fonética en resina.",
          imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769550965/Imagen8_k7ov2k.webp"
        }
      ]
    },
    {
      titulo: "Sistemas de Rehabilitación Oral",
      subtitulo: "Prótesis Fija, Removible e Implantes",
      intro: "Restauración de piezas mediante sustitutos artificiales de alta gama.",
      detalles: [
        {
          nombre: "Coronas de Zirconia y e.max",
          descripcion: "Preparaciones biomecánicas con hombro redondeado y cementado adhesivo o dual.",
          imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769551546/Imagen27_ixtxwl.webp"
        },
        {
          nombre: "Puentes e Implantes",
          descripcion: "Planificación 3D, torque ≥35Ncm y restauraciones sobre pilares naturales o implantes.",
          imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769551668/Imagen34_lvroid.webp"
        },
        {
          nombre: "Prótesis Parcial y Total",
          descripcion: "Diseño con apoyos y bases extendidas para máxima retención y estabilidad.",
          imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769551817/Imagen42_z8jaom.webp"
        },
        {
          nombre: "Control y Mantenimiento",
          descripcion: "Ajuste oclusal final (papel 8-12μm) y seguimiento riguroso a largo plazo.",
          imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769551550/Imagen30_eyod9l.webp"
        }
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
