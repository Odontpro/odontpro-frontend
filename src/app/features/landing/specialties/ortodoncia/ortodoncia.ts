import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-ortodoncia',
  standalone: true,
  imports: [CommonModule, MatTabsModule, MatButton],
  templateUrl: './ortodoncia.html',
  styleUrl: './ortodoncia.css',
})
export class Ortodoncia {

  activeTabIndex: number = 0;
  readonly TOTAL_TABS: number = 7;

  nextTab() {
    if (this.activeTabIndex < this.TOTAL_TABS - 1) {
      this.activeTabIndex++;
      this.scrollToTabGroup();
    }
  }

  prevTab() {
    if (this.activeTabIndex > 0) {
      this.activeTabIndex--;
      this.scrollToTabGroup();
    }
  }

  onTabChange(index: number) {
    this.activeTabIndex = index;
    this.scrollToTabGroup();
    console.log("tab tap")
  }

  // Función opcional para volver arriba al cambiar de pestaña
  private scrollToTabGroup() {
    setTimeout(() => {
      const element = document.getElementById('tab-group-nav');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 50);
  }

  // Datos estructurados del contenido
  definicion = {
    texto: 'Ortodoncia es la rama de la odontología que se encarga del estudio, prevención, diagnóstico y tratamiento de las anomalías de forma, posición, relación y función de las estructuras dentomaxilofaciales; siendo su ejercicio el arte de prevenir, diagnosticar y corregir sus posibles alteraciones y mantenerlas dentro de un estado óptimo de salud y armonía, mediante el uso y control de diferentes tipos de fuerzas.',
    autor: 'Dr. William R. Proffit - Contemporary Orthodontics 2018'
  };

  diagnostico = {
    subsecciones: [
      {
        titulo: '1. Historia Clínica Completa',
        items: [
          'Antecedentes médicos generales (enfermedades sistémicas, medicación)',
          'Historia dental (hábitos, traumatismos, tratamientos previos)',
          'Crecimiento y desarrollo (edad ósea vs. edad cronológica)',
          'Antecedentes familiares (herencia de maloclusiones)'
        ]
      },
      {
        titulo: '2. Examen Clínico Extrabucal',
        items: [
          'Análisis facial (frontal y perfil)',
          'Proporciones faciales (tercios faciales)',
          'Ángulo nasolabial',
          'Competencia labial',
          'Análisis de la sonrisa (exposición gingival, línea media)',
          'Función ATM y muscular'
        ]
      },
      {
        titulo: '3. Examen Clínico Intrabucal',
        items: [
          'Estado de higiene oral y salud periodontal',
          'Presencia de caries o patologías',
          'Análisis dentario (número, forma, tamaño)',
          'Relación oclusal (Angle, sagital, vertical y transversal)',
          'Espacios disponibles vs. requeridos',
          'Análisis de curvas de Spee y Wilson'
        ]
      }
    ],
    documentacion: {
      titulo: '4. Documentación Complementaria Obligatoria',
      apartados: [
        {
          subtitulo: 'A. Radiografías:',
          items: [
            'Panorámica (evalúa presencia de todos los dientes, desarrollo radicular, patologías)',
            'Telerradiografía lateral de cráneo (análisis cefalométrico)',
            'Telerradiografía frontal (evaluación de asimetrías)',
            'Radiografía de mano y muñeca (edad ósea en pacientes en crecimiento)',
            'CBCT (solo en casos específicos: dientes impactados complejos, asimetrías severas)'
          ]
        },
        {
          subtitulo: 'B. Modelos de Estudio:',
          items: [
            'Impresiones de alginato o escaneado digital',
            'Montaje en articulador (idealmente semiajustable)',
            'Análisis de modelos (espacio, Bolton, Carey)'
          ]
        },
        {
          subtitulo: 'C. Fotografías:',
          items: [
            'Extraorales: Frontal en reposo, frontal sonriendo, perfil derecho, perfil izquierdo, 3/4',
            'Intraorales: Frontal oclusal, lateral derecho, lateral izquierdo, oclusal superior, oclusal inferior'
          ]
        }
      ]
    },
    analisis: {
      titulo: '5. Análisis Cefalométrico (Proffit)',
      items: [
        'Análisis de Downs',
        'Análisis de Steiner',
        'Análisis de Ricketts',
        'Análisis de McNamara',
        'Análisis de Tweed',
        'Análisis de Wits',
        'Análisis de Harvold'
      ]
    },
    diagnosticoFinal: {
      titulo: '6. Diagnóstico y Lista de Problemas',
      items: [
        'Problemas esqueléticos (sagitales, verticales, transversales)',
        'Problemas dentoalveolares',
        'Problemas funcionales (respiración, deglución, hábitos)',
        'Problemas estéticos',
        'Determinación del patrón de crecimiento (hiper, normo, hipodivergente)'
      ]
    }
  };

  tiposTratamiento = {
    interceptiva: {
      titulo: '1. ORTODONCIA INTERCEPTIVA (Preventiva e Interceptiva)',
      objetivo: 'Interceptar y eliminar hábitos o interferencias que puedan producir maloclusiones establecidas.',
      edad: '6-10 años (dentición mixta temprana)',
      procedimientos: [
        'Mantenedores de espacio',
        'Disyuntores palatinos para mordida cruzada posterior',
        'Aparatos para hábitos (rejilla lingual, pantalla oral)',
        'Guía de erupción',
        'Extracciones seriadas'
      ],
      imagenes: [
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500',
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500'
      ]
    },
    ortopedia: {
      titulo: '2. ORTOPEDIA DENTOFACIAL',
      objetivo: 'Modificar el crecimiento y desarrollo de los maxilares en pacientes en crecimiento.',
      edad: '8-14 años (pico de crecimiento puberal)',
      aparatologia: [
        {
          tipo: 'Sagital',
          items: 'Aparatos funcionales (Twin Block, Bionator, Activator, Herbst)'
        },
        {
          tipo: 'Transversal',
          items: 'Expansores rápidos (Hyrax, Haas), Quad-Helix'
        },
        {
          tipo: 'Vertical',
          items: 'Aparatos de anclaje extraoral (Bionator con plano de mordida)'
        },
        {
          tipo: 'Clase III',
          items: 'Máscara facial, chincup, disyuntor/máscara facial combinado'
        }
      ],
      imagenes: [
        'https://images.unsplash.com/photo-1609961668941-5fa11a2c1da6?w=500',
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500',
        'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=500'
      ]
    },
    correctiva: {
      titulo: '3. ORTODONCIA CORRECTIVA CON APARATOLOGÍA FIJA',
      objetivo: 'Alinear y nivelar arcadas, corregir maloclusiones establecidas.',
      tipos: [
        {
          nombre: 'A. METÁLICOS CONVENCIONALES',
          ventajas: 'Costo, resistencia, amplia biblioteca de arcos',
          desventajas: 'Estética, fricción',
          sistemas: 'Roth, MBT, Alexander, Straight-Wire'
        },
        {
          nombre: 'B. ESTÉTICOS',
          subtipos: [
            'Cerámicos: Alta estética, fragilidad, mayor fricción',
            'Policarbonato: Translúcidos, menor resistencia',
            'Zafiro: Transparentes, alta dureza, costo elevado'
          ]
        },
        {
          nombre: 'C. AUTOLIGADO',
          pasivos: 'Damon, In-Ovation, SmartClip',
          activos: 'Speed, Time',
          ventajas: 'Menor fricción, citas más espaciadas, posible menor tiempo de tratamiento',
          desventajas: 'Costo, técnica sensible'
        }
      ],
      imagenes: [
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=400',
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=400',
        'https://images.unsplash.com/photo-1609961668941-5fa11a2c1da6?w=400'
      ]
    },
    alineadores: {
      titulo: '4. ORTODONCIA CON ALINEADORES TRANSPARENTES (NUEVOS AVANCES)',
      sistemas: 'Invisalign (Align Technology), ClearCorrect, Spark',
      ventajas: [
        'Estética óptima',
        'Removibilidad (higiene oral facilitada)',
        'Menos urgencias',
        'Tecnología digital (ClinCheck, planificación 3D)'
      ],
      limitaciones: [
        'Dependencia de la colaboración del paciente',
        'Control limitado en movimientos complejos (rotaciones, extrusiones)',
        'Costo'
      ],
      indicaciones: [
        'Casos leves a moderados',
        'Apiñamiento leve a moderado',
        'Espacios menores',
        'Pacientes adultos estéticos'
      ],
      imagenes: [
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400',
        'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=400'
      ]
    }
  };

  aditamentos = {
    microimplantes: {
      titulo: '1. MICROIMPLANTES O MINI-IMPLANTES (TADs - Temporary Anchorage Devices)',
      usos: [
        'Anclaje absoluto (intrusión, distalización, cierre de espacios)',
        'Corrección de asimetrías',
        'Movimientos dentarios que antes requerían cirugía'
      ],
      caracteristicas: [
        'Diámetros: 1.2-2.0 mm',
        'Longitudes: 6-12 mm',
        'Carga inmediata (2-3 semanas)',
        'Sitios de colocación: Cresta alveolar, paladar, apófisis cigomática, rama mandibular'
      ],
      imagenes: [
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500',
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500'
      ]
    },
    disyuntores: {
      titulo: '2. DISYUNTORES PALATINOS Y DISTRACCIÓN OSTEOCÉNICA',
      expansion: {
        subtitulo: 'A. Expansión Rápida del Maxilar',
        tipos: [
          'Hyrax: Expansor fijo, tornillo central',
          'Haas: Con acrílico palatino, mayor expansión tisular',
          'MARPE (Micro-Implant Assisted Rapid Palatal Expander): Expansión esquelética en adultos jóvenes y adultos, anclaje óseo mediante mini-implantes, menor inclinación dental'
        ]
      },
      mandibular: {
        subtitulo: 'B. Disyuntores Mandibulares',
        descripcion: 'Para expansión mandibular (indicación limitada)'
      },
      imagenes: [
        'https://images.unsplash.com/photo-1609961668941-5fa11a2c1da6?w=500',
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500',
        'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=500'
      ]
    },
    extrabucal: {
      titulo: '3. APARATOLOGÍA EXTRABUCAL',
      items: [
        'Máscara Facial: Corrección de Clase III esquelética',
        'Tracción Cervical/Parietal: Distalización de molares, inhibición de crecimiento maxilar',
        'Chin Cup: Inhibición de crecimiento mandibular en Clase III',
        'J-Hook: Intrusión/Retracción de incisivos'
      ]
    },
    otros: {
      titulo: '4. OTROS ADITAMENTOS',
      items: [
        'Barras Transpalatinas: Anclaje, control de rotación',
        'Arco Lingual: Control de versión, anclaje',
        'Resinas de Mordida: Desprogramación, corrección de mordida cruzada',
        'Elásticos Intermaxilares: Clase II, Clase III, cierre de mordida abierta'
      ]
    }
  };

  etapasBrackets = {
    etapa1: {
      titulo: 'Etapa 1: Alineación y Nivelación',
      arcos: 'NiTi superelásticos (0.014", 0.016")',
      duracion: '3-6 meses',
      objetivo: 'Eliminar apiñamiento, corrotaciones, alinear márgenes gingivales',
      imagenes: [
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500',
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500'
      ]
    },
    etapa2: {
      titulo: 'Etapa 2: Corrección de la Curva de Spee y Espacios',
      arcos: 'NiTi o SS (0.016x0.022, 0.019x0.025)',
      objetivos: [
        'Cierre de espacios (si se requirieron extracciones)',
        'Corrección de la relación molar y canina'
      ],
      imagenes: [
        'https://images.unsplash.com/photo-1609961668941-5fa11a2c1da6?w=500',
        'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500'
      ]
    },
    etapa3: {
      titulo: 'Etapa 3: Terminación y Detallado',
      arcos: 'SS (0.019x0.025)',
      procedimientos: [
        'Asentamiento de la oclusión',
        'Corrección de detalles (contactos interproximales, torque individual)',
        'Uso de elásticos para ajuste oclusal final'
      ],
      imagenes: [
        'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?w=500',
        'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500'
      ]
    },
    etapa4: {
      titulo: 'Etapa 4: Retiro de Brackets y Cementado de Retenedores',
      procedimientos: [
        'Remoción cuidadosa con pinzas de debracketing',
        'Eliminación de cemento con fresa de pulido',
        'Pulido profesional con pastas de profilaxis'
      ],
      imagenes: [
        'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500'
      ]
    }
  };

  retencion = {
    tipos: {
      fijos: {
        titulo: 'A. FIJOS',
        items: [
          'Ferulización lingual 3-3 o 4-4: Alambre redondo o trenzado cementado',
          'Retenedor de banda y alambre: En canino a canino',
          'Indicaciones: Apiñamiento inferior, diastemas medianos'
        ]
      },
      removibles: {
        titulo: 'B. REMOVIBLES',
        items: [
          'Hawley: Acero y acrílico, permite pequeños movimientos',
          'Esquelético: Mayor retención',
          'Posicionadores: Terminación final, corrección menor',
          'Retenedores Termoformados (Essix): Estéticos, cubren toda la corona'
        ]
      }
    },
    protocolo: {
      titulo: '2. Protocolo de Retención (Proffit)',
      fases: [
        {
          nombre: 'Fase Activa (6-12 meses)',
          descripcion: 'Uso full-time (24 horas excepto para comer)',
          control: 'Control mensual'
        },
        {
          nombre: 'Fase Pasiva (Segundo año)',
          descripcion: 'Uso nocturno',
          control: 'Controles cada 3-6 meses'
        },
        {
          nombre: 'Fase de Mantenimiento (Años subsiguientes)',
          descripcion: 'Uso 2-3 noches por semana indefinidamente',
          control: 'Controles anuales'
        }
      ]
    },
    recidiva: {
      titulo: '3. Factores de Recidiva y Prevención',
      factores: [
        'Crecimiento residual (especialmente en Clase III)',
        'Cambios por envejecimiento',
        'Presión de tejidos blandos (lengua, labios)',
        'Hábitos parafuncionales',
        'Inestabilidad periodontal'
      ]
    },
    imagenes: [
      'https://images.unsplash.com/photo-1609961668941-5fa11a2c1da6?w=500',
      'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=500'
    ]
  };

  mantenimiento = {
    higiene: {
      titulo: '1. Control de Higiene Oral',
      items: [
        'Instrucciones personalizadas (cepillo ortodóncico, cepillos interproximales, hilo superfloss)',
        'Enjuagues con clorhexidina 0.12% si hay gingivitis',
        'Control de placa profesional cada 4-6 meses'
      ]
    },
    periodontal: {
      titulo: '2. Monitoreo de Salud Periodontal',
      items: [
        'Sondaje periodontal periódico',
        'Control de recesiones gingivales',
        'Evaluación de pérdida de inserción'
      ]
    },
    emergencias: {
      titulo: '3. Manejo de Emergencias',
      items: [
        'Descementados',
        'Fracturas de arcos',
        'Ulceras y traumatismos',
        'Alergias (látex, níquel)'
      ]
    }
  };

  consideraciones = [
    '"El diagnóstico correcto es el 90% del tratamiento exitoso" - Nunca iniciar tratamiento sin documentación completa.',
    '"La biología dicta los límites, la mecánica proporciona los medios" - Respetar la fisiología del movimiento dental.',
    '"La retención es para siempre" - Educar al paciente sobre la necesidad de retención indefinida.',
    '"La ortodoncia moderna es multidisciplinaria" - Coordinar con periodoncistas, cirujanos, prostodoncistas cuando sea necesario.',
    '"La tecnología es una herramienta, no un sustituto del conocimiento" - Los alineadores y TADs son medios, no fines en sí mismos.'
  ];

  conclusion = 'Este protocolo integral, basado en la evidencia científica y la experiencia clínica de Proffit y otros autores de renombre, proporciona un marco completo para la práctica de la ortodoncia contemporánea, desde el diagnóstico hasta el mantenimiento a largo plazo.';
}
