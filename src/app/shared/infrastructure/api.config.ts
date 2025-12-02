// Centraliza la URL base de la API para despliegues locales y en Render.
// - Para desarrollo local, usa el backend Spring Boot
// - Para producción (Render), reemplaza las URLs aquí o define window.PS_API_BASE_URL en index.html

declare const window: any;

// URL base para autenticación (sin /v1)
export const API_AUTH_BASE_URL: string =
  (typeof window !== 'undefined' && window?.PS_API_BASE_URL) || 'http://localhost:8080/api';

// URL base para otros módulos (con /v1)
export const API_BASE_URL: string =
  (typeof window !== 'undefined' && window?.PS_API_BASE_URL_V1) || 'http://localhost:8080/api/v1';



