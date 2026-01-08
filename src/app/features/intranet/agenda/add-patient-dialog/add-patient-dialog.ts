import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { provideDateFnsAdapter } from '@angular/material-date-fns-adapter';
import { es } from 'date-fns/locale';
import { Patient, DocumentType, Gender, BloodGroup, availableTags, PatientTag } from '../../../../shared/models/patient.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; // Importar esto
import { PatientService } from '../../../../core/services/patient.service'; // Ajusta la ruta

@Component({
  selector: 'app-add-patient-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatButtonModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule,
    MatDatepickerModule, MatNativeDateModule, MatIconModule, MatMenuModule, MatChipsModule
  ],
  providers: [
    provideDateFnsAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: es },
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  templateUrl: './add-patient-dialog.html',
  styleUrl: './add-patient-dialog.css',
})
export class AddPatientDialog implements OnInit {
  patientForm!: FormGroup;
  showMoreData = false;
  isSaving = false; // Flag para el estado del botón

  // Usamos tus constantes globales
  availableTags: PatientTag[] = availableTags;
  selectedTags: PatientTag[] = [];

  // Opciones para los Selects basadas en Enums
  docTypes = ['DNI', 'PASAPORTE', 'RUC', 'CARNET_EXTRANJERIA', 'OTROS'];
  genders = [
    { value: 'MALE', label: 'Hombre' },
    { value: 'FEMALE', label: 'Mujer' },
    { value: 'OTHER', label: 'Otro' }
  ];
  bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  countries = [
    { name: 'Perú', code: '+51', flag: 'pe' },
    { name: 'México', code: '+52', flag: 'mx' },
    { name: 'Colombia', code: '+57', flag: 'co' }
  ];

  removeTag(tag: PatientTag): void {
    const index = this.selectedTags.findIndex(t => t.id === tag.id);
    if (index !== -1) {
      this.selectedTags.splice(index, 1);
      this.patientForm.patchValue({ tags: this.selectedTags.map(t => t.id) });
    }
  }

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddPatientDialog>,
    private patientService: PatientService, // Inyectado
    private snackBar: MatSnackBar,          // Inyectado
  ) {}

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      // Identificación
      documentType: ['DNI'],
      documentNumber: ['', Validators.required],
      hasNoDocument: [false],

      // Información Personal
      firstName: ['', Validators.required],
      lastNamePaternal: ['', Validators.required],
      lastNameMaternal: [''],
      birthDate: [null],
      gender: ['MALE'],
      bloodGroup: [null],

      // Contacto
      phonePrefix: ['+51'],
      phoneNumber: ['', Validators.required],
      hasNoPhone: [false],
      email: ['', [Validators.email]],

      // Relaciones y Etiquetas
      tags: [[]], // Array de IDs: number[]
      hasGuardian: [false],
      generalNote: ['']
    });

    this.handleConditionalValidator('hasNoDocument', 'documentNumber');
    this.handleConditionalValidator('hasNoPhone', 'phoneNumber');
  }

  handleConditionalValidator(checkboxName: string, inputName: string): void {
    this.patientForm.get(checkboxName)?.valueChanges.subscribe(checked => {
      const input = this.patientForm.get(inputName);
      if (checked) {
        input?.clearValidators();
        input?.setValue('');
      } else {
        input?.setValidators([Validators.required]);
      }
      input?.updateValueAndValidity();
    });
  }

  getSelectedFlag(): string {
    const code = this.patientForm.get('countryCode')?.value;
    const country = this.countries.find(c => c.code === code);
    return country ? country.flag : 'pe';
  }

  toggleMoreData(): void {
    this.showMoreData = !this.showMoreData;
  }

  // --- Lógica de Etiquetas (Tags) ---
  toggleTag(tag: PatientTag): void {
    const index = this.selectedTags.findIndex(t => t.id === tag.id);
    if (index === -1) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(index, 1);
    }
    // Actualizamos el form con los IDs
    this.patientForm.patchValue({ tags: this.selectedTags.map(t => t.id) });
  }

  isTagSelected(tag: PatientTag): boolean {
    return this.selectedTags.some(t => t.id === tag.id);
  }

  onSubmit(): void {
    if (this.patientForm.invalid) {
      this.patientForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    // Creamos una copia de los valores del formulario
    const rawData = this.patientForm.value;

    // Limpiamos los campos que son strings vacíos para que viajen como undefined o null
    const patientData = { ...rawData };


    console.log("patientData");
    console.log(patientData);

    Object.keys(patientData).forEach(key => {
      if (patientData[key] === '' || patientData[key] === null) {
        delete patientData[key];
      }
    });

    this.patientService.createPatient(patientData).subscribe({
      next: (createdPatient) => {
        console.log(createdPatient);
        this.isSaving = false;
        this.snackBar.open(`Paciente creado correctamente`, 'Cerrar', { duration: 3000 });
        this.dialogRef.close(createdPatient);
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Error al crear paciente:', err);
      }
    });
  }

  close() { this.dialogRef.close(); }
}
