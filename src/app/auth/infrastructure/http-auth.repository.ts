import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, switchMap, throwError, Observable, firstValueFrom } from 'rxjs';

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
import { API_BASE_URL } from '../../shared/infrastructure/api.config';

@Injectable()
export class HttpAuthRepository implements AuthRepository {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(AuthStorageService);
  private readonly baseUrl = `${API_BASE_URL}/users`;

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const login$ = this.http.get<UserApiDTO[]>(this.baseUrl).pipe(
      map(users => {
        const user = users.find(
          u => u.email === credentials.email && u.password === credentials.password
        );

        if (!user) {
          throw new InvalidCredentialsError('Email o contraseña incorrectos');
        }

        return user;
      }),
      map(userDto => this.createAuthResponse(userDto)),
      catchError(error => this.handleError(error))
    );

    const response = await firstValueFrom(login$);
    this.storage.saveAuthData(response.token, response.user);
    return response;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const register$ = this.http.get<UserApiDTO[]>(this.baseUrl).pipe(
      switchMap(users => {
        const existingUser = users.find(u => u.email === data.email);

        if (existingUser) {
          throw new UserAlreadyExistsError(data.email);
        }

        const newUserDTO: UserApiDTO = {
          id: this.generateUserId(),
          email: data.email,
          password: data.password,
          name: data.name,
          avatarUrl: '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        return this.http.post<UserApiDTO>(this.baseUrl, newUserDTO);
      }),
      map(userDto => this.createAuthResponse(userDto)),
      catchError(error => this.handleError(error))
    );

    const response = await firstValueFrom(register$);
    this.storage.saveAuthData(response.token, response.user);
    return response;
  }

  async getCurrentUser(): Promise<User | null> {
    // Primero intentar desde storage
    const storedUser = this.storage.getStoredUser();
    const token = this.storage.getAuthToken();

    if (!token) {
      return null;
    }

    if (storedUser) {
      // Validar que el token sea válido
      const isValid = await this.verifyToken(token);
      return isValid ? storedUser : null;
    }

    return null;
  }

  async logout(): Promise<void> {
    this.storage.clearAuthData();
    return Promise.resolve();
  }

  async verifyToken(token: string): Promise<boolean> {
    // En un escenario real, esto haría una llamada al backend
    // Para el mock, solo verificamos que el token exista y tenga formato válido
    try {
      if (!token) return false;

      // Decodificar el token (nuestro token es base64)
      const decoded = atob(token);
      const [userId, timestamp] = decoded.split(':');

      if (!userId || !timestamp) return false;

      // Verificar que el token no tenga más de 7 días
      const tokenAge = Date.now() - parseInt(timestamp);
      const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 días

      return tokenAge < MAX_AGE;
    } catch {
      return false;
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    const currentUser = await this.getCurrentUser();

    if (!currentUser) {
      throw new SessionExpiredError();
    }

    // En un escenario real, esto llamaría al endpoint de refresh
    // Para el mock, generamos un nuevo token
    const newToken = this.generateToken(currentUser.id);
    const response: AuthResponse = {
      user: currentUser,
      token: newToken
    };

    this.storage.saveAuthData(newToken, currentUser);
    return response;
  }

  // Métodos privados

  private createAuthResponse(userDto: UserApiDTO): AuthResponse {
    const user = UserMapper.toDomain(userDto);
    const token = this.generateToken(user.id);

    return {
      user,
      token
    };
  }

  private generateToken(userId: string): string {
    return btoa(`${userId}:${Date.now()}`);
  }

  private generateUserId(): string {
    return `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

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
        case 401:
          return throwError(() => new UnauthorizedError());
        case 404:
          return throwError(() => new InvalidCredentialsError());
        default:
          return throwError(() => new Error('Error en la comunicación con el servidor'));
      }
    }

    // Error desconocido
    console.error('Unexpected error:', error);
    return throwError(() => new Error('Error inesperado'));
  }
}
