import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitudesService } from '../services/solicitudes.service';

@Component({
  selector: 'app-alumno',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './alumno.html',
  styleUrls: ['./alumno.css'],
})
export class AlumnoComponent {

  tipo_documento = 'Kardex';
  motivo = '';

  constructor(private solicitudesService: SolicitudesService) {}

  async enviarSolicitud() {
    if (!this.motivo.trim()) {
      alert('Escribe un motivo');
      return;
    }

    const data = {
      tipo_documento: this.tipo_documento,
      motivo: this.motivo
    };

    try {
      await this.solicitudesService.crearSolicitud(data);
      alert('Solicitud enviada');

      this.motivo = '';
    } catch (error) {
      console.error(error);
      alert('Error al enviar solicitud');
    }
  }
}