import { CommonModule } from '@angular/common';
import {Component} from '@angular/core';
import {BannerEspecialidad} from '../../../../shared/components/banner-especialidad/banner-especialidad';
import {Router} from '@angular/router';

@Component({
  selector: 'app-implantologia',
  standalone: true,
  imports: [CommonModule, BannerEspecialidad],
  templateUrl: './implantologia.html',
  styleUrl: './implantologia.css',
})
export class Implantologia {

  constructor(private router: Router) {}

  irAFundamentos() {
    const rutaActual = this.router.url;
    this.router.navigate([`${rutaActual}/fundamentos`]);
  }

  fasesMisch = [
    {
      num: "01",
      titulo: "Diagnóstico Integral y Planificación Protésica-Guiada",
      desc: "Determinación de la viabilidad y posición ideal. 'La prótesis planifica la cirugía'."
    },
    {
      num: "02",
      titulo: "Terapia Pre-Implantaria",
      desc: "Preparación del terreno biológico: salud periodontal, extracciones indicadas y adecuación ósea."
    },
    {
      num: "03",
      titulo: "Cirugía Implantar",
      desc: "Colocación del implante con técnica atraumática para preservar la vitalidad del hueso."
    },
    {
      num: "04",
      titulo: "Osteointegración",
      desc: "Fase de curación y conexión estructural directa entre el hueso vivo y la superficie del implante."
    },
    {
      num: "05",
      titulo: "Restauración Protésica",
      desc: "Fase rehabilitadora donde se instala la prótesis bajo principios de biomecánica oclusal."
    },
    {
      num: "06",
      titulo: "Mantenimiento Peri-Implantar",
      desc: "Fase crítica de supervivencia a largo plazo y control de la salud de los tejidos blandos."
    }
  ];

  consejosClave = [
    "La prótesis planifica la cirugía, no al revés.",
    "La osteointegración es una respuesta biológica predecible a un trauma controlado.",
    "No existe implante sin mantenimiento; la periimplantitis es el principal riesgo.",
    "La biología dicta el tiempo, la biomecánica dicta el diseño.",
    "Más implantes no siempre es mejor; la ubicación estratégica es la clave."
  ];
}
