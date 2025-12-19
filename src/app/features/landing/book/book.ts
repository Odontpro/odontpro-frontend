import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-book',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './book.html',
  styleUrl: './book.css',
})
export class Book {
  reclamacionForm: FormGroup;
  maxDate = new Date(); // No permitir fechas futuras
  caracteresRestantes = 500;

  tiposDocumento = [
    { value: 'dni', label: 'DNI' },
    { value: 'pasaporte', label: 'Pasaporte' },
    { value: 'carnet_extranjeria', label: 'Carnet de Extranjería' }
  ];

  departamentos = [
    'Lima', 'Arequipa', 'Cusco', 'La Libertad', 'Piura',
    'Lambayeque', 'Junín', 'Cajamarca', 'Puno', 'Ica',
    'Ancash', 'Huánuco', 'Ayacucho', 'San Martín', 'Loreto',
    'Ucayali', 'Apurímac', 'Amazonas', 'Huancavelica', 'Moquegua',
    'Pasco', 'Tacna', 'Tumbes', 'Madre de Dios', 'Callao'
  ];

  constructor(private fb: FormBuilder) {
    this.reclamacionForm = this.fb.group({
      fecha: ['', Validators.required],
      nombres: ['', [Validators.required, Validators.minLength(2)]],
      apellidoPaterno: ['', [Validators.required, Validators.minLength(2)]],
      apellidoMaterno: ['', [Validators.required, Validators.minLength(2)]],
      tipoDocumento: ['dni', Validators.required],
      numeroDocumento: ['', [Validators.required, Validators.pattern(/^[0-9]{8,12}$/)]],
      email: ['', [Validators.required, Validators.email]],
      telefonoFijo: ['', [Validators.pattern(/^[0-9]{6,9}$/)]],
      telefonoCelular: ['', [Validators.required, Validators.pattern(/^[0-9]{9}$/)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      distrito: ['', [Validators.required, Validators.minLength(2)]],
      departamento: ['', Validators.required],
      detalleReclamo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      confirmacionDatos: [false, Validators.requiredTrue],
      autorizacionNotificacion: [false]
    });

    // Listener para contar caracteres del textarea
    this.reclamacionForm.get('detalleReclamo')?.valueChanges.subscribe(value => {
      this.caracteresRestantes = 500 - (value?.length || 0);
    });
  }

  onSubmit() {
    if (this.reclamacionForm.valid) {
      console.log('Formulario válido:', this.reclamacionForm.value);
      // Aquí puedes enviar los datos a tu backend
      alert('Reclamación enviada exitosamente');
      this.reclamacionForm.reset();
      this.reclamacionForm.patchValue({ tipoDocumento: 'dni' });
    } else {
      // Marcar todos los campos como tocados para mostrar errores
      Object.keys(this.reclamacionForm.controls).forEach(key => {
        this.reclamacionForm.get(key)?.markAsTouched();
      });
      alert('Por favor complete todos los campos requeridos correctamente');
    }
  }

  // Métodos helper para mostrar errores
  getErrorMessage(fieldName: string): string {
    const field = this.reclamacionForm.get(fieldName);
    if (!field) return '';

    if (field.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (field.hasError('email')) {
      return 'Ingrese un email válido';
    }
    if (field.hasError('minlength')) {
      const minLength = field.getError('minlength').requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (field.hasError('maxlength')) {
      const maxLength = field.getError('maxlength').requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }
    if (field.hasError('pattern')) {
      if (fieldName === 'numeroDocumento') {
        return 'Ingrese un número de documento válido (8-12 dígitos)';
      }
      if (fieldName === 'telefonoCelular') {
        return 'Ingrese un celular válido (9 dígitos)';
      }
      if (fieldName === 'telefonoFijo') {
        return 'Ingrese un teléfono válido (6-9 dígitos)';
      }
    }
    return '';
  }
}
