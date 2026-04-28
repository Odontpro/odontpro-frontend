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
import { MedicalHistoryService} from '../../../../../core/services/medical-history.service';
import { UserService} from '../../../../../core/services/user.service';

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
  providers: [MedicalHistoryService, UserService],
  templateUrl: './questionnare-dentistry.html',
  styleUrl: './questionnare-dentistry.css',
})
export class QuestionnareDentistry implements OnInit {
  questionnaireForm!: FormGroup;
  patientId = 1; // 👈 Esto debería ser dinámico
  doctors: any[] = []; // Se llenará desde el backend
  loading = false;

  constructor(
    private fb: FormBuilder,
    private medicalHistoryService: MedicalHistoryService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadDoctors();
    this.loadData();
  }
  loadDoctors(): void {
    this.userService.getDoctors().subscribe({
      next: (data) => {
        console.log('Datos recibidos de doctores:', data);
        this.doctors = data;
      },
      error: (err) => console.error('Error cargando doctores:', err)
    });
  }

  // 2. Carga de datos de la historia clínica desde el backend
  loadData(): void {
    this.loading = true;
    this.medicalHistoryService.getDentistry(this.patientId).subscribe({
      next: (data) => {
        if (data && Object.keys(data).length > 0) {
          this.questionnaireForm.patchValue({
            ...data,
            // Forzamos que sea un número para que coincida con el [value]="doctor.id"
            doctor: data.doctorId ? Number(data.doctorId) : ''
          });
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando datos:', err);
        this.loading = false;
      }
    });
  }

  initForm(): void {
    this.questionnaireForm = this.fb.group({
      doctor: ['', Validators.required],
      motivoConsulta: ['', [Validators.required, Validators.minLength(3)]],
      tiempoEnfermedad: [''],
      signosSintomas: [''],
      relatoCronologico: [''],
      funcionesBiologicas: [''],
      antecedentesFamiliares: [''],
      antecedentesPersonales: [''],
      presionAlta: [false],
      presionBaja: [false],
      hepatitis: [false],
      gastritis: [false],
      ulceras: [false],
      vih: [false],
      diabetes: [false],
      asma: [false],
      fuma: [false],
      comentarioAdicional: [''],
      enfermedadesSanguineas: [false],
      enfermedadesSanguineasDetalle: [''],
      problemasCardiacos: [false],
      problemasCardiacosDetalle: [''],
      otraEnfermedad: [false],
      otraEnfermedadDetalle: [''],
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
      presionArterial: [''],
      frecuenciaCardiaca: [''],
      temperatura: [''],
      frecuenciaRespiratoria: [''],
      examenExtraoral: [''],
      examenIntraoral: [''],
      resultadoExamenesAuxiliares: [''],
      observaciones: ['']
    });
  }

  onSubmit(): void {
    console.log('¡Botón presionado!'); // 👈 Agrega esto al inicio
    console.log('Estado del formulario:', this.questionnaireForm.status);
    console.log(this.getFormValidationErrors())
    if (this.questionnaireForm.valid) {
      const rawData = this.questionnaireForm.value;

      // Construimos el payload para el backend siguiendo el DTO
      const payload = {
        ...rawData,
        doctorId: String(rawData.doctor), // Convertimos ID a string para el DTO
        // Aseguramos que los números no viajen como strings vacíos
        vecesCepilloDientes: rawData.vecesCepilloDientes === '' ? null : Number(rawData.vecesCepilloDientes),
        // Los signos vitales se envían tal cual, el @Transform del DTO los volverá strings
      };

      // Limpiamos el campo 'doctor' que solo existe en el front
      delete (payload as any).doctor;

      this.medicalHistoryService.updateDentistry(this.patientId, payload).subscribe({
        next: (res) => {
          console.log('Historia de odontología guardada:', res);
          alert('Datos guardados correctamente');
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          alert('Hubo un error al guardar los datos');
        }
      });
    } else {
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

  // Helpers de validación para el HTML
  getFormValidationErrors() {
    const errors: any = {};
    Object.keys(this.questionnaireForm.controls).forEach(key => {
      const controlErrors = this.questionnaireForm.get(key)?.errors;
      if (controlErrors != null) {
        errors[key] = controlErrors;
      }
    });
    return errors;
  }

  // Helpers para validación
  hasError(field: string, error: string): boolean {
    const control = this.questionnaireForm.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }
}
