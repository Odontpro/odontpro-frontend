import { CommonModule } from '@angular/common';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {Component, OnInit} from '@angular/core';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MedicalHistoryService} from '../../../../../core/services/medical-history.service';
import {UserService} from '../../../../../core/services/user.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-questionnare-endodontics',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCheckbox,
    MatRadioButton,
    MatRadioGroup
  ],
  templateUrl: './questionnare-endodontics.html',
  styleUrl: './questionnare-endodontics.css',
})
export class QuestionnareEndodontics implements OnInit {
  patientId!: number;
  loading = false;
  form!: FormGroup;
  doctors: any[] = []; // Se llenará desde el backend

  constructor(
    private fb: FormBuilder,
    private medicalService: MedicalHistoryService,
    private userService: UserService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.extractPatientId();
    this.initForm();
    this.loadDoctors();
  }

  private extractPatientId(): void {

    const idParam = this.route.parent?.parent?.snapshot.paramMap.get('id')
      || this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.patientId = Number(idParam);
      this.loadEndodonticsData(); // Solo cargamos datos si tenemos un ID válido
    } else {
      console.error('No se pudo encontrar el ID del paciente en la URL');
    }
  }

  initForm(): void {
    this.form = this.fb.group({
      doctorId: [1], // Por defecto Diego Talledo Sanchez
      // Las secciones se irán rellenando una a una
      seccion: this.fb.group({
        tratamientoPrevio: [''],
        historiaDolor: [''],
        notaAdicional: [''],
        numeroDiente: ['']
      }),
      examenClinico: this.fb.group({
        // Corona Anatómica
        caries: [false], restauracion: [false], bruxismo: [false], fractura: [false], fracturaExposicion: [false],

        // Hallazgos con Si/No y Especificación
        inflamacion: [null], inflamacionEsp: [''],
        fistulas: [null], fistulasEsp: [''],
        gingivitis: [null], movilidad: [''],
        bolsas: [null], sondeo: [''],
        sarro: [null],

        // Características del dolor
        espontaneo: [false], provocado: [false], frio: [false], calor: [false], masticacion: [false],
        nocturno: [false], aire: [false], dulce: [false], acido: [false], irradiado: [false],
        difuso: [false], punzante: [false], continuo: [false], intermitente: [false], esporadico: [false],

        // Percusión y Palpación
        horizontal: [false], vertical: [false],
        vestibular: [false], lingualPalatino: [false],

        notaAdicionalExamen: ['']
      }),
      pruebaVitalidad: this.fb.group({
        calorSiNo: [null],
        calorDuracion: [''],
        calorIntensidad: [''],
        frioSiNo: [null],
        frioDuracion: [''],
        frioIntensidad: ['']
      }),
      examenRadiografico: this.fb.group({
        // Cámara Pulpar
        camaraAbierta: [false], camaraCerrada: [false], camaraAmplia: [false],
        camaraEstrecha: [false], camaraCalculos: [false],

        // Conducto(s) - Cantidad y Forma
        condUnico: [false], cond2: [false], cond3: [false], cond4: [false],
        condRecto: [false], condCurvo: [false], condAmplio: [false],
        condEstrecho: [false], condTratado: [false], condApiceAbierto: [false],

        // Hallazgos Si/No
        lesionFurca: [null],
        lesionApical: [null],
        lesionLateral: [null],
        lesionEndoPerio: [null],
        raicesEnanas: [null],

        // Hallazgos con Selección
        fracturaRadicular: [null], fracturaRadicularDetalle: [''],
        calcificacion: [null], calcificacionDetalle: [''],
        ligamentoPeriodontal: [null], ligamentoPeriodontalDetalle: [''],
        reabsorcion: [null], reabsorcionDetalle: [''],

        notaAdicionalRad: ['']
      }),
      diagnosticoPulpar: this.fb.group({
        estadoPulpar: [''], // Almacenará el valor seleccionado
        notaAdicionalPulpar: ['']
      }),
      diagPeriapical: this.fb.group({
        estadoPeriapical: [''],
        notaAdicionalPeriapical: ['']
      }),
      diagnosticoDefinitivo: this.fb.group({
        estadoDefinitivo: [''],
        notaAdicionalDefinitivo: ['']
      }),
      tratamientoIndicado: this.fb.group({
        biopulpectomia: [false],
        apicectomia: [false],
        necropulpectomia: [false],
        hemiseccion: [false],
        retratamiento: [false],
        radicectomia: [false],
        blanqueamiento: [false],
        extraccion: [false],
        notaAdicionalTratamiento: ['']
      }),
      datosClinicos: this.fb.group({
        conductos: this.fb.array([]),
        notaAdicionalClinica: ['']
      }),
      seccionFinal: this.fb.group({
        accidentesOperatorios: [''],
        restauracionPost: [''], // Manejado como selección única
        pronostico: [''],       // Manejado como selección única
        notaAdicionalFinal: ['']
      }),
    });
    this.initConductos();
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

  loadEndodonticsData() {
    this.loading = true;
    this.medicalService.getEndodontics(this.patientId.toString()).subscribe({
      next: (data) => {
        if (data) {
          console.log(data);
          if (data.doctorId) {
            this.form.get('doctorId')?.setValue(Number(data.doctorId));
          }
          this.form.patchValue({
            doctorId: data.doctorId,
            seccion: data,
            examenClinico: data,
            pruebaVitalidad: data,
            examenRadiografico: data,
            diagnosticoPulpar: data,
            diagPeriapical: data,
            diagnosticoDefinitivo: data,
            tratamientoIndicado: data,
            seccionFinal: data
          });

          // Caso especial: La nota de datos clínicos y los conductos (JSON)
          if (data.conductos) {
            const control = this.form.get('datosClinicos.conductos') as FormArray;
            control.clear();
            data.conductos.forEach((c: any) => control.push(this.fb.group(c)));
          }
          this.form.get('datosClinicos.notaAdicionalClinica')?.patchValue(data.notaAdicionalClinica);
        }
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  intensidadOptions = [
    { value: 'leve', label: 'Leve (1-3)' },
    { value: 'moderada', label: 'Moderada (4-7)' },
    { value: 'severa', label: 'Severa (8-10)' }
  ];

  duracionOptions = [
    { value: 'fugaz', label: 'Fugaz' },
    { value: 'persistente', label: 'Persistente' }
  ];

  fracturaOptions = ['Tercio cervical', 'Tercio medio', 'Tercio apical', 'Vertical'];
  calcificacionOptions = ['Total', 'Parcial', 'Conductos calcificados'];
  ligamentoOptions = ['Ensanchado', 'Normal'];
  reabsorcionOptions = ['Interna', 'Externa'];
  estadoPulparOptions = [
    'Pulpa normal',
    'Pulpitis Reversible',
    'Pulpitis Irreversible sintomática',
    'Pulpitis Irreversible asintomática',
    'Necrosis Pulpar',
    'Previamente tratado',
    'Previamente iniciado'
  ];

  estadoPeriapicalOptions = [
    'Tejidos apicales sanos',
    'Periodontitis apical aguda (sintomática)',
    'Periodontitis apical crónica (asintomática)',
    'Absceso apical agudo (sin fístula)',
    'Absceso apical crónico (con fístula)',
    'Osteítis condensante'
  ];

  estadoDefinitivoOptions = [
    'Pulpitis irreversible',
    'Pulpa necrótica'
  ];

  conductoRows = [
    'Único', 'Vestibular', 'Palatino/Lingual', 'Mesio lingual',
    'Mesio Bucal', 'Distal', 'Disto Bucal', 'Disto Lingual'
  ];

  restauracionOptions = ['Poste', 'Amalgama/Resina', 'Corona', 'Otro'];
  pronosticoOptions = ['Favorable', 'Desfavorable', 'Reservado'];


  initConductos() {
    const control = <FormArray>this.form.get('datosClinicos.conductos');
    this.conductoRows.forEach(name => {
      control.push(this.fb.group({
        nombre: [name],
        conducto: [''],
        longitud: [''],
        referencia: [''],
        limaInicial: [''],
        ultimaLima: [''],
        cemento: [''],
        conoMaestro: ['']
      }));
    });
  }

  get diagPeriapicalGroup() {
    return this.form.get('diagPeriapical') as FormGroup;
  }

  get diagDefinitivoGroup() {
    return this.form.get('diagnosticoDefinitivo') as FormGroup;
  }

  get tratamientoGroup() {
    return this.form.get('tratamientoIndicado') as FormGroup;
  }

  get conductosArray() {
    return (this.form.get('datosClinicos.conductos') as FormArray).controls;
  }

  get seccionFinalGroup() {
    return this.form.get('seccionFinal') as FormGroup;
  }

  // Helpers para validación
  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return !!(control?.hasError(error) && control?.touched);
  }

  save() {
    if (this.form.valid) {
      const v = this.form.getRawValue();

      // Aplanamos el objeto para que coincida con la entidad del Backend
      const payload = {
        doctorId: v.doctorId,
        ...v.seccion,
        ...v.examenClinico,
        ...v.pruebaVitalidad,
        ...v.examenRadiografico,
        ...v.diagnosticoPulpar,
        ...v.diagPeriapical,
        ...v.diagnosticoDefinitivo,
        ...v.tratamientoIndicado,
        ...v.seccionFinal,
        conductos: v.datosClinicos.conductos, // Se envía como array (JSONB en back)
        notaAdicionalClinica: v.datosClinicos.notaAdicionalClinica
      };

      this.medicalService.updateEndodontics(this.patientId.toString(), payload).subscribe({
        next: () => alert('Ficha de Endodoncia guardada correctamente'),
        error: (err) => alert('Error al guardar')
      });
    }
  }
}
