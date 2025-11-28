import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStorageService } from '../storage/auth-storage.service';

/**
 * Interceptor funcional para agregar el token a las peticiones HTTP
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authStorage = inject(AuthStorageService);
  const token = authStorage.getAuthToken();

  // Si no hay token o es una petición de login/register, continuar sin modificar
  if (!token || isAuthEndpoint(req.url)) {
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

function isAuthEndpoint(url: string): boolean {
  const authEndpoints = ['/login', '/register', '/auth'];
  return authEndpoints.some(endpoint => url.includes(endpoint));
}
