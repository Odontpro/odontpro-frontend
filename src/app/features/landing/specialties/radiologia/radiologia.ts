import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import {BannerEspecialidad} from '../../../../shared/components/banner-especialidad/banner-especialidad';
import {Router} from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-radiologia',
  standalone: true,
  imports: [CommonModule, BannerEspecialidad],
  templateUrl: './radiologia.html',
  styleUrl: './radiologia.css',
})
export class Radiologia implements OnInit, OnDestroy{
  etapaActiva = 0;
  scanTop = '0%';
  revealClip = 'inset(0 0 100% 0)';

  private progress = 0;
  private direction = 1;
  private animFrame!: number;

  ngOnInit() {
    this.animate();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animFrame);
  }

  private animate() {
    this.progress += 0.4 * this.direction;

    if (this.progress >= 100) { this.direction = -1; }
    if (this.progress <= 0)   { this.direction =  1; }

    this.scanTop = `${this.progress}%`;
    // clip-path revela la imagen 2 desde arriba hasta donde está el scanner
    this.revealClip = `inset(0 0 ${100 - this.progress}% 0)`;

    this.animFrame = requestAnimationFrame(() => this.animate());
  }

  constructor(private router: Router) {}

  irAFundamentos() {
    const rutaActual = this.router.url;
    this.router.navigate([`${rutaActual}/fundamentos`]);
  }

  tecnologias = [
    {
      titulo: "Radiografía Periapical",
      uso: "Evaluación detallada de corona, raíz y espacio periodontal.",
      ventaja: "Alta resolución y mínima dosis.",
      imageUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1772412521/periapical_ral96m.jpg"
    },
    {
      titulo: "Tomografía CBCT (3D)",
      uso: "Planificación de implantes, cirugías y endodoncia compleja.",
      ventaja: "Visión tridimensional exacta sin superposición.",
      imageUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1769556065/Imagen10_tidcvd.webp"
    },
    {
      titulo: "Radiografía Panorámica",
      uso: "Visión general de maxilares, senos y ATM.",
      ventaja: "Screening inicial rápido y cómodo.",
      imageUrl: "https://res.cloudinary.com/de3nau9kv/image/upload/v1772412487/panoramica_djqz2e.jpg"
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
