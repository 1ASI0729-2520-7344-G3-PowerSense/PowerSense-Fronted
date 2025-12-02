import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AUTH_REPOSITORY } from '../../domain/tokens';
import { LoginCredentials } from '../../domain/model/auth.types';
import { AuthState } from '../auth.state';

@Injectable({
  providedIn: 'root'
})
export class LoginUseCase {
  private readonly repository = inject(AUTH_REPOSITORY);
  private readonly state = inject(AuthState);
  private readonly router = inject(Router);

  async execute(credentials: LoginCredentials): Promise<void> {
    this.state.setLoading(true);
    this.state.setError(null);

    try {
      const response = await this.repository.login(credentials);
      this.state.setUser(response.user);
      await this.router.navigate(['/dashboard']);
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : 'Error al iniciar sesión';
      this.state.setError(message);
      throw error;
    } finally {
      this.state.setLoading(false);
    }
  }
}
