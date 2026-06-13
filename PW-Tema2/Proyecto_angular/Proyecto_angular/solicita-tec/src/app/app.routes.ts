import { Routes } from '@angular/router';
import { BienvenidaComponent } from './bienvenida/bienvenida';
import { PseleccionComponent } from './pseleccion/pseleccion';
import { LoginComponent } from './login/login';
import { AlumnoComponent } from './alumno/alumno';
import { RegistroComponent } from './registro/registro';

export const routes: Routes = [
  { path: '', component: BienvenidaComponent },
  { path: 'seleccion', component: PseleccionComponent},
  { path: 'login', component: LoginComponent},
    { path: 'registro', component: RegistroComponent },
  {//esta parte es para dirigirme al perfil correspondiente
  path: 'login/:tipo',
  component: LoginComponent
},
 { path: 'alumno', component: AlumnoComponent },
];


 