/**
 * Value Objects para el dominio de autenticación
 * Encapsulan validación y lógica de negocio
 */

export class Email {
  private readonly value: string;

  private constructor(email: string) {
    this.value = email;
  }

  static create(email: string): Email {
    const trimmed = email.trim().toLowerCase();

    if (!trimmed) {
      throw new Error('El email no puede estar vacío');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      throw new Error('El formato del email es inválido');
    }

    return new Email(trimmed);
  }

  toString(): string {
    return this.value;
  }

  equals(other: Email): boolean {
    return this.value === other.value;
  }
}

export class Password {
  private readonly value: string;

  private constructor(password: string) {
    this.value = password;
  }

  static create(password: string): Password {
    if (!password) {
      throw new Error('La contraseña no puede estar vacía');
    }

    if (password.length < 6) {
      throw new Error('La contraseña debe tener al menos 6 caracteres');
    }

    return new Password(password);
  }

  toString(): string {
    return this.value;
  }

  // No implementamos equals por seguridad
  // Las contraseñas no deberían compararse directamente en el dominio
}

export class UserName {
  private readonly value: string;

  private constructor(name: string) {
    this.value = name;
  }

  static create(name: string): UserName {
    const trimmed = name.trim();

    if (!trimmed) {
      throw new Error('El nombre no puede estar vacío');
    }

    if (trimmed.length < 2) {
      throw new Error('El nombre debe tener al menos 2 caracteres');
    }

    if (trimmed.length > 100) {
      throw new Error('El nombre no puede exceder 100 caracteres');
    }

    return new UserName(trimmed);
  }

  toString(): string {
    return this.value;
  }

  getInitials(): string {
    const parts = this.value.trim().split(/\s+/);

    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    return this.value.substring(0, 2).toUpperCase();
  }
}
