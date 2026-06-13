import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SolicitudesService } from '../services/solicitudes.service';
import { SupabaseService } from '../services/supabase.service';

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './administrador.html',
  styleUrls: ['./administrador.css']
})
export class AdministradorComponent implements OnInit {

  solicitudes: any[] = [];
  usuarioNombre = '';

  constructor(
    private solicitudesService: SolicitudesService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async ngOnInit() {

    const { data: { user } } =
      await this.supabaseService.supabase.auth.getUser();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    const { data: perfil } =
      await this.supabaseService.supabase
        .from('perfiles')
        .select('rol, nombre')
        .eq('id', user.id)
        .single();

    if (perfil?.rol !== 'administrador') {
      this.router.navigate(['/alumno']);
      return;
    }

    this.usuarioNombre = perfil.nombre;

    await this.cargarSolicitudes();
  }

  async cargarSolicitudes() {
    this.solicitudes = await this.solicitudesService.getSolicitudes();
  }

  async cambiarEstado(id: string, event: Event) {
    const estado = (event.target as HTMLSelectElement).value;
    await this.solicitudesService.actualizarEstado(id, estado);
    await this.cargarSolicitudes();
  }

  async logout() {
  await this.supabaseService.logout();
  this.router.navigate(['/']);
}
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