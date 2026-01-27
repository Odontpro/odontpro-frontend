import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BannerEspecialidad} from '../../../../shared/components/banner-especialidad/banner-especialidad';
import {Router} from '@angular/router';

@Component({
  selector: 'app-radiologia',
  standalone: true,
  imports: [CommonModule, BannerEspecialidad],
  templateUrl: './radiologia.html',
  styleUrl: './radiologia.css',
})
export class Radiologia {
  etapaActiva = 0;

  constructor(private router: Router) {}

  irAFundamentos() {
    const rutaActual = this.router.url;
    this.router.navigate([`${rutaActual}/fundamentos`]);
  }

  tecnologias = [
    {
      titulo: "Radiografía Periapical",
      uso: "Evaluación detallada de corona, raíz y espacio periodontal.",
      ventaja: "Alta resolución y mínima dosis."
    },
    {
      titulo: "Tomografía CBCT (3D)",
      uso: "Planificación de implantes, cirugías y endodoncia compleja.",
      ventaja: "Visión tridimensional exacta sin superposición."
    },
    {
      titulo: "Radiografía Panorámica",
      uso: "Visión general de maxilares, senos y ATM.",
      ventaja: "Screening inicial rápido y cómodo."
    }
  ];

  procesoInterpretacion = [
    { fase: "01", titulo: "Análisis de Imagen", desc: "Evaluación de la calidad técnica, contraste y área anatómica cubierta." },
    { fase: "02", titulo: "Descripción de Hallazgos", desc: "Identificación de contornos, consistencia y presencia de calcificaciones." },
    { fase: "03", titulo: "Diagnóstico Diferencial", desc: "Correlación de signos radiográficos con la clínica del paciente." },
    { fase: "04", titulo: "Emisión de Informe", desc: "Documento legal con hallazgos diagnósticos y recomendaciones." }
  ];

  seleccionarEtapa(index: number) {
    this.etapaActiva = index;
  }
}
