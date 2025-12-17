import { Component } from '@angular/core';
import {RouterLink, RouterOutlet} from '@angular/router';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-public-layout',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './public-layout.html',
  styleUrl: './public-layout.css',
})
export class PublicLayout {

}
