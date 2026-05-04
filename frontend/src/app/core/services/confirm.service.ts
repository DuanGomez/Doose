import { Injectable, signal } from '@angular/core';

export interface ConfirmState { message: string; resolve: (v: boolean) => void; }

@Injectable({ providedIn: 'root' })
export class ConfirmService {
  state = signal<ConfirmState | null>(null);

  confirm(message: string): Promise<boolean> {
    return new Promise(resolve => this.state.set({ message, resolve }));
  }

  respond(value: boolean) {
    this.state()?.resolve(value);
    this.state.set(null);
  }
}
