import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { catchError, map, flatMap } from 'rxjs/operators';

declare var iziToast: any;

@Injectable({
  providedIn: 'root'
})
export class DownloadService extends BaseService {

  getDocumentByCagetory(data): Observable<any> {
    return this.http.post<any>(this.url + '/download/getDocumentByCagetory', data, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }

  downloadDocument(data, callback: Function) {
    //console.log(data);
    let url = "";
    if (data.pdfFileAttach) {
      url = this.url + '/download/downloadPdfDocument/' + data.id;
    } else {
      url = this.url + '/download/downloadDocumentFile/' + data.id;
    }

    this.http.get<any>(url, this.httpOptionsFile).subscribe((resp: any) => {
      if (resp.ok) {
        let fileName = "";
        let fileType = resp.headers.get('content-type');
        var contentDisposition = resp.headers.get('content-disposition');

        if (contentDisposition) {
          //fileName = contentDisposition.split(';')[1].split('filename')[1].split('=')[1].trim();
          var encodeFilename = contentDisposition.split(';')[2];
          encodeFilename = encodeFilename.replace("filename*=UTF-8''",'');
          var decodeFilename = encodeFilename.substring(0, encodeFilename.indexOf('.'));
          var filetype = encodeFilename.substring(encodeFilename.indexOf('.') + 1, encodeFilename.length);

          fileName = decodeURIComponent(decodeFilename) + '.' + filetype;
        } else {
          fileName = data.documentName + (data.pdfFileAttach ? ".pdf" : this.getFileExt(fileType));
        }
        //console.log('file data', data, fileType);
        if (data.pdfFileAttach && fileType == 'application/pdf') {
          fileType = "application/pdf";
        }

        fileName = fileName.replace(new RegExp('"', 'g'), '');

        var blob = new Blob([resp.body], { type: fileType });
        // alert(JSON.stringify({filetype:data.fileType,fileURL:data.fileURL}));
        
        this.downloadData(data.fileName, blob, fileType,data.fileURL);
        callback(true);

      } else {
        iziToast.warning({
          title: 'Warning',
          message: resp.error
        });
        callback();
      }
    }, error => {
      //console.log(error);
      iziToast.warning({
        title: 'Warning',
        message: error.status == 500 ? "File not found." : error.statusText
      });
      callback();
    });

  }

  getDocumentWithSubCagetory(id, sub): Observable<any> {
    return this.http.get<any>(this.url + '/download/getDocumentWithSubCagetory/' + id + '/' + sub, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }



  getDocumentWithSubCagetoryFilter(data): Observable<any> {
    return this.http.post<any>(this.url + '/download/getDocumentWithSubCagetoryFilter', data, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }

  getAllDocumentWithSubCategory(data): Observable<any> {
    return this.http.post<any>(this.url + '/download/getAllDocumentWithSubCategory/', data, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }

  getAllDocumentWithSubCategoryFilter(data): Observable<any> {
    return this.http.post<any>(this.url + '/download/getAllDocumentWithSubCategoryFilter/', data, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }
}

