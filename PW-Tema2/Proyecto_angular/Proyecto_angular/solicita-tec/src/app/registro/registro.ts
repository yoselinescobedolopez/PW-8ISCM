import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {

  nombre = '';
  numero_control = '';
  email = '';
  password = '';

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async register() {

    const { data, error } =
      await this.supabaseService.supabase.auth.signUp({
        email: this.email,
        password: this.password
      });

    if (error) {
      alert(error.message);
      return;
    }

    if (data.user) {

      const { error: insertError } =
        await this.supabaseService.supabase
        .from('perfiles')
        .insert([{
          id: data.user.id,
          nombre: this.nombre,
          email: this.email,
          numero_control: this.numero_control,
          rol: 'alumno'
        }]);

      if (insertError) {
        console.log(insertError);
        alert(insertError.message);
        return;
      }

    }

    alert('Usuario registrado correctamente');

    this.router.navigate(['/login']);

  }

  goLogin() {
    this.router.navigate(['/login']);
  }

}