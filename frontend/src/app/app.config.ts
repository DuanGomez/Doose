import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpInterceptorFn, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { demoBackendInterceptor } from './core/demo/demo-backend.interceptor';
import { environment } from '../environments/environment';

// En modo demo (GitHub Pages) el último interceptor responde en lugar del servidor.
const interceptors: HttpInterceptorFn[] = environment.demo ? [authInterceptor, demoBackendInterceptor] : [authInterceptor];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors(interceptors)),
    provideAnimations()
  ]
};
