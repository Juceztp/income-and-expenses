import { Pipe, PipeTransform } from '@angular/core';
import { IngresoEgreso } from './ingreso-egreso.model';

@Pipe({
  name: 'sortIngresoEgreso'
})
export class SortIngresoEgresoPipe implements PipeTransform {

  transform(items: IngresoEgreso[]): IngresoEgreso[] {
    return items.sort( (a, b) => {
      if (a.type === 'ingreso') {
        return -1;
      } else {
        return 1;
      }
    });
  }

}
