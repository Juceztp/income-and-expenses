import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';

import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { ActiveLoadingAction, InactiveLoadingAction } from '../shared/ui.actions';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';

import { User } from './user.model';
import * as firebase from 'firebase';

import Swal from 'sweetalert2';
import { map } from 'rxjs/operators';
import { SetUserAction, UnsetUserAction } from './auth.actions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubscription: Subscription = new Subscription();
  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private afDB: AngularFirestore,
    private store: Store<AppState>) {}
    private user: User;
  initAuthListener() {
    this.afAuth.authState.subscribe((fbUser: firebase.User) => {
      if (fbUser) {
        this.userSubscription = this.afDB.doc(`${fbUser.uid}/usuario`).valueChanges()
          .subscribe( (userObj: any) => {
            const newUser = new User(userObj);
            this.store.dispatch(new SetUserAction(newUser));
            this.user = newUser;
          });
      } else {
        this.user = null;
       this.userSubscription.unsubscribe();
      }
    });
  }

  createUser(name: string, email: string, password: string) {
    this.store.dispatch(new ActiveLoadingAction());
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
            this.store.dispatch(new InactiveLoadingAction());
          });
      })
      .catch(err => {
        console.error(err);
        Swal('Error Register', err.message, 'error');
        this.store.dispatch(new InactiveLoadingAction());
      });
  }

  login(email: string, password: string) {
    this.store.dispatch(new ActiveLoadingAction());
    this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        this.router.navigate(['/']);
        this.store.dispatch(new InactiveLoadingAction());
      })
      .catch(err => {
        console.error(err);
        Swal('Error Login', err.message, 'error');
        this.store.dispatch(new InactiveLoadingAction());
      });
  }

  logout() {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
    this.store.dispatch(new UnsetUserAction());
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

  getUser() {
    return {...this.user};
  }
}
