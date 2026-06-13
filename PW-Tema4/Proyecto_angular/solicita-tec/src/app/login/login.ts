import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {

  email = '';
  password = '';

  
  imagen = 'assets/logo.png';
  tipo = 'Usuarios';

  constructor(
    private supabaseService: SupabaseService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.tipo = params['tipo'] || 'Usuarios';
    });
  }

  async login() {

    const { data, error } =
      await this.supabaseService.supabase.auth.signInWithPassword({
        email: this.email,
        password: this.password
      });

    if (error) {
      alert(error.message);
      return;
    }

    const user = data.user;

    if (!user) return;

    const { data: perfil } =
      await this.supabaseService.supabase
        .from('perfiles')
        .select('rol')
        .eq('id', user.id)
        .single();

    if (!perfil) {
      alert('Perfil no encontrado');
      return;
    }

    if (perfil.rol === 'alumno') {
      this.router.navigate(['/alumno']);
    }

    if (perfil.rol === 'administrador') {
      this.router.navigate(['/administrador']);
    }
  }

  goRegistro() {
    this.router.navigate(['/registro']);
  }
}