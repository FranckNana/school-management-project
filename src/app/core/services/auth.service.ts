import { Injectable } from '@angular/core';
import { BehaviorSubject} from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'; 

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<firebase.User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  currentUser: firebase.User | null = null;

  constructor(private auth: AngularFireAuth) {
     this.auth.authState.subscribe((user) => {
      this.currentUserSubject.next(user);

      if (user) {
        const userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        };

        localStorage.setItem('currentUser', JSON.stringify(userData));
        console.log('Utilisateur connecté !');
      }else {
        localStorage.removeItem('currentUser');
        console.log('Aucun utilisateur connecté.');
      }
    });

  }

  login(email: string, password: string): Promise<void> {
    return this.auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        this.currentUser = userCredential.user;

        const userData = {
          uid: this.currentUser?.uid,
          email: this.currentUser?.email,
          displayName: this.currentUser?.displayName,
        };

        this.currentUserSubject.next(this.currentUser);
        localStorage.setItem('currentUser', JSON.stringify(userData));
        console.log('Utilisateur connecté !');
      })
      .catch((error) => {
        console.error('Erreur de connexion :', error);
        throw error;
      });
  }

  logout(){
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    return this.auth.signOut();
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  getCurrentUser(){
    return this.currentUserSubject.value;
  }

  async getToken(): Promise<string | null> {
    if (!this.currentUser) return null;
    return await this.currentUser.getIdToken();
  }
}