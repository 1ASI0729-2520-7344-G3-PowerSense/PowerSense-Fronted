import { Injectable, signal, computed } from '@angular/core';
import { User } from '../domain/model/user.entity';

@Injectable({
  providedIn: 'root'
})
export class AuthState {
  // Estado privado
  private readonly _currentUser = signal<User | null>(null);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Estado público (readonly)
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();

  // Computados
  readonly isAuthenticated = computed(() => this._currentUser() !== null);
  readonly userInitials = computed(() => {
    const user = this._currentUser();
    if (!user) return '';

    const parts = user.name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return user.name.substring(0, 2).toUpperCase();
  });

  // Métodos para actualizar estado (solo desde el servicio)
  setUser(user: User | null): void {
    this._currentUser.set(user);
    this._error.set(null);
  }

  setLoading(loading: boolean): void {
    this._isLoading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  reset(): void {
    this._currentUser.set(null);
    this._isLoading.set(false);
    this._error.set(null);
  }
}
