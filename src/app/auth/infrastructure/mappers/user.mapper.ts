import { User } from '../../domain/model/user.entity';
import { UserDTO, AuthResponse } from '../../domain/model/auth.types';

/**
 * DTOs de la API (lo que viene del backend)
 */
export interface UserApiDTO {
  id: string;
  email: string;
  password: string;
  name: string;
  avatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthApiResponse {
  user: Omit<UserApiDTO, 'password'>;
  token: string;
}

/**
 * Mapper entre DTOs de API y entidades de dominio
 */
export class UserMapper {
  /**
   * Convierte un DTO de API a entidad de dominio
   */
  static toDomain(dto: UserApiDTO | Omit<UserApiDTO, 'password'>): User {
    return User.fromPrimitives({
      id: dto.id,
      email: dto.email,
      name: dto.name,
      avatarUrl: dto.avatarUrl ?? '',
      createdAt: dto.createdAt ?? new Date().toISOString(),
      updatedAt: dto.updatedAt ?? new Date().toISOString()
    });
  }

  /**
   * Convierte una entidad de dominio a DTO
   */
  static toDTO(user: User): UserDTO {
    return user.toPrimitives();
  }

  /**
   * Convierte un DTO de API (sin password) a DTO de dominio
   */
  static apiToDTO(dto: Omit<UserApiDTO, 'password'>): UserDTO {
    return {
      id: dto.id,
      email: dto.email,
      name: dto.name,
      avatarUrl: dto.avatarUrl ?? '',
      createdAt: dto.createdAt ?? new Date().toISOString(),
      updatedAt: dto.updatedAt ?? new Date().toISOString()
    };
  }

  /**
   * Convierte respuesta de auth de API a dominio
   */
  static authResponseToDomain(apiResponse: AuthApiResponse): AuthResponse {
    return {
      user: this.toDomain(apiResponse.user),
      token: apiResponse.token
    };
  }

  /**
   * Convierte lista de DTOs de API a entidades de dominio
   */
  static toDomainList(dtos: UserApiDTO[]): User[] {
    return dtos.map(dto => this.toDomain(dto));
  }
}
