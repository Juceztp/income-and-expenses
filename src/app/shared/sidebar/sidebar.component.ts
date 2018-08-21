import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { IngresoEgresoService } from '../../ingreso-egreso/ingreso-egreso.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: []
})
export class SidebarComponent implements OnInit {

  username: string;
  subscription: Subscription = new Subscription();

  constructor(public authService: AuthService,
    private store: Store<AppState>,
    public ingresoEgresoService: IngresoEgresoService) { }

  ngOnInit() {
    this.subscription = this.store.select('auth')
      .pipe(
        filter(auth => auth.user != null)
      )
      .subscribe( auth => {
        this.username = auth.user.name;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.ingresoEgresoService.unsubscribe();
  }
 
  logout() {
    this.authService.logout();
  }
}
