import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-seleccion',
  templateUrl: './pseleccion.html',
  styleUrls: ['./pseleccion.css']
})
export class PseleccionComponent {

  constructor(private router: Router) {}
  irAdmin() {
  this.router.navigate(['/login'], { queryParams: { tipo: 'admin' } });
}

irAlumno() {
  this.router.navigate(['/login'], { queryParams: { tipo: 'alumno' } });
}


}