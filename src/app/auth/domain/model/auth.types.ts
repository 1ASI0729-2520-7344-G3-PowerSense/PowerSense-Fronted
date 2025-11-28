/**
 * Tipos y interfaces para el dominio de autenticación
 */

import { User } from './user.entity';

export type UserId = string;
export type AuthToken = string;

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface RegisterData {
  readonly email: string;
  readonly password: string;
  readonly name: string;
}

export interface AuthResponse {
  readonly user: User;
  readonly token: AuthToken;
}

/**
 * DTO de usuario (representación primitiva)
 * Se usa para serialización/deserialización
 */
export interface UserDTO {
  readonly id: UserId;
  readonly email: string;
  readonly name: string;
  readonly avatarUrl: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

/**
 * Tipo para usuario sin información sensible
 */
export type PublicUserDTO = Omit<UserDTO, 'updatedAt'>;

/**
 * Tipo para actualización de perfil
 */
export interface UpdateUserData {
  readonly name?: string;
  readonly avatarUrl?: string;
}
