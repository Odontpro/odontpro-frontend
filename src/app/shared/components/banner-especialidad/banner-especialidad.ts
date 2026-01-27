import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-banner-especialidad',
  standalone: true,
  templateUrl: './banner-especialidad.html',
  styleUrl: './banner-especialidad.css'
})
export class BannerEspecialidad {
  @Input() titulo: string = '';
}
