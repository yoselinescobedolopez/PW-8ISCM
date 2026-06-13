import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AlumnoGuard implements CanActivate {

  constructor(
    private supabaseService: SupabaseService,
    private router: Router
  ) {}

  async canActivate(): Promise<boolean> {

    const { data: { user } } =
      await this.supabaseService.supabase.auth.getUser();

    
    if (!user) {
      this.router.navigate(['/login']);
      return false;
    }

    const { data: perfil, error } =
      await this.supabaseService.supabase
        .from('perfiles') 
        .select('rol')
        .eq('id', user.id)
        .single();

    
    if (error || !perfil) {
      this.router.navigate(['/login']);
      return false;
    }

    
    if (perfil.rol !== 'alumno') {
      this.router.navigate(['/login']); 
      return false;
    }

    
    return true;
  }
}