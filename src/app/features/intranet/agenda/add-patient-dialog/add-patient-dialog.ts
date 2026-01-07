import { Component, OnInit } from '@angular/core';
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
import { MatNativeDateModule } from '@angular/material/core';

interface PatientTag {
  id: number;
  nombre: string;
  color: string;
  backgroundColor: string;
}

@Component({
  selector: 'app-add-patient-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule
  ],
  templateUrl: './add-patient-dialog.html',
  styleUrl: './add-patient-dialog.css',
})
export class AddPatientDialog implements OnInit {
  patientForm!: FormGroup;
  showMoreData = false;
  selectedTags: PatientTag[] = [];

  countries = [
    { name: 'Perú', code: '+51', flag: 'pe' },
    { name: 'Venezuela', code: '+58', flag: 've' },
    { name: 'Colombia', code: '+57', flag: 'co' },
    { name: 'Chile', code: '+56', flag: 'cl' },
    { name: 'Argentina', code: '+54', flag: 'ar' },
    { name: 'España', code: '+34', flag: 'es' },
    { name: 'México', code: '+52', flag: 'mx' },
    { name: 'Estados Unidos', code: '+1', flag: 'us' }
  ];

  availableTags: PatientTag[] = [
    { id: 1, nombre: 'Nuevo', color: '#2e7d32', backgroundColor: '#e8f5e9' },
    { id: 2, nombre: 'VIP', color: '#6a1b9a', backgroundColor: '#f3e5f5' },
    { id: 3, nombre: 'Impuntual', color: '#d32f2f', backgroundColor: '#ffebee' },
    { id: 4, nombre: 'Fidelizado', color: '#0288d1', backgroundColor: '#e1f5fe' },
    { id: 5, nombre: 'Favorito', color: '#f57c00', backgroundColor: '#fff3e0' }
  ];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddPatientDialog>
  ) {}

  ngOnInit(): void {
    this.patientForm = this.fb.group({
      docType: ['DNI'],
      docNumber: ['', Validators.required],
      noDoc: [false],
      names: ['', Validators.required],
      lastNameP: ['', Validators.required],
      lastNameM: [''],
      countryCode: ['+51'],
      phone: ['', Validators.required],
      noPhone: [false],
      hasRepresentative: [false],
      // Campos opcionales
      email: ['', Validators.email],
      birthDate: [null],
      gender: ['Hombre'],
      captacionSource: [''],
      insurance: [''],
      tags: [[]]
    });

    // Validadores condicionales para documento y teléfono
    this.handleConditionalValidator('noDoc', 'docNumber');
    this.handleConditionalValidator('noPhone', 'phone');
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

  toggleTag(tag: PatientTag): void {
    const index = this.selectedTags.findIndex(t => t.id === tag.id);
    if (index === -1) {
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(index, 1);
    }
    this.patientForm.patchValue({ tags: this.selectedTags.map(t => t.id) });
  }

  removeTag(tag: PatientTag): void {
    const index = this.selectedTags.findIndex(t => t.id === tag.id);
    if (index !== -1) {
      this.selectedTags.splice(index, 1);
      this.patientForm.patchValue({ tags: this.selectedTags.map(t => t.id) });
    }
  }

  isTagSelected(tag: PatientTag): boolean {
    return this.selectedTags.some(t => t.id === tag.id);
  }

  onSubmit(): void {
    if (this.patientForm.invalid) {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.patientForm.controls).forEach(key => {
        this.patientForm.get(key)?.markAsTouched();
      });
      return;
    }

    const formData = {
      ...this.patientForm.value,
      selectedTags: this.selectedTags
    };

    console.log('Datos del paciente:', formData);
    this.dialogRef.close(formData);
  }
}
