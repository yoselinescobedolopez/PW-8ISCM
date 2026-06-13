import { Routes } from '@angular/router';
import { BienvenidaComponent } from './bienvenida/bienvenida';
import { PseleccionComponent } from './pseleccion/pseleccion';
import { LoginComponent } from './login/login';
import { AlumnoComponent } from './alumno/alumno';
import { AdministradorComponent } from './administrador/administrador';
import { AdminGuard } from './guards/admin-guard';//PARA SEGURIDAD DE ADMIN
import { AlumnoGuard } from './guards/alumno-guard';
import { RegistroComponent } from './registro/registro';

export const routes: Routes = [
  { path: '', component: BienvenidaComponent },
  { path: 'seleccion', component: PseleccionComponent},
  { path: 'login', component: LoginComponent},
  { path: 'registro', component: RegistroComponent },
  {
   path: 'alumno',
   component: AlumnoComponent,
   canActivate: [AlumnoGuard]
  },
 {  
   path: 'administrador',
  component: AdministradorComponent,
  canActivate: [AdminGuard]   
  }
];


 