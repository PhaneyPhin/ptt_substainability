import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomeService extends BaseService {

  getHomeData(): Observable<any> {
    return this.http.get<any>(this.url + '/home/getHomeContent', this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }

  getHomeContentByFilter(data): Observable<any> {
    return this.http.post<any>(this.url + '/home/getHomeContentByFilter', data, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }
}

