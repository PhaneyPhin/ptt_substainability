import { Pipe, PipeTransform, NgModule } from '@angular/core';



@Pipe({
  name: 'thDate'
})

export class THDatePipe implements PipeTransform {

  transform(value: string, args?: any): Date {
    let date = this.addHour(new Date(value), 7);
    var year = date.getFullYear();
    var month = date.getMonth();
    var day = date.getDate();
    //date = new Date(year + 543, month, day)
    date = new Date(year, month, day);
    return date;
  }

  addHour(date, h) {
    date.setTime(date.getTime() + (h * 60 * 60 * 1000));
    return date;
  }

}
