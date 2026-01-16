import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import {BannerEspecialidad} from '../../../../shared/components/banner-especialidad/banner-especialidad';

@Component({
  selector: 'app-endodoncia',
  standalone: true,
  imports: [CommonModule, MatExpansionModule, BannerEspecialidad],
  templateUrl: './endodoncia.html',
  styleUrl: './endodoncia.css',
})
// ... imports y decorador se mantienen igual

export class Endodoncia {
  tabActiva = 0;

  // FASES 1 A 4: EL PROCESO OPERATORIO
  tabsFases = [
    {
      titulo: "Fase 1-2",
      subtitulo: "Diagnóstico y Preparación",
      intro: "La precisión inicial define el éxito de la terapia endodóntica.",
      detalles: [
        {
          nombre: "Fase 1: Diagnóstico y Planificación",
          descripcion: "Evaluación exhaustiva de la viabilidad pulpar y periapical.",
          detalleExtendido: `
          <ul>
            <li><strong>Clínica:</strong> Pruebas de percusión, palpación y vitalidad (frío/calor/EPT).</li>
            <li><strong>Radiología:</strong> Técnica de cono largo y análisis de anatomía radicular.</li>
            <li><strong>CBCT:</strong> Uso de Tomografía para casos de anatomía compleja o sospecha de fracturas.</li>
          </ul>`,
          imgUrl: "https://picsum.photos/400/300?dentist-xray",
          abierto: false
        },
        {
          nombre: "Fase 2: Aislamiento Absoluto",
          descripcion: "Control total de la asepsia mediante campo estéril.",
          detalleExtendido: `
          <ul>
            <li><strong>Dique de Goma:</strong> Colocación obligatoria para evitar contaminación salival.</li>
            <li><strong>Desinfección:</strong> Uso de clorhexidina o hipoclorito en el campo operatorio.</li>
            <li><strong>Seguridad:</strong> Protección de la vía aérea y tejidos blandos del paciente.</li>
          </ul>`,
          imgUrl: "https://picsum.photos/400/300?medical-mask",
          abierto: false
        }
      ]
    },
    {
      titulo: "Fase 3-4",
      subtitulo: "Acceso y Desinfección",
      intro: "Localización y limpieza profunda del sistema de conductos.",
      detalles: [
        {
          nombre: "Fase 3: Acceso y Localización",
          descripcion: "Apertura cameral y ubicación de conductos mediante microscopía.",
          detalleExtendido: `
          <ul>
            <li><strong>Apertura:</strong> Diseño cavitario según la anatomía interna para acceso directo.</li>
            <li><strong>Tecnología:</strong> Localizadores electrónicos de ápice (LEA) y microscopio operativo.</li>
            <li><strong>Exploración:</strong> Uso de instrumentos DG-16 para identificar orificios de entrada.</li>
          </ul>`,
          imgUrl: "https://picsum.photos/400/300?microscope",
          abierto: false
        },
        {
          nombre: "Fase 4: Instrumentación y Química",
          descripcion: "Preparación biomecánica para eliminar la carga bacteriana.",
          detalleExtendido: `
          <ul>
            <li><strong>Cinemática:</strong> Uso de limas de NiTi rotatorias con técnica 'crown-down'.</li>
            <li><strong>Irrigación:</strong> Hipoclorito de Sodio activado por ultrasonido (PUI).</li>
            <li><strong>Protocolo Final:</strong> Eliminación del barrillo dentinario con EDTA.</li>
          </ul>`,
          imgUrl: "https://picsum.photos/400/300?dental-care",
          abierto: false
        }
      ]
    }
  ];

  // FASE 5: SECCIÓN DESTACADA (VIDEO/IMG)
  faseObturacion = {
    titulo: "Fase 5: Obturación Tridimensional",
    descripcion: "El objetivo es sellar herméticamente el sistema de conductos para prevenir reinfecciones.",
    puntos: [
      "Técnica de Onda Continua de Calor (Gutapercha Termoplastificada).",
      "Selección de cono maestro con ajuste apical (Tug-back).",
      "Uso de cementos selladores de alta biocompatibilidad (AH Plus)."
    ]
  };

  // FASES 6 Y 7: SECCIÓN DE CIERRE (CASOS)
  fasesFinales = [
    {
      id: 6,
      titulo: "Fase 6: Restauración",
      descripcion: "Sellado coronario inmediato. Es preferible la restauración definitiva inmediata (corona o incrustación) para proteger la pieza de fracturas."
    },
    {
      id: 7,
      titulo: "Fase 7: Seguimiento",
      descripcion: "Control clínico y radiográfico a los 6 meses y 1 año. Evaluamos la desaparición de lesiones y la reparación ósea."
    }
  ];
  faseFinalActiva = 0;

  seleccionarFaseFinal(i: number) { this.faseFinalActiva = i; }
}
