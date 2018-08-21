import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { IngresoEgreso } from '../ingreso-egreso.model';

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styles: []
})
export class StatisticsComponent implements OnInit {

  incomes: number;
  expenses: number;
  incomeCounter: number;
  expenseCounter: number;
  
  subscription: Subscription = new Subscription();

  public doughnutChartLabels:string[] = ['Egresos', 'Ingresos'];
  public doughnutChartData:number[] = [];

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
    this.subscription = this.store.select('ingresoEgreso')
      .subscribe( IngresoEgreso => {
        this.countIncomeExpense (IngresoEgreso.items);
      })
  }

  countIncomeExpense( items: IngresoEgreso[] ) {
    this.incomes = 0;
    this.expenses = 0;
    this.incomeCounter = 0;
    this.expenseCounter = 0;
    items.forEach( item => {
      if (item.type === 'ingreso') {
        this.incomeCounter++;
        this.incomes += item.amount;
      } else {
        this.expenseCounter++;
        this.expenses += item.amount;
      }
    });
    this.doughnutChartData = [this.expenses, this.incomes];
  }
}
