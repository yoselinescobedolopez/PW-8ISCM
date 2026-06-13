import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitudesService } from '../services/solicitudes.service';

@Component({
  selector: 'app-administrador',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './administrador.html',
  styleUrls: ['./administrador.css']
})
export class AdministradorComponent implements OnInit {

  solicitudes: any[] = [];

  constructor(private solicitudesService: SolicitudesService) {}

  async ngOnInit() {
    await this.cargarSolicitudes();

    setInterval(() => {
      this.cargarSolicitudes();
    }, 5000);
  }

  async cargarSolicitudes() {
    this.solicitudes = await this.solicitudesService.getSolicitudes();
  }

  async cambiarEstado(id: string, event: Event) {
    const estado = (event.target as HTMLSelectElement).value;

    await this.solicitudesService.actualizarEstado(id, estado);
    await this.cargarSolicitudes();
  }

  get pendientes(): number {
    return this.solicitudes.filter(
      s => s.estado === 'pendiente'
    ).length;
  }

  get aprobados(): number {
    return this.solicitudes.filter(
      s => s.estado === 'en proceso'
    ).length;
  }

  get rechazados(): number {
    return this.solicitudes.filter(
      s => s.estado === 'realizado'
    ).length;
  }
}