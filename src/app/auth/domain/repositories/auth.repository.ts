import { LoginCredentials, RegisterData, AuthResponse } from '../model/auth.types';
import { User } from '../model/user.entity';

/**
 * Repositorio de autenticación
 * Define el contrato para la persistencia y recuperación de datos de autenticación
 */
export interface AuthRepository {
  /**
   * Autentica un usuario con sus credenciales
   * @throws InvalidCredentialsError si las credenciales son incorrectas
   * @throws UnauthorizedError si el usuario está bloqueado
   */
  login(credentials: LoginCredentials): Promise<AuthResponse>;

  /**
   * Registra un nuevo usuario
   * @throws UserAlreadyExistsError si el email ya está registrado
   * @throws ValidationError si los datos son inválidos
   */
  register(data: RegisterData): Promise<AuthResponse>;

  /**
   * Obtiene el usuario actualmente autenticado
   * @returns User si hay sesión activa, null en caso contrario
   * @throws SessionExpiredError si el token expiró
   * @throws InvalidTokenError si el token es inválido
   */
  getCurrentUser(): Promise<User | null>;

  /**
   * Cierra la sesión del usuario actual
   */
  logout(): Promise<void>;

  /**
   * Verifica si un token es válido
   */
  verifyToken(token: string): Promise<boolean>;

  /**
   * Refresca el token de autenticación
   * @throws SessionExpiredError si la sesión ya no puede renovarse
   */
  refreshToken(): Promise<AuthResponse>;
}
