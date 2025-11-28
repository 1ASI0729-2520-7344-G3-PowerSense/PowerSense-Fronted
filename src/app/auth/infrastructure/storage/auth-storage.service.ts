import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StorageService, STORAGE_KEYS } from './storage.interface';
import { User } from '../../domain/model/user.entity';
import { AuthToken } from '../../domain/model/auth.types';

@Injectable({
  providedIn: 'root'
})
export class AuthStorageService implements StorageService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser: boolean;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  getItem(key: string): string | null {
    if (!this.isBrowser) return null;

    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error reading from storage:', error);
      return null;
    }
  }

  setItem(key: string, value: string): void {
    if (!this.isBrowser) return;

    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error writing to storage:', error);
    }
  }

  removeItem(key: string): void {
    if (!this.isBrowser) return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from storage:', error);
    }
  }

  clear(): void {
    if (!this.isBrowser) return;

    try {
      this.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      this.removeItem(STORAGE_KEYS.USER);
      this.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  }

  // Métodos específicos de autenticación

  saveAuthData(token: AuthToken, user: User): void {
    this.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    this.setItem(STORAGE_KEYS.USER, JSON.stringify(user.toPrimitives()));
  }

  getAuthToken(): AuthToken | null {
    return this.getItem(STORAGE_KEYS.AUTH_TOKEN);
  }

  getStoredUser(): User | null {
    const userStr = this.getItem(STORAGE_KEYS.USER);
    if (!userStr) return null;

    try {
      const userData = JSON.parse(userStr);
      return User.fromPrimitives(userData);
    } catch (error) {
      console.error('Error parsing stored user:', error);
      this.removeItem(STORAGE_KEYS.USER);
      return null;
    }
  }

  clearAuthData(): void {
    this.clear();
  }

  hasValidSession(): boolean {
    return !!(this.getAuthToken() && this.getStoredUser());
  }
}
