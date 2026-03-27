import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {Patient} from '../../../shared/models/patient.model';
import {PatientService} from '../../../core/services/patient.service';
import {DatePipe} from '@angular/common';
import {MatButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-panel-control',
  imports: [
    DatePipe,
    MatButton,
    MatIcon,
    RouterLink,
    RouterOutlet,
    RouterLinkActive
  ],
  templateUrl: './panel-control.html',
  styleUrl: './panel-control.css',
})
export class PanelControl implements OnInit {
  patientId: number | null = null;
  patient: Patient | null = null;

  constructor(private route: ActivatedRoute, private patientService: PatientService) {}

  ngOnInit(): void {
    this.patientId = 1
    if (this.patientId) {
      this.loadPatientData(this.patientId);
    }
  }

  loadPatientData(id: number) {
    this.patientService.getPatientById(id).subscribe(data => {
      this.patient = data;
    });
  }
}
