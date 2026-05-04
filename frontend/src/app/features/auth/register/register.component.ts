import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name     = '';
  email    = '';
  password = '';
  loading  = false;
  error    = '';

  // Paso 2 — perfil de tatuador
  step = 1;
  specialty  = '';
  experience: number | null = null;

  specialties = [
    'Minimalista pequeño',
    'Frase corta',
    'Tribal brazo',
    'Realista pequeño',
    'Anime mediano',
    'Geométrico',
    'Blackwork',
    'Acuarela',
    'Retrato realista',
    'Tatuaje grande espalda'
  ];

  constructor(
    private auth: AuthService,
    private userSvc: UserService,
    private router: Router
  ) {}

  submit() {
    this.error = '';
    this.loading = true;
    this.auth.register(this.name, this.email, this.password).subscribe({
      next: () => {
        if (this.email.toLowerCase().endsWith('@tattoo.com')) {
          this.step = 2;
          this.loading = false;
        } else {
          this.router.navigate(['/']);
        }
      },
      error: err => {
        this.error = err.error?.message || 'Error al registrarse';
        this.loading = false;
      }
    });
  }

  submitProfile() {
    if (!this.specialty || this.experience == null) return;
    this.loading = true;
    this.userSvc.updateProfile(this.specialty, this.experience).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => this.router.navigate(['/'])
    });
  }
}
