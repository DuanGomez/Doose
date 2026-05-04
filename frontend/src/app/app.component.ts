import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ToastComponent } from './shared/toast/toast.component';
import { ConfirmModalComponent } from './shared/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastComponent, ConfirmModalComponent],
  template: `
    <app-navbar />
    <main>
      <router-outlet />
    </main>
    <app-footer />
    <app-toast />
    <app-confirm-modal />
  `,
  styles: [`
    :host { display: flex; flex-direction: column; min-height: 100vh; }
    main  { flex: 1; }
  `]
})
export class AppComponent {}
