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

  

  const { data: archivos } =
    await this.supabaseService.supabase
      .from('archivos_solicitud')
      .select('*')
      .eq('solicitud_id', solicitud.id);

  
  this.requisitosFiltrados = await Promise.all(

  (requisitos || []).map(async r => {

    const archivo = (archivos || []).find(a =>
      a.requisito_id === r.id
    );

    let archivoUrl = null;

    if (archivo) {
      archivoUrl = await this.solicitudesService
        .getSignedUrl(archivo.storage_path);
    }

    return {
      ...r,
      archivoUrl
    };
  })
);
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