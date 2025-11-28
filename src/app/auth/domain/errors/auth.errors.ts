/**
 * Errores específicos del dominio de autenticación
 */

export abstract class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class InvalidCredentialsError extends AuthError {
  constructor(message: string = 'Credenciales inválidas') {
    super(message);
  }
}

export class UserAlreadyExistsError extends AuthError {
  constructor(email: string) {
    super(`El usuario con email ${email} ya existe`);
  }
}

export class UserNotFoundError extends AuthError {
  constructor(identifier?: string) {
    super(identifier
      ? `Usuario con identificador ${identifier} no encontrado`
      : 'Usuario no encontrado'
    );
  }
}

export class UnauthorizedError extends AuthError {
  constructor(message: string = 'No autorizado') {
    super(message);
  }
}

export class SessionExpiredError extends AuthError {
  constructor() {
    super('La sesión ha expirado');
  }
}

export class InvalidTokenError extends AuthError {
  constructor() {
    super('Token inválido o expirado');
  }
}

export class ValidationError extends AuthError {
  constructor(
    message: string,
    public readonly field?: string
  ) {
    super(message);
  }
}
