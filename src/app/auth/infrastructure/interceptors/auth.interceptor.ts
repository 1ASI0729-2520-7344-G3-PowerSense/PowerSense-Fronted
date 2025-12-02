import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStorageService } from '../storage/auth-storage.service';

/**
 * Interceptor funcional para agregar el token JWT a las peticiones HTTP
 * 
 * Agrega el header Authorization: Bearer <token> a todas las peticiones
 * excepto a los endpoints de login y register
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStorage = inject(AuthStorageService);
  const token = authStorage.getAuthToken();

  // Si no hay token, continuar sin modificar
  if (!token) {
    return next(req);
  }

  // No agregar token a login y register (pero sí a otros endpoints de /auth)
  if (isPublicAuthEndpoint(req.url)) {
    return next(req);
  }

  // Clonar la petición y agregar el header de autorización
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(authReq);
};

/**
 * Verifica si el endpoint es público (no requiere autenticación)
 */
function isPublicAuthEndpoint(url: string): boolean {
  const publicEndpoints = [
    '/auth/login',
    '/auth/register'
  ];

  return publicEndpoints.some(endpoint => url.includes(endpoint));
}
