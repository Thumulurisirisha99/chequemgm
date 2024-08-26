import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }
  private isLocalStorageAvailable(): boolean {
    return typeof sessionStorage !== 'undefined';
  }
  setItem(key: string, value: string): void {
    if (this.isLocalStorageAvailable()) {
      sessionStorage.setItem(key, value);
    }
  }
  getItem(key: string): string | null {
    if (this.isLocalStorageAvailable()) {
      return sessionStorage.getItem(key);
    }
    return null;
  }
  removeItem(key: string): void {
    if (this.isLocalStorageAvailable()) {
      sessionStorage.removeItem(key);
    }
  }
  clear(): void {
    if (this.isLocalStorageAvailable()) {
      sessionStorage.clear();
    }
  }
}
