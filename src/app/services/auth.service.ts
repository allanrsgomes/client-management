import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router
  ) {
    this.user$ = this.afAuth.authState;
  }

  async login(email: string, password: string): Promise<any> {
    try {
      const result = await this.afAuth.signInWithEmailAndPassword(email, password);
      this.router.navigate(['/clients']);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async register(email: string, password: string): Promise<any> {
    try {
      const result = await this.afAuth.createUserWithEmailAndPassword(email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async logout(): Promise<void> {
    await this.afAuth.signOut();
    this.router.navigate(['/login']);
  }

  async resetPassword(email: string): Promise<void> {
    await this.afAuth.sendPasswordResetEmail(email);
  }

  isAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
      this.afAuth.authState.subscribe(user => {
        resolve(!!user);
      });
    });
  }

  getCurrentUser(): Promise<any> {
    return this.afAuth.currentUser;
  }
}
