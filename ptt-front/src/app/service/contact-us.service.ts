import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ContactUsService extends BaseService {

  getFaq(data): Observable<any> {
    return this.http.post<any>(this.url + '/contact/getFAQs', data, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }

  getSubjects(): Observable<any> {
    return this.http.get<any>(this.url + '/contact/getSubjects', this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }

  submitContactForm(data): Observable<any> {
    return this.http.post<any>(this.url + '/contact/submit', data, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }

  addfaqCounter(faqsId): Observable<any> {
    return this.http.get<any>(this.url + '/contact/addfaqCounter/'+faqsId, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }
  addContactCounter(): Observable<any> {
    return this.http.get<any>(this.url + '/contact/addContactCounter', this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }
}

