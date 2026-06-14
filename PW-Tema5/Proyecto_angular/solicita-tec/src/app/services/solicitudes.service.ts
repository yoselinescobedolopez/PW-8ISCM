import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  constructor(private supabaseService: SupabaseService) {}

  private get supabase() {
    return this.supabaseService.supabase;
  }

  async getSolicitudes() {
    const { data, error } = await this.supabase
      .from('solicitudes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  async crearSolicitud(data: any) {
    const { data: result, error } = await this.supabase
      .from('solicitudes')
      .insert([data])
      .select()
      .single();

    if (error) throw error;
    return result;
  }

  async actualizarEstado(id: string, estado: string) {
    const { error } = await this.supabase
      .from('solicitudes')
      .update({ estado })
      .eq('id', id);

    if (error) throw error;
  }

  async getRequisitos() {
    const { data, error } = await this.supabase
      .from('requisitos_documentos')
      .select('*');

    if (error) throw error;
    return data;
  }

 async subirArchivo(file: File, path: string) {

  const { data, error } = await this.supabase
    .storage
    .from('documentos')
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) throw error;
  return data;
}

  async listarArchivos(userId: string, solicitudId: string) {

    const { data, error } = await this.supabase
      .storage
      .from('documentos')
      .list(`${userId}/${solicitudId}`);

    if (error) throw error;

    return data || [];
  }

  async getSignedUrl(path: string) {

  const { data, error } = await this.supabase
     .storage
     .from('documentos')
     .createSignedUrl(path, 3600);

    if (error) {
    console.error('SIGNED URL ERROR:', error);
    return null;
    }

  return data.signedUrl;
  }

  async guardarArchivoRegistro(data: any) {//esta es la funcion nueva para la nueva tabla de archivos
  const { data: result, error } = await this.supabase
    .from('archivos_solicitud')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return result;
}
}