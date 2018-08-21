import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';

import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';
import { ActiveLoadingAction, InactiveLoadingAction } from '../shared/ui.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: []
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {

  form: FormGroup;
  type = 'ingreso';
  loadingSubs: Subscription = new Subscription();
  loading: boolean;

  constructor(private ingresoEgresoService: IngresoEgresoService, private store: Store<AppState>) { }

  ngOnInit() {
    this.loadingSubs = this.store.select('ui')
      .subscribe(ui => this.loading = ui.isLoading);
    this.form = new FormGroup({
      'description': new FormControl('', Validators.required),
      'amount': new FormControl('', [Validators.required, Validators.min(0)])
    });
  }

  ngOnDestroy() {
    this.loadingSubs.unsubscribe();
  }

  createIncomeExpense() {
    this.store.dispatch(new ActiveLoadingAction());
    const ingresoEgreso = new IngresoEgreso({
      ...this.form.value,
      type: this.type
    });
    this.ingresoEgresoService
      .createIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.store.dispatch(new InactiveLoadingAction());
        Swal('Creado', ingresoEgreso.description, 'success');
        this.form.reset({ amount: 0 });
      });
  }
}
