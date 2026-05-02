import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  form = { name: '', email: '', phone: '', message: '' };
  loading = false;
  sent = signal(false);
  error = '';

  constructor(private contactSvc: ContactService) {}

  submit() {
    this.loading = true;
    this.error = '';
    this.contactSvc.send(this.form).subscribe({
      next: () => { this.sent.set(true); this.loading = false; },
      error: err => { this.error = err.error?.message || 'Error al enviar'; this.loading = false; }
    });
  }
}
