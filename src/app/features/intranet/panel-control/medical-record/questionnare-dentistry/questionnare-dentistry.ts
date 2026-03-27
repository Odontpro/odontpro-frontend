import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-questionnare-dentistry',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatExpansionModule,
    MatCheckboxModule,
    MatButtonModule,
    MatRadioModule
  ],
  templateUrl: './questionnare-dentistry.html',
  styleUrl: './questionnare-dentistry.css',
})
export class QuestionnareDentistry implements OnInit {
  questionnaireForm!: FormGroup;
  selectedDoctor: string = '';

  doctors = [
    { id: 1, name: 'Diego Talledo Sanchez' },
    { id: 2, name: 'Dr. Juan Pérez' },
    { id: 3, name: 'Dra. María García' }
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.questionnaireForm = this.fb.group({
      // Sección: Información del Doctor
      doctor: ['', Validators.required],

      // ENFERMEDAD ACTUAL
      motivoConsulta: ['', [Validators.required, Validators.minLength(3)]],
      tiempoEnfermedad: ['', Validators.required],
      signosSintomas: ['', Validators.required],
      relatoCronologico: [''],
      funcionesBiologicas: [''],

      // ANTECEDENTES
      antecedentesFamiliares: [''],
      antecedentesPersonales: [''],

      // ¿Tiene o ha tenido?
      presionAlta: [false],
      presionBaja: [false],
      hepatitis: [false],
      gastritis: [false],
      ulceras: [false],
      vih: [false],
      diabetes: [false],
      asma: [false],
      fuma: [false],

      // Campos con texto adicional
      comentarioAdicional: [''],
      enfermedadesSanguineas: [false],
      enfermedadesSanguineasDetalle: [''],
      problemasCardiacos: [false],
      problemasCardiacosDetalle: [''],
      otraEnfermedad: [false],
      otraEnfermedadDetalle: [''],

      // Preguntas con respuesta numérica o de texto
      vecesCepilloDientes: ['', [Validators.min(0), Validators.max(10)]],
      sangraEncias: [false],
      sangraEnciasDetalle: [''],
      hemorragiasAnormales: [false],
      hemorragiasAnormalesDetalle: [''],
      rechinarDientes: [false],
      rechinarDientesDetalle: [''],
      otrasMolestias: [false],
      otrasMolestiasDetalle: [''],
      alergias: [false],
      alergiasDetalle: [''],
      operacionGrande: [false],
      operacionGrandeDetalle: [''],
      medicacionPermanente: [false],
      medicacionPermanenteDetalle: [''],

      // EXAMEN CLÍNICO
      // Signos vitales
      presionArterial: ['', [Validators.pattern(/^\d+$/)]],
      frecuenciaCardiaca: ['', [Validators.pattern(/^\d+$/)]],
      temperatura: ['', [Validators.pattern(/^\d+\.?\d*$/)]],
      frecuenciaRespiratoria: ['', [Validators.pattern(/^\d+$/)]],

      // Exámenes
      examenExtraoral: [''],
      examenIntraoral: [''],
      resultadoExamenesAuxiliares: [''],
      observaciones: ['']
    });
  }

  onSubmit(): void {
    if (this.questionnaireForm.valid) {
      console.log('Formulario válido:', this.questionnaireForm.value);
      // Aquí enviarías los datos al backend
    } else {
      console.log('Formulario inválido');
      this.markFormGroupTouched(this.questionnaireForm);
    }
  }

  // Marcar todos los campos como touched para mostrar errores
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }

  // Helpers para validación
  hasError(field: string, error: string): boolean {
    const control = this.questionnaireForm.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }

  isFieldInvalid(field: string): boolean {
    const control = this.questionnaireForm.get(field);
    return !!(control?.invalid && control?.touched);
  }
}
