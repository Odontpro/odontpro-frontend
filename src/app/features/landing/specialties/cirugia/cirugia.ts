import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BannerEspecialidad} from '../../../../shared/components/banner-especialidad/banner-especialidad';

@Component({
  selector: 'app-cirugia',
  standalone: true,
  imports: [CommonModule, BannerEspecialidad],
  templateUrl: './cirugia.html',
  styleUrl: './cirugia.css',
})
export class Cirugia {
  currentFaseIndex = 0;
  fasesPerPage = 3;

  constructor() {
    this.updatePerPage();
  }

  @HostListener('window:resize')
  updatePerPage() {
    this.fasesPerPage = window.innerWidth < 768 ? 1 : (window.innerWidth < 1100 ? 2 : 3);
  }

  fasesCompletas = [
    {
      nombre: "Fase 1: Historia Clínica",
      descripcion: "Anamnesis y declaración jurada para identificar riesgos sistémicos y antecedentes de hemorragia.",
      imgUrl: "https://picsum.photos/400/300?medical-form"
    },
    {
      nombre: "Fase 2: Diagnóstico",
      descripcion: "Evaluación del motivo de consulta y planeamiento radiográfico detallado del caso.",
      imgUrl: "https://picsum.photos/400/300?xray"
    },
    {
      nombre: "Fase 3: Asepsia y Anestesia",
      descripcion: "Preparación del campo estéril y bloqueo nervioso profundo para un acto quirúrgico indoloro.",
      imgUrl: "https://picsum.photos/400/300?anesthesia"
    },
    {
      nombre: "Fase 4: Incisión",
      descripcion: "Uso de hoja #15 sobre hueso sano, diseñando un colgajo de base ancha para asegurar vascularización.",
      imgUrl: "https://picsum.photos/400/300?scalpel"
    },
    {
      nombre: "Fase 5: Despegamiento",
      descripcion: "Levantamiento del colgajo mucoperióstico de forma atraumática con periostótomo.",
      imgUrl: "https://picsum.photos/400/300?periostotomo"
    },
    {
      nombre: "Fase 6: Acto Quirúrgico",
      descripcion: "Osteotomía refrigerada, sección coronaria o enucleación de quistes con técnica precisa.",
      imgUrl: "https://picsum.photos/400/300?dentist-drill"
    },
    {
      nombre: "Fase 7: Acondicionamiento",
      descripcion: "Curetaje alveolar, eliminación de tejidos patológicos y regularización de bordes óseos.",
      imgUrl: "https://picsum.photos/400/300?cleaning"
    },
    {
      nombre: "Fase 8: Sutura (Síntesis)",
      descripcion: "Reposición de tejidos con Monocryl 4/0 o Seda 3/0 usando aguja de 3/8 de círculo.",
      imgUrl: "https://picsum.photos/400/300?suture"
    },
    {
      nombre: "Fase 9: Control Inmediato",
      descripcion: "Compresión con gasa (30-60 min) y aplicación de frío local para prevenir el edema.",
      imgUrl: "https://picsum.photos/400/300?ice-pack"
    },
    {
      nombre: "Fase 10: Seguimiento",
      descripcion: "Control de cicatrización a las 48h y retiro de puntos tras 7-10 días.",
      imgUrl: "https://picsum.photos/400/300?checkup"
    }
  ];

  nextFase() {
    if (this.currentFaseIndex < this.fasesCompletas.length - this.fasesPerPage) this.currentFaseIndex++;
  }

  prevFase() {
    if (this.currentFaseIndex > 0) this.currentFaseIndex--;
  }
}
