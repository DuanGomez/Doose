import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error';
export interface Toast { message: string; type: ToastType; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  toast = signal<Toast | null>(null);
  private timer: ReturnType<typeof setTimeout> | null = null;

  show(message: string, type: ToastType = 'success') {
    if (this.timer) clearTimeout(this.timer);
    this.toast.set({ message, type });
    this.timer = setTimeout(() => this.toast.set(null), 3500);
  }
}
