import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AboutSMService extends BaseService {

  getAboutSMList(id): Observable<any> {
    return this.http.get<any>(this.url + '/aboutsm/getAboutSMContent/' + id, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }
}

