import { Component } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatIcon} from '@angular/material/icon';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-medical-record',
  imports: [
    RouterLink,
    MatMenuTrigger,
    MatIcon,
    MatButton,
    MatMenu,
    MatMenuItem,
    RouterOutlet,
    RouterLinkActive
  ],
  templateUrl: './medical-record.html',
  styleUrl: './medical-record.css',
})
export class MedicalRecord {

}
