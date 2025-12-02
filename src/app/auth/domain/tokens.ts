import { InjectionToken } from '@angular/core';
import { AuthRepository } from './repositories/auth.repository';

export const AUTH_REPOSITORY = new InjectionToken<AuthRepository>(
  'AuthRepository',
  {
    providedIn: 'root',
    factory: () => {
      throw new Error(
        'AUTH_REPOSITORY debe ser provisto en el módulo o configuración de la aplicación'
      );
    }
  }
);
