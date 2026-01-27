import { CommonModule } from '@angular/common';
import {Component} from '@angular/core';
import {BannerEspecialidad} from '../../../../shared/components/banner-especialidad/banner-especialidad';
import {Router} from '@angular/router';

@Component({
  selector: 'app-odontologia-estetica',
  standalone: true,
  imports: [CommonModule, BannerEspecialidad],
  templateUrl: './odontologia-estetica.html',
  styleUrl: './odontologia-estetica.css',
})
export class OdontologiaEstetica {

  constructor(private router: Router) {}

  irAFundamentos() {
    const rutaActual = this.router.url;
    this.router.navigate([`${rutaActual}/fundamentos`]);
  }

  etapasPrincipales = [
    {
      num: "I",
      titulo: "Preoperatorio y Diagnóstico",
      desc: "Preparación y planificación integral: Análisis facial, dental y de la sonrisa."
    },
    {
      num: "II",
      titulo: "Acto Clínico y Operatorio",
      desc: "Ejecución del tratamiento: Desde el blanqueamiento hasta el cementado adhesivo."
    },
    {
      num: "III",
      titulo: "Postoperatorio y Mantenimiento",
      desc: "Cuidados para asegurar la longevidad y el resultado estético a largo plazo."
    }
  ];

  fasesDiseno = [
    {
      fase: "Fase 1",
      titulo: "Encerado de Diagnóstico",
      detalle: "Traducción tridimensional de los objetivos estéticos en modelos de estudio."
    },
    {
      fase: "Fase 2",
      titulo: "Maqueta Estética (Mock-up)",
      detalle: "Prueba reversible en boca que permite al paciente previsualizar su nueva sonrisa."
    },
    {
      fase: "Fase 3",
      titulo: "Preparación Mínimamente Invasiva",
      detalle: "Tallado selectivo preservando el esmalte según el encerado previo."
    },
    {
      fase: "Fase 4",
      titulo: "Provisionales Estéticos",
      detalle: "Protección y acondicionamiento gingival mientras se confecciona la cerámica final."
    }
  ];
}
