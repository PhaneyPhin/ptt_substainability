import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService extends BaseService {

  getApplications(): Observable<any> {
    return this.http.get<any>(this.url + '/application/getApplications', this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }


  getApplicationFilter(data): Observable<any> {
    return this.http.post<any>(this.url + '/application/getApplicationFilter', data, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }

  addApplicationCounter(applicationId): Observable<any> {
    return this.http.get<any>(this.url + '/application/addApplicationCounter/' + applicationId, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }
}

