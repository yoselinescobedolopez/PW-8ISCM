import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://vllgmmifebcsnsongmwt.supabase.co',
      'sb_publishable_rWlbpu-UcBXVrEcAnIgUrw_4ZaPynaY'
    );
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

    const { data, error } = await this.supabase.storage
      .from('documentos')
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('❌ STORAGE ERROR:', error);
      throw error;
    }

    return data;
  }

  async listarArchivos(userId: string, solicitudId: string) {

    const { data, error } = await this.supabase.storage
      .from('documentos')
      .list(`${userId}/${solicitudId}`);

    if (error) throw error;

    return data || [];
  }

  getUrl(path: string) {
    const { data } = this.supabase.storage
      .from('documentos')
      .getPublicUrl(path);

    return data.publicUrl;
  }
}