import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

declare var iziToast: any;

@Injectable({
  providedIn: 'root'
})
export class NewsService extends BaseService {

  getNews(data): Observable<any> {
    return this.http.post<any>(this.url + '/news/getNewsByCagetory', data, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }

  getNewsDetail(id): Observable<any> {
    return this.http.get<any>(this.url + '/news/getNewsDetail/' + id, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }

  downloadZipImages(id, callback: Function) {
    this.http.get<any>(this.url + '/news/downloadZipImages/' + id, this.httpOptionsFile).subscribe((resp: any) => {
      if (resp.ok) {
        var blob = new Blob([resp.body], { type: 'application/zip' });
        this.downloadData('images.zip', blob, 'application/zip');
        callback();
      } else {
        iziToast.warning({
          title: 'Warning',
          message: resp.error
        });
        callback();
      }
    }, error => {
      iziToast.warning({
        title: 'Warning',
        message: error
      });
      callback();
    });

  }

}

