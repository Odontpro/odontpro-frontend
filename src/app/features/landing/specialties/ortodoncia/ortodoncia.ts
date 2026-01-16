import { CommonModule } from '@angular/common';
import {Component} from '@angular/core';

@Component({
  selector: 'app-ortodoncia',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ortodoncia.html',
  styleUrl: './ortodoncia.css',
})
export class Ortodoncia {

  documentacion = [
    { item: "Historia Clínica", desc: "Antecedentes sistémicos, hábitos (succión digital/deglución atípica) y herencia." },
    { item: "Radiografías", desc: "Panorámica, Cefalométrica Lateral, ATM y radiografía de mano para edad ósea." },
    { item: "Modelos & Scan", desc: "Impresiones o escaneado intraoral para análisis de discrepancia de modelos." },
    { item: "Set Fotográfico", desc: "8 fotos estándar: 3 extraorales y 5 intraorales para análisis facial y dental." }
  ];

  tiposTratamiento = [
    { titulo: "Ortodoncia Interceptiva", tipo: "Preventiva", desc: "Eliminación de hábitos y guía de erupción en dentición mixta." },
    { titulo: "Ortopedia Dentofacial", tipo: "Esquelética", desc: "Uso de fuerzas para redirigir el crecimiento de los maxilares." },
    { titulo: "Ortodoncia Correctiva", tipo: "Aparatología", desc: "Brackets (fija) o Alineadores (removible) para maloclusiones instauradas." }
  ];

  etapasClinicas = [
    { fase: "01", titulo: "Alineación y Nivelación", detalle: "Uso de arcos de NiTi para corregir rotaciones y nivelar la curva de Spee." },
    { fase: "02", titulo: "Cierre de Espacios", detalle: "Mecánica de deslizamiento para corregir el resalte (overjet) y la clase molar." },
    { fase: "03", titulo: "Finalización", detalle: "Detallado de oclusión, paralelismo radicular y estética de la línea media." },
    { fase: "04", titulo: "Retención", desc: "Estabilización mediante retenedores fijos o removibles (Hawley/Essix)." }
  ];

  analisisCefalo = ["Steiner", "Ricketts", "McNamara", "Downs", "Jarabak", "Wits"];
}
