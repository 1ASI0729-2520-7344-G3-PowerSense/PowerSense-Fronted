import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AUTH_REPOSITORY } from '../../domain/tokens';
import { AuthState } from '../auth.state';

@Injectable({
  providedIn: 'root'
})
export class LogoutUseCase {
  private readonly repository = inject(AUTH_REPOSITORY);
  private readonly state = inject(AuthState);
  private readonly router = inject(Router);

  async execute(): Promise<void> {
    try {
      await this.repository.logout();
      this.state.reset();
      await this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error durante logout:', error);
      // Aún así limpiamos el estado local
      this.state.reset();
      await this.router.navigate(['/login']);
    }
  }
}
