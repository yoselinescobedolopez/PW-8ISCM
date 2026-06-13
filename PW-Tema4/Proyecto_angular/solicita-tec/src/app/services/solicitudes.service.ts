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

  // para que el administrador reciba
  async getSolicitudes() {
    const { data, error } = await this.supabase
      .from('solicitudes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  
  async actualizarEstado(id: string, estado: string) {
    const { data, error } = await this.supabase
      .from('solicitudes')
      .update({ estado })
      .eq('id', id);

    if (error) throw error;
    return data;
  }

  
  async crearSolicitud(data: any) {
  const { data: result, error } = await this.supabase
    .from('solicitudes')
    .insert([
      {
        tipo_documento: data.tipo_documento,
        motivo: data.motivo,
        usuario_id: data.usuario_id,
        estado: 'pendiente'
      }
    ]);

  if (error) {
    console.log(' ERROR SUPABASE:', error);
    throw error;
  }

  return result;
}
}