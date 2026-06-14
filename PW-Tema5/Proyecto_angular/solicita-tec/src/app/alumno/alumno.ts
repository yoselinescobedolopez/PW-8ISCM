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

  requisitos: any[] = [];
  todosRequisitos: any[] = [];

  archivosSubidos: any[] = [];

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

    const { data: perfil } =
      await this.supabaseService.supabase
        .from('perfiles')
        .select('nombre')
        .eq('id', user.id)
        .single();

    this.usuarioNombre = perfil?.nombre;

    await this.cargarSolicitudes();

    this.todosRequisitos =
      await this.solicitudesService.getRequisitos();

    this.actualizarRequisitos();
  }

  async cargarSolicitudes() {

    const { data } =
      await this.supabaseService.supabase
        .from('solicitudes')
        .select('*')
        .eq('usuario_id', this.userId);

    this.solicitudes = data || [];
  }

  actualizarRequisitos() {
    this.requisitos = this.todosRequisitos.filter(r =>
      r.tipo_documento?.trim().toLowerCase() ===
      this.tipo_documento?.trim().toLowerCase()
    );
  }

  agregarArchivo(requisitoId: any, input: any) {

    const file = input?.files?.[0];

    if (!file) return;

    this.archivosSubidos.push({
      requisitoId: String(requisitoId),
      file
    });

    input.value = '';
  }

  

  async enviarSolicitud() {

  try {

    
    const solicitud = {
      tipo_documento: this.tipo_documento,
      motivo: this.motivo,
      usuario_id: this.userId,
      estado: 'pendiente'
    };

    const solicitudCreada =
      await this.solicitudesService.crearSolicitud(solicitud);

    const solicitudId = solicitudCreada.id;

    
    for (const a of this.archivosSubidos) {

      if (!a.file) continue;

      const fileId = crypto.randomUUID();

      const path =
        `private/${this.userId}/${solicitudId}/${fileId}`;

      
      await this.solicitudesService.subirArchivo(a.file, path);

      
      await this.solicitudesService.guardarArchivoRegistro({
        solicitud_id: solicitudId,
        requisito_id: a.requisitoId,
        user_id: this.userId,
        nombre_archivo: a.file.name,
        storage_path: path
      });
    }

    this.archivosSubidos = [];
    this.motivo = '';

    await this.cargarSolicitudes();

  } catch (err) {
    console.error('❌ ERROR:', err);
  }
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