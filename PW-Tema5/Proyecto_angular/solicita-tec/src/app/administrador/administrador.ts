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

  solicitudSeleccionada: any = null;
  requisitosFiltrados: any[] = [];

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
        .select('nombre, rol')
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

  

async verDetalle(solicitud: any) {

  this.solicitudSeleccionada = solicitud;

  const { data: requisitos } =
    await this.supabaseService.supabase
      .from('requisitos_documentos')
      .select('*')
      .eq('tipo_documento', solicitud.tipo_documento);

  const archivos = await this.solicitudesService.listarArchivos(
    solicitud.usuario_id,
    solicitud.id
  );

  this.requisitosFiltrados = (requisitos || []).map(r => {

    const archivo = archivos.find(a => {

      const prefix = a.name.split('-')[0];
      return String(prefix) === String(r.id);
    });

    const path = archivo
      ? `${solicitud.usuario_id}/${solicitud.id}/${archivo.name}`
      : null;

    return {
      ...r,
      archivoUrl: path
        ? this.solicitudesService.getUrl(path)
        : null
    };
  });
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