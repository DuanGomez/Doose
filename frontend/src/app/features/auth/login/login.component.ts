import { environment } from '../../../../environments/environment';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  error = '';
  isDemo = environment.demo;
  demoUsers = [
    { label: 'Cliente', email: 'duan@gmail.com', password: 'duan123' },
    { label: 'Tatuador', email: 'sebastian@tattoo.com', password: 'sebastian123' },
    { label: 'Admin', email: 'admin@gmail.com', password: 'admin123' },
  ];

  constructor(private auth: AuthService, private router: Router) {}

  loginAs(u: { email: string; password: string }) {
    this.email = u.email;
    this.password = u.password;
    this.submit();
  }

  submit() {
    this.error = '';
    this.loading = true;
    this.auth.login(this.email, this.password).subscribe({
      next: () => this.router.navigate([this.auth.isAdmin() ? '/admin' : this.auth.isTattoer() ? '/citas' : '/']),
      error: err => {
        this.error = err.error?.message || 'Error al iniciar sesión';
        this.loading = false;
      }
    });
  }
}
