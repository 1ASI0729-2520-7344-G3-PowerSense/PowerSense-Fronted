// Centraliza la URL base de la API para despliegues locales y en Render.
// - Para desarrollo local, deja el valor por defecto (http://localhost:4000)
// - Para producción (Render), reemplaza la URL aquí o define window.PS_API_BASE_URL en index.html

declare const window: any;

export const API_BASE_URL: string =
  (typeof window !== 'undefined' && window?.PS_API_BASE_URL) || 'http://localhost:4000';


