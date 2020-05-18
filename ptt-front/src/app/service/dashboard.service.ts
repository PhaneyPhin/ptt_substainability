import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

declare var iziToast: any;

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {

  getDashboard(data): Observable<any> {
    return this.http.get<any>(this.url + '/dashboard/GetDashboardListByCategoryID/'+data.categoryID, this.httpOptions)
      .pipe(map(this.handleStatus()), catchError(this.handleError));
  }

  downloadPolicyZipFiles(id, name, callback: Function) {
    this.http.get<any>(this.url + '/policy/downloadPolicyZipFiles/' + id, this.httpOptionsFile).subscribe((resp: any) => {
      if (resp.ok) {
        var blob = new Blob([resp.body], { type: 'application/zip' });
        this.downloadData(name + '.zip', blob, 'application/zip');
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

  downloadPolicyFile(data, callback: Function) {
    let url = this.url + '/policy/downloadPolicyFile/' + data.id;

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
          fileName = data.fileName + (data.fileType ? ".pdf" : this.getFileExt(fileType));
        }
        if (data.fileType == 'application/pdf') {
          fileType = "application/pdf";
        }

        fileName = fileName.replace(new RegExp('"', 'g'), '');

        var blob = new Blob([resp.body], { type: fileType });
        this.downloadData(fileName, blob, fileType, data.fileURL);
        callback(true);

      } else {
        iziToast.warning({
          title: 'Warning',
          message: 'resp.error'
        });
        callback();
      }
    }, error => {
      iziToast.warning({
        title: 'Warning',
        message: error.status == 404 ? "No attach file." : error.statusText
      });
      callback();
    });
  }

}

