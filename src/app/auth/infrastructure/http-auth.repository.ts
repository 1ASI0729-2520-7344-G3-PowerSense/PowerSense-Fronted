import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, throwError, Observable, firstValueFrom } from 'rxjs';

import { AuthRepository } from '../domain/repositories/auth.repository';
import { LoginCredentials, RegisterData, AuthResponse } from '../domain/model/auth.types';
import { User } from '../domain/model/user.entity';
import {
  InvalidCredentialsError,
  UserAlreadyExistsError,
  SessionExpiredError,
  InvalidTokenError,
  UnauthorizedError
} from '../domain/errors/auth.errors';

import { UserMapper, UserApiDTO } from './mappers/user.mapper';
import { AuthStorageService } from './storage/auth-storage.service';
import { API_AUTH_BASE_URL } from '../../shared/infrastructure/api.config';

// DTOs para las respuestas del backend JWT
interface LoginResponseDTO {
  user: UserApiDTO;
  token: string;
  refreshToken?: string;
}

interface RegisterResponseDTO {
  user: UserApiDTO;
  token: string;
  refreshToken?: string;
}

interface RefreshTokenResponseDTO {
  token: string;
  refreshToken?: string;
}

@Injectable()
export class HttpAuthRepository implements AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(AuthStorageService);
  private readonly authUrl = `${API_AUTH_BASE_URL}/auth`;

  /**
   * Login con JWT real
   * POST /auth/login
   * Body: { email: string, password: string }
   * Response: { user: UserDTO, token: string, refreshToken?: string }
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const login$ = this.http.post<LoginResponseDTO>(`${this.authUrl}/login`, {
      email: credentials.email,
      password: credentials.password
    }).pipe(
      map(response => {
        const user = UserMapper.toDomain(response.user);
        const authResponse: AuthResponse = {
          user,
          token: response.token
        };
        return authResponse;
      }),
      catchError(error => this.handleError(error))
    );

    const response = await firstValueFrom(login$);
    this.storage.saveAuthData(response.token, response.user);
    return response;
  }

  /**
   * Registro con JWT real
   * POST /auth/register
   * Body: { email: string, password: string, name: string }
   * Response: { user: UserDTO, token: string, refreshToken?: string }
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const register$ = this.http.post<RegisterResponseDTO>(`${this.authUrl}/register`, {
      email: data.email,
      password: data.password,
      name: data.name
    }).pipe(
      map(response => {
        const user = UserMapper.toDomain(response.user);
        const authResponse: AuthResponse = {
          user,
          token: response.token
        };
        return authResponse;
      }),
      catchError(error => this.handleError(error))
    );

    const response = await firstValueFrom(register$);
    this.storage.saveAuthData(response.token, response.user);
    return response;
  }

  /**
   * Obtener usuario actual
   * GET /auth/me
   * Headers: { Authorization: Bearer <token> }
   * Response: UserDTO
   */
  async getCurrentUser(): Promise<User | null> {
    const token = this.storage.getAuthToken();

    if (!token) {
      // Limpiar cualquier dato residual
      this.storage.clearAuthData();
      return null;
    }

    try {
      // Intentar obtener usuario desde el backend
      const user$ = this.http.get<UserApiDTO>(`${this.authUrl}/me`).pipe(
        map(userDto => UserMapper.toDomain(userDto)),
        catchError((error) => {
          // Si falla (401, 403, etc.), limpiar storage y retornar null
          this.storage.clearAuthData();
          return throwError(() => null);
        })
      );

      const user = await firstValueFrom(user$);

      // Actualizar usuario en storage solo si se obtuvo correctamente
      if (user) {
        this.storage.saveAuthData(token, user);
        return user;
      }

      return null;
    } catch {
      // Si hay error, limpiar storage y retornar null (no usar datos del storage)
      this.storage.clearAuthData();
      return null;
    }
  }

  /**
   * Logout
   * POST /auth/logout (opcional, depende del backend)
   * Headers: { Authorization: Bearer <token> }
   */
  async logout(): Promise<void> {
    const token = this.storage.getAuthToken();

    if (token) {
      try {
        // Intentar notificar al backend (opcional)
        await firstValueFrom(
          this.http.post(`${this.authUrl}/logout`, {}).pipe(
            catchError(() => {
              // Ignorar errores del logout en el backend
              return throwError(() => null);
            })
          )
        );
      } catch {
        // Continuar con el logout local aunque falle el backend
      }
    }

    this.storage.clearAuthData();
  }

  /**
   * Verificar token
   * GET /auth/verify
   * Headers: { Authorization: Bearer <token> }
   * Response: { valid: boolean }
   */
  async verifyToken(token: string): Promise<boolean> {
    try {
      if (!token) return false;

      const verify$ = this.http.get<{ valid: boolean }>(`${this.authUrl}/verify`).pipe(
        map(response => response.valid),
        catchError(() => throwError(() => false))
      );

      return await firstValueFrom(verify$);
    } catch {
      return false;
    }
  }

  /**
   * Refrescar token
   * POST /auth/refresh
   * Body: { refreshToken: string } o Headers: { Authorization: Bearer <token> }
   * Response: { token: string, refreshToken?: string }
   */
  async refreshToken(): Promise<AuthResponse> {
    const currentToken = this.storage.getAuthToken();

    if (!currentToken) {
      throw new SessionExpiredError();
    }

    try {
      const refresh$ = this.http.post<RefreshTokenResponseDTO>(`${this.authUrl}/refresh`, {}).pipe(
        map(response => response.token),
        catchError(error => this.handleError(error))
      );

      const newToken = await firstValueFrom(refresh$);

      // Obtener usuario actualizado
      const user = await this.getCurrentUser();

      if (!user) {
        throw new SessionExpiredError();
      }

      const authResponse: AuthResponse = {
        user,
        token: newToken
      };

      this.storage.saveAuthData(newToken, user);
      return authResponse;
    } catch (error) {
      this.storage.clearAuthData();
      throw new SessionExpiredError();
    }
  }

  // Métodos privados

  private handleError(error: unknown): Observable<never> {
    // Si ya es un error del dominio, propagarlo
    if (error instanceof InvalidCredentialsError ||
      error instanceof UserAlreadyExistsError ||
      error instanceof SessionExpiredError ||
      error instanceof InvalidTokenError ||
      error instanceof UnauthorizedError) {
      return throwError(() => error);
    }

    // Manejar errores HTTP
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 400:
          // Bad request - probablemente validación
          const message = error.error?.message || 'Datos inválidos';
          return throwError(() => new Error(message));

        case 401:
          // Unauthorized - credenciales inválidas o token expirado
          if (error.url?.includes('/login')) {
            return throwError(() => new InvalidCredentialsError('Email o contraseña incorrectos'));
          }
          return throwError(() => new UnauthorizedError());

        case 409:
          // Conflict - usuario ya existe
          const email = error.error?.email || '';
          return throwError(() => new UserAlreadyExistsError(email));

        case 422:
          // Unprocessable entity - validación
          return throwError(() => new Error(error.error?.message || 'Datos inválidos'));

        case 500:
        case 502:
        case 503:
          return throwError(() => new Error('Error en el servidor. Intenta más tarde.'));

        default:
          return throwError(() => new Error('Error en la comunicación con el servidor'));
      }
    }

    // Error desconocido
    console.error('Unexpected error:', error);
    return throwError(() => new Error('Error inesperado'));
  }
}
