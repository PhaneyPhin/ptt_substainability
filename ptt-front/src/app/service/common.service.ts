import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class CommonService extends BaseService {
  
  getCategory(): Observable<any> {
    return this.http.get<any>(this.url + '/category/getCategory', this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }
  getCategoryByID(cagetoryID): Observable<any> {
    return this.http.get<any>(this.url + '/category/getCategoryByID/' + cagetoryID, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }
  searchAllContent(data): Observable<any> {
    return this.http.post<any>(this.url + '/home/searchAllContent', data, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }

  
  addLog(url, itemId): Observable<any> {
    let data = {
      "pageURL": url,
      "itemId": itemId
    }
    return this.http.post<any>(this.url + '/log/addInfo', data, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }
  addDownloadLog(url, itemId): Observable<any> {
    let data = {
      "pageURL": url,
      "itemId": itemId
    }
    return this.http.post<any>(this.url + '/log/addDownloadInfo', data, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }
  getCoverImage(){
    // 
    return this.http.get<any>(this.url + '/coverImage/getCoverImage', this.httpOptions)
    .pipe(map(this.handleStatus()), catchError(this.handleError));
  }
  getImage(id){
    let images:any=localStorage.getItem('coverImage')==undefined?'[]':localStorage.getItem('coverImage');
    images=JSON.parse(images);

    let image=images.filter((item)=>item.id==id);
    if(image.length>0){
      return image[0].thumbnail;
    }else{
      return null;
    }

  }
}

