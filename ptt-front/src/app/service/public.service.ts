import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PublicService extends BaseService {

  getCompanys(): Observable<any> {
    return this.http.get<any>(this.url + '/auth/getCompanys', this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }

  getSubContractCompanys(): Observable<any> {
    return this.http.get<any>(this.url + '/auth/getSubContractCompanys', this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }

  register(data): Observable<any> {
    return this.http.post<any>(this.url + '/auth/register', data, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }

  login(data): Observable<any> {
    return this.http.post<any>(this.url + '/auth/token', data, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }

  activate(data): Observable<any> {
    return this.http.post<any>(this.url + '/auth/activate', data, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }

  forgotPassword(data): Observable<any> {
    return this.http.post<any>(this.url + '/auth/forgotPassword', data, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }

  resetPassword(data): Observable<any> {
    return this.http.post<any>(this.url + '/auth/resetPassword', data, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }

  changePassword(data): Observable<any> {
    return this.http.post<any>(this.url + '/auth/changePassword', data, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }

  verifyResetPassToken(data): Observable<any> {
    return this.http.post<any>(this.url + '/auth/verifyResetPassToken', data, this.httpOptions)
      .pipe(map(this.handleStatus()));
  }
}

