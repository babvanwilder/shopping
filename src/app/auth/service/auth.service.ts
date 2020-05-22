import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import 'firebase/auth';
import { IUser } from '../interface/user';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: IUser;
  public userSubject: Subject<IUser>;

  constructor(
    private fireStore: AngularFirestore,
    private fireAuth: AngularFireAuth
  ) {
    this.userSubject = new Subject<IUser>();
    fireAuth.authState.subscribe((user: IUser) => {
      this.user = user;
      this.emitUser();
    });
  }

  public emitUser(): void {
    this.userSubject.next(this.user);
  }

  public signIn(email: string, password: string, rememberMe: boolean): Promise<IUser> {
    return this.fireAuth.setPersistence(rememberMe ? auth.Auth.Persistence.SESSION : auth.Auth.Persistence.NONE).then(() => {
      return this.fireAuth.signInWithEmailAndPassword(email, password);
    }).then((userCredential: auth.UserCredential) => {
      return userCredential.user;
    });
  }

  public signUp(
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    displayName: string,
    rememberMe: boolean
  ): Promise<IUser> {
    return this.fireAuth.setPersistence(rememberMe ? auth.Auth.Persistence.SESSION : auth.Auth.Persistence.NONE).then(() => {
      return this.fireAuth.createUserWithEmailAndPassword(email, password);
    }).then((userCredential: auth.UserCredential) => {
      // Set displayName if required
      if (displayName !== '') {
        return userCredential.user.updateProfile({
          displayName
        }).then(() => {
          return userCredential.user;
        });
      } else {
        return userCredential.user;
      }
    }).then((user: IUser) => {
      // Create user document
      this.emitUser();
      return this.fireStore.collection('users').doc(user.uid).set({
        email,
        firstName,
        lastName
      }).then(() => {
        return user;
      });
    });
  }

  public signOut(): Promise<void> {
    return this.fireAuth.signOut();
  }

  public isAuth(): boolean {
    return !!this.user;
  }
}
