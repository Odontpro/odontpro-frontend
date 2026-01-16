import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-banner-especialidad',
  standalone: true,
  templateUrl: './banner-especialidad.html',
  styleUrl: './banner-especialidad.css'
})
export class BannerEspecialidad {
  @Input() titulo: string = '';
  @Input() imagenUrl: string = 'https://picsum.photos/1920/600?medical=1'; // Imagen por defecto
}
