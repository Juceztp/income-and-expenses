import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';

import { User } from './user.model';
import * as firebase from 'firebase';

import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private afAuth: AngularFireAuth, private router: Router, private afDB: AngularFirestore) {}

  initAuthListener() {
    this.afAuth.authState.subscribe((fbUser: firebase.User) => {
      console.log(fbUser);
    });
  }

  createUser(name: string, email: string, password: string) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(response => {
        const user: User = {
          uid: response.user.uid,
          name: name,
          email: response.user.email
        };

        this.afDB.doc(`${user.uid}/usuario`)
          .set(user)
          .then(() => {
            this.router.navigate(['/']);
          });
      })
      .catch(err => {
        console.error(err);
        Swal('Error Register', err.message, 'error');
      });
  }

  login(email: string, password: string) {
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        this.router.navigate(['/']);
      })
      .catch(err => {
        console.error(err);
        Swal('Error Login', err.message, 'error');
      });
  }

  logout() {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
  }

  isAuth() {
    return this.afAuth.authState
    .pipe(
      map (fbUser => {
        if (fbUser === null) {
          this.router.navigate(['/login']);
        }
        return fbUser != null;
      })
    );
  }
}
