/**
 * Abstracción del almacenamiento
 * Permite cambiar localStorage por sessionStorage, IndexedDB, etc.
 */
export interface StorageService {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
}

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER: 'user',
  REFRESH_TOKEN: 'refresh_token'
} as const;
