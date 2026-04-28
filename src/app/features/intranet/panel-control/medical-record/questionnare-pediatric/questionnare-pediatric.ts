import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MedicalHistoryService} from '../../../../../core/services/medical-history.service';
import {UserService} from '../../../../../core/services/user.service';
import {User} from '../../../../../shared/models/user.model';


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
    MatButtonModule,
    MatOption,
    MatSelect
  ],
  providers: [MedicalHistoryService, UserService],
  templateUrl: './questionnare-pediatric.html',
  styleUrl: './questionnare-pediatric.css',
})
export class QuestionnarePediatric implements OnInit {
  patientId = 1;
  doctors: User[] = [];

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

  constructor(
    private fb: FormBuilder,
    private medicalHistoryService: MedicalHistoryService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.initForm(); // 1. Creamos la estructura
    this.loadDoctors(); // 👈 Cargamos los doctores primero o en paralelo
    this.loadData(); // 2. Llenamos con datos del servidor
  }

  initForm(): void {
    this.form = this.fb.group({
      // Sección: Información del Doctor
      doctor: ['', Validators.required],

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

  loadData() {
    console.log("LOADING... DE LOADDATO");
    this.medicalHistoryService.getPediatric(this.patientId).subscribe({
      next: (data) => {
        if (data && Object.keys(data).length > 0) {
          console.log('Datos recibidos del backend:', data);

          this.form.patchValue({
            ...data,
            // Si el ID en el array 'doctors' es number, usa Number(). Si es string, String().
            doctor: data.doctorId ? Number(data.doctorId) : ''
          });
        }
      },
      error: (err) => console.error('Error cargando datos:', err)
    });
  }

  loadDoctors(): void {
    this.userService.getDoctors().subscribe({
      next: (doctors: User[]) => {
        this.doctors = doctors;
        console.log('Doctores cargados desde endpoint específico:', this.doctors);
      },
      error: (err) => console.error('Error al cargar doctores:', err)
    });
  }

  // Helpers para validación
  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Mapeamos 'doctor' a 'doctorId' para que coincida con el DTO del backend
    const rawData = this.form.value;
    const payload = {
      ...rawData,
      doctorId: String(rawData.doctor),
      numeroHermanos: rawData.numeroHermanos === '' ? null : Number(rawData.numeroHermanos),
      ordenNacimiento: rawData.ordenNacimiento === '' ? null : Number(rawData.ordenNacimiento)
    };

    delete (payload as any).doctor; // ❌ ELIMINAR la propiedad 'doctor' para que no choque

    this.medicalHistoryService.updatePediatric(this.patientId, payload).subscribe({
      next: (response) => {
        console.log('¡Actualizado con éxito!', response);
        // Aquí podrías mostrar un SnackBar o Toast de éxito
      },
      error: (err) => {
        console.error('Error al guardar:', err);
      }
    });
  }
}
