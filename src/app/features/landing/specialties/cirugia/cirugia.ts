import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BannerEspecialidad} from '../../../../shared/components/banner-especialidad/banner-especialidad';
import {Router} from '@angular/router';

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

  fasesCompletas = [
    {
      nombre: "Fase 1: Evaluación Preoperatoria",
      descripcion: "Valoración de riesgo ASA, antecedentes médicos y estudio 3D mediante CBCT.",
      imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769554493/Imagen1_meyvty.webp"
    },
    {
      nombre: "Fase 2: Preparación Prequirúrgica",
      descripcion: "Compensación de patologías, profilaxis antibiótica y firma de consentimiento informado.",
      imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769554492/Imagen2_saol2s.webp"
    },
    {
      nombre: "Fase 3: Asepsia y Antisepsia",
      descripcion: "Lavado quirúrgico, campos estériles y enjuague con clorhexidina al 0.12-0.2%.",
      imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769554542/Imagen4_lzxnhy.webp"
    },
    {
      nombre: "Fase 4: Anestesia y Hemostasia",
      descripcion: "Técnica troncular o infiltrativa con vasoconstrictor para control del sangrado.",
      imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769554543/Imagen5_zvawct.webp"
    },
    {
      nombre: "Fase 5: Acceso Quirúrgico",
      descripcion: "Incisión con hoja #15 y despegamiento mucoperióstico atraumático del colgajo.",
      imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769554574/Imagen6_jiypko.webp"
    },
    {
      nombre: "Fase 6: Acto Quirúrgico Específico",
      descripcion: "Osteotomía, sección coronaria o quistectomía con irrigación de suero frío.",
      imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769554575/Imagen7_t21pxu.webp"
    },
    {
      nombre: "Fase 7: Revisión de la Cavidad",
      descripcion: "Alisado óseo, curetaje de detritos y lavado para asegurar un cierre limpio.",
      imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769710360/imagen11_vlcazk.webp"
    },
    {
      nombre: "Fase 8: Cierre y Sutura",
      descripcion: "Reposición de tejidos con Monocryl 4/0 o Seda 3/0 sin tensión excesiva.",
      imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769710360/imagen12_ixehwi.webp"
    },
    {
      nombre: "Fase 9: Control Inmediato",
      descripcion: "Compresión con gasa y crioterapia intermitente para reducir edema postoperatorio.",
      imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769710479/imagen13_yefpxm.webp"
    },
    {
      nombre: "Fase 10: Seguimiento",
      descripcion: "Retirada de puntos a los 7-10 días y control radiográfico de cicatrización.",
      imgUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769554619/Imagen10_rhsapr.webp"
    }
  ];

  nextFase() {
    if (this.currentFaseIndex < this.fasesCompletas.length - this.fasesPerPage) this.currentFaseIndex++;
  }

  prevFase() {
    if (this.currentFaseIndex > 0) this.currentFaseIndex--;
  }
}
