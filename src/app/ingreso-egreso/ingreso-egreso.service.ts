import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { IngresoEgreso } from './ingreso-egreso.model';
import { AuthService } from '../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { filter, map } from 'rxjs/operators';
import { SetItemsAction, UnsetItemsAction } from './ingreso-egreso.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {

  ingresoEgresoListerSubscription: Subscription = new Subscription();
  ingresoEgresoItemsSubscription: Subscription = new Subscription();

  constructor(
    private afDB: AngularFirestore,
    private authService: AuthService,
    private store: Store<AppState>) { }

  initIngresoEgresoListener() {
    this.ingresoEgresoListerSubscription = this.store.select('auth')
      .pipe(
        filter( auth => auth.user !== null)
      )
      .subscribe(auth => this.ingresoEgresoItems(auth.user.uid));
  }

  private ingresoEgresoItems(uid: string) {
    this.ingresoEgresoItemsSubscription = this.afDB.collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map( docData => {
          return docData.map( doc => {
            return {
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data()
            };
          });
        })
      )
      .subscribe( (collection: any[]) => {
        this.store.dispatch(new SetItemsAction(collection));
      });
  }

  unsubscribe() {
    this.ingresoEgresoListerSubscription.unsubscribe();
    this.ingresoEgresoItemsSubscription.unsubscribe();
    this.store.dispatch(new UnsetItemsAction());
  }

  createIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const user = this.authService.getUser();
    return this.afDB
      .doc(`${user.uid}/ingresos-egresos`)
      .collection('items')
      .add({...ingresoEgreso});
  }

  removeIngresoEgreso(uid: string) {
    const user = this.authService.getUser();
    return this.afDB
      .doc(`${user.uid}/ingresos-egresos/items/${uid}`)
      .delete();
  }
}
