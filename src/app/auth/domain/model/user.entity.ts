import { UserId, UserDTO, PublicUserDTO } from './auth.types';
import { Email, UserName } from './user.value-objects';

/**
 * Entidad de dominio User
 * Encapsula la lógica de negocio del usuario
 */
export class User {
  private constructor(
    public readonly id: UserId,
    private readonly _email: Email,
    private readonly _name: UserName,
    public readonly avatarUrl: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}

  // Getters para acceder a los value objects como strings
  get email(): string {
    return this._email.toString();
  }

  get name(): string {
    return this._name.toString();
  }

  // Acceso a los value objects completos (si necesitas la validación)
  get emailVO(): Email {
    return this._email;
  }

  get nameVO(): UserName {
    return this._name;
  }

  static create(data: {
    id: UserId;
    email: string;
    name: string;
    avatarUrl?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
  }): User {
    return new User(
      data.id,
      Email.create(data.email),
      UserName.create(data.name),
      data.avatarUrl || '',
      data.createdAt ? new Date(data.createdAt) : new Date(),
      data.updatedAt ? new Date(data.updatedAt) : new Date()
    );
  }

  static fromPrimitives(data: UserDTO): User {
    return User.create(data);
  }

  toPrimitives(): UserDTO {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      avatarUrl: this.avatarUrl,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

  toPublic(): PublicUserDTO {
    return {
      id: this.id,
      email: this.email,
      name: this.name,
      avatarUrl: this.avatarUrl,
      createdAt: this.createdAt.toISOString()
    };
  }

  getInitials(): string {
    return this._name.getInitials();
  }

  updateProfile(data: { name?: string; avatarUrl?: string }): User {
    return new User(
      this.id,
      this._email,
      data.name ? UserName.create(data.name) : this._name,
      data.avatarUrl ?? this.avatarUrl,
      this.createdAt,
      new Date() // updatedAt se actualiza
    );
  }

  hasAvatar(): boolean {
    return this.avatarUrl.trim().length > 0;
  }

  equals(other: User): boolean {
    return this.id === other.id;
  }
}
