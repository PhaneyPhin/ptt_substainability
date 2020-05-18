import { Injectable } from '@angular/core';

declare var iziToast: any;

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  showSuccess(message) {
    iziToast.success({
      title: 'Success',
      message: message
    });
  }

  showError(message) {

    //console.log('showError', iziToast);

    iziToast.warning({
      class: 'error',
      title: 'Warning',
      message: message
    });
  }

}

