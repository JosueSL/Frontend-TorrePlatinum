import { Injectable } from '@angular/core';
import { ILogin } from '../../modelos/login/login';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  logout(): void {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
  }
}
