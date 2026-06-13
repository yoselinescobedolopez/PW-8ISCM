import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SolicitudesService } from '../services/solicitudes.service';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-alumno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alumno.html',
  styleUrls: ['./alumno.css'],
})
export class AlumnoComponent implements OnInit {

  usuarioNombre = '';

  tipo_documento = 'Kardex';
  motivo = '';

  solicitudes: any[] = [];

  private userId: string = '';

  constructor(
    private solicitudesService: SolicitudesService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {

    const { data: { user } } =
      await this.supabaseService.getUser();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.userId = user.id;

    // Obtener nombre del alumno
    const { data: perfil } =
      await this.supabaseService.supabase
        .from('perfiles')
        .select('nombre')
        .eq('id', user.id)
        .single();

    if (perfil) {
      this.usuarioNombre = perfil.nombre;
    }

    // Cargar solicitudes del alumno
    await this.cargarSolicitudes();
  }

  async cargarSolicitudes() {

    const { data, error } =
      await this.supabaseService.supabase
        .from('solicitudes')
        .select('*')
        .eq('usuario_id', this.userId);


    if (!error) {
      this.solicitudes = data || [];
    }
  }

  async enviarSolicitud() {

    if (!this.motivo.trim()) {
      alert('Escribe un motivo');
      return;
    }

    const data = {
      tipo_documento: this.tipo_documento,
      motivo: this.motivo,
      usuario_id: this.userId, 
      estado: 'pendiente'
    };

    try {

      await this.solicitudesService.crearSolicitud(data);

      alert('Solicitud enviada');

      this.motivo = '';

      await this.cargarSolicitudes(); // refrescar

    } catch (error) {

      console.error(error);
      alert('Error al enviar solicitud');

    }
  }

  async logout() {

    await this.supabaseService.logout();

    this.router.navigate(['/']);

  }

  // 📊 CONTADORES (dashboard alumno)
  get pendientes() {
    return this.solicitudes.filter(s => s.estado === 'pendiente').length;
  }

  get enProceso() {
    return this.solicitudes.filter(s => s.estado === 'proceso').length;
  }

  get realizados() {
    return this.solicitudes.filter(s => s.estado === 'realizado').length;
  }
}