import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { Appointment } from '../../core/models/models';

@Component({
  selector: 'app-citas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dates.component.html',
  styleUrls: ['./dates.component.scss']
})
export class CitasComponent implements OnInit {
  days  = ['Lunes','Martes','Miércoles','Jueves','Viernes'];
  hours = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00'];
  allAppointments: Appointment[] = [];

  constructor(public auth: AuthService) {}

  ngOnInit() {
    const stored: Appointment[] = JSON.parse(localStorage.getItem('appointments') || '[]');
    const user = this.auth.currentUser();
    this.allAppointments = this.auth.isAdmin()
      ? stored
      : stored.filter(a => a.tattoerId === user?.id);
  }

  getApts(day: string, hour: string): Appointment[] {
    return this.allAppointments.filter(a => a.schedule === `${day} ${hour}`);
  }

  get totalCitas() { return this.allAppointments.length; }

  get citasHoy(): number {
    const map: Record<number,string> = {1:'Lunes',2:'Martes',3:'Miércoles',4:'Jueves',5:'Viernes'};
    const hoy = map[new Date().getDay()];
    if (!hoy) return 0;
    return this.allAppointments.filter(a => a.schedule.startsWith(hoy)).length;
  }

  deleteApt(id: string) {
  if (confirm('¿Eliminar esta cita?')) {
    this.allAppointments = this.allAppointments.filter(a => a.id !== id);
    localStorage.setItem('appointments', JSON.stringify(
      JSON.parse(localStorage.getItem('appointments') || '[]').filter((a: Appointment) => a.id !== id)
    ));
  }
}

  clearAll() {
    if (this.auth.isAdmin() && confirm('¿Eliminar todas las citas? Esta acción no se puede deshacer.')) {
      localStorage.removeItem('appointments');
      this.allAppointments = [];
    }
  }
}