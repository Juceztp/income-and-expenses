import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromIngresoEgreso from '../ingreso-egreso-reducer';
import { IngresoEgreso } from '../ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from '../ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styles: []
})
export class DetailsComponent implements OnInit, OnDestroy {

  items: IngresoEgreso[];
  subscription: Subscription = new Subscription();

  constructor(
    private store: Store<fromIngresoEgreso.AppState>,
    public ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso')
      .subscribe( ingresoEgreso => {
        this.items = ingresoEgreso.items;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  removeItem(item: IngresoEgreso) {
    this.ingresoEgresoService
      .removeIngresoEgreso(item.uid)
      .then( () => {
        Swal('Eliminado', item.description, 'success');
      });
  }
}
