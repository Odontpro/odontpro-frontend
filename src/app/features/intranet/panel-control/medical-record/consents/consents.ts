import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';

interface ConsentTemplate {
  id: number;
  date: string;
  title: string;
}

@Component({
  selector: 'app-consents',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './consents.html',
  styleUrl: './consents.css',
})
export class Consents implements OnInit {
  // Datos basados en tu captura del 27 Mar 2026
  templates: ConsentTemplate[] = [
    {
      id: 1,
      date: '27 Mar 2026',
      title: 'CONSENTIMIENTO INFORMADO PARA TELEORIENTACION Y TELEMONITOREO'
    }
  ];

  signedConsents: any[] = []; // Inicialmente vacío como en tu imagen

  constructor() {}

  ngOnInit(): void {}

  onCreateConsent() {
    console.log('Abriendo selector de plantillas para firmar...');
  }

  onShare(id: number) { console.log('Compartiendo plantilla', id); }
  onEdit(id: number) { console.log('Editando plantilla', id); }
  onDelete(id: number) { console.log('Eliminando plantilla', id); }
}
