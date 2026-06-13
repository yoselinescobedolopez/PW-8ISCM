import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.html',
  styleUrls: ['./bienvenida.css']
})
export class BienvenidaComponent {

  constructor(private router: Router) {}

  ir() {
    this.router.navigate(['/seleccion']);
  }
}