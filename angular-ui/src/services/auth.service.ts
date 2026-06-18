import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSignal = signal(!!localStorage.getItem('currentUser'));

  isLoggedIn = this.isLoggedInSignal.asReadonly();

  login(user: any, child?: any) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    if (child) {
      localStorage.setItem('currentChild', JSON.stringify(child));
    }
    this.isLoggedInSignal.set(true);
  }

  logout() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentChild');
    this.isLoggedInSignal.set(false);
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  getCurrentChild() {
    const childStr = localStorage.getItem('currentChild');
    return childStr ? JSON.parse(childStr) : null;
  }

  async hashPassword(password: string): Promise<{ hash: string; salt: string }> {
    const saltBytes = crypto.getRandomValues(new Uint8Array(16));
    const saltHex = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    const encoder = new TextEncoder();
    const data = encoder.encode(password + saltHex);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return { hash: hashHex, salt: saltHex };
  }

  async verifyPassword(enteredPassword: string, storedHash: string, storedSalt: string): Promise<boolean> {
    const encoder = new TextEncoder();
    const data = encoder.encode(enteredPassword + storedSalt);
    
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const currentHashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    return currentHashHex === storedHash;
  }
}
