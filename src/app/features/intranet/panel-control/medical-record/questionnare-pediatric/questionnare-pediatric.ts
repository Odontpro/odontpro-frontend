import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-questionnare-pediatric',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatRadioModule,
    MatButtonModule
  ],
  templateUrl: './questionnare-pediatric.html',
  styleUrl: './questionnare-pediatric.css',
})
export class QuestionnarePediatric implements OnInit {
  form!: FormGroup;

  postnatalFields = [
    { key: 'problemasParto', label: '¿Problemas en el parto?' },
    { key: 'usoChupon', label: '¿Usó chupón?' },
    { key: 'usoBiberon', label: '¿Usó biberón?' },
    { key: 'succionaDedo', label: '¿Se chupa/chupaba el dedo?' },
    { key: 'tomaMedicacion', label: '¿Toma alguna medicación o terapia?' },
    { key: 'alergicoIntolerante', label: '¿Es alérgico o intolerante a algo?' },
    { key: 'cepillaAntesDormir', label: '¿Se cepilla antes de dormir?' },
    { key: 'duermeBocaAbierta', label: '¿Duerme con la boca abierta o ronca?' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      // SECCIÓN
      motivoConsulta: [''],
      nombreMama: [''],
      nombrePapa: [''],
      numeroHermanos: [''],
      ordenNacimiento: [''],

      // ENFERMEDAD ACTUAL
      tipoEnfermedad: [''],
      relatoCronologico: [''],

      // ANTECEDENTES PRENATALES
      enfermedadesMaternas: [''],
      complicacionesEmbarazo: [''],
      bebePrematuro: [''],
      pesoNacer: [''],
      comentarioPrenatal: [''],

      // ANTECEDENTES POSTNATALES (Booleanos + Detalles)
      problemasParto: [null], problemasPartoDetalle: [''],
      usoChupon: [null], usoChuponDetalle: [''],
      usoBiberon: [null], usoBiberonDetalle: [''],
      succionaDedo: [null], succionaDedoDetalle: [''],
      tomaMedicacion: [null], tomaMedicacionDetalle: [''],
      alergicoIntolerante: [null], alergicoIntoleranteDetalle: [''],
      cepillaAntesDormir: [null], cepillaAntesDormirDetalle: [''],
      duermeBocaAbierta: [null], duermeBocaAbiertaDetalle: [''],
      comentarioPostnatal: [''],

      // HÁBITOS Y EXAMEN
      cuantoDulce: [''],
      frecuenciaDulce: [''],
      tipoLeche: [''],
      lavadoDientes: [''],
      descripcionComida: [''],
      perfilPadre: [''],
      habitosOrales: [''],
      tecnicaCepillado: [''],
      examenClinico: [''],
      observaciones: ['']
    });
  }

  save() {
    console.log('Datos Guardados:', this.form.value);
  }
}
