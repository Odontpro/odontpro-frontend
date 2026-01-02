import { Injectable } from '@angular/core';
import { environment } from './environment';
import { User} from '../../shared/models/user.model';
import * as CryptoJS from 'crypto-js';
import {AuthResponse} from './auth.service';


@Injectable({
  providedIn: 'root'
})
export class CryptoService {

  private secretKey = environment.SECRET_KEY;

  encrypt(data: any): string {
    const json = JSON.stringify(data);
    return CryptoJS.AES.encrypt(json, this.secretKey).toString();
  }

  decrypt<T>(encryptedData: string): T | null {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      const decryptedJson = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedJson) as T;
    } catch (e) {
      console.error('Error al desencriptar:', e);
      return null;
    }
  }

  getToken(): string | null {
    const encryptedData = localStorage.getItem('odont-user');

    if (!encryptedData) {
      return null;
    }

    try {
      // Castamos el resultado a AuthResponse para que TS reconozca las propiedades
      const data = this.decrypt(encryptedData) as AuthResponse;

      if (data && data.accessToken) {
        return data.accessToken;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    }
  }


  getCurrentUser(): User | null {
    const encryptedUser = localStorage.getItem('odont-user');
    if (!encryptedUser) return null;

    try {
      const decrypted = this.decrypt<{ token: string; user: User }>(encryptedUser);
      return decrypted?.user ?? null;
    } catch (error) {
      console.error('Error al desencriptar usuario:', error);
      return null;
    }
  }

  getUserRole(): string | null {
    const encryptedUser = localStorage.getItem('odont-user');
    if (!encryptedUser) return null;

    try {
      const decrypted = this.decrypt<{ token: string; user: User }>(encryptedUser);
      return decrypted?.user.role ?? null;
    } catch (error) {
      console.error('Error al desencriptar usuario:', error);
      return null;
    }
  }

  getCurrentUserId(): number | null {
    const encryptedUser = localStorage.getItem('odont-user');
    if (!encryptedUser) return null;

    const currentUser = this.decrypt<{ token: string; user: { id: number } }>(encryptedUser);
    return currentUser?.user?.id ?? null;
  }

  isUserLogged(): boolean {
    const encryptedUser = localStorage.getItem('odont-user');
    return !!encryptedUser; // true if exists, false if null
  }


}
