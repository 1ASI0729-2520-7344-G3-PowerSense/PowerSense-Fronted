import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AUTH_REPOSITORY } from '../domain/tokens';
import { AuthState } from './auth.state';
import { LoginUseCase } from './use-cases/login.use-case';
import { RegisterUseCase } from './use-cases/register.use-case';
import { LogoutUseCase } from './use-cases/logout.use-case';
import { LoginCredentials, RegisterData } from '../domain/model/auth.types';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly repository = inject(AUTH_REPOSITORY);
  private readonly platformId = inject(PLATFORM_ID);

  readonly state = inject(AuthState);

  private readonly loginUseCase = inject(LoginUseCase);
  private readonly registerUseCase = inject(RegisterUseCase);
  private readonly logoutUseCase = inject(LogoutUseCase);

  readonly currentUser = this.state.currentUser;
  readonly isAuthenticated = this.state.isAuthenticated;
  readonly isLoading = this.state.isLoading;
  readonly error = this.state.error;
  readonly userInitials = this.state.userInitials;

  constructor() {
    this.initializeAuth();
  }

  private async initializeAuth(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      const user = await this.repository.getCurrentUser();
      if (user) {
        this.state.setUser(user);
      }
    } catch (error) {
      console.error('Error inicializando autenticación:', error);
      this.state.reset();
    }
  }

  async login(credentials: LoginCredentials): Promise<void> {
    return this.loginUseCase.execute(credentials);
  }

  async register(data: RegisterData): Promise<void> {
    return this.registerUseCase.execute(data);
  }

  async logout(): Promise<void> {
    return this.logoutUseCase.execute();
  }

  clearError(): void {
    this.state.setError(null);
  }
}
