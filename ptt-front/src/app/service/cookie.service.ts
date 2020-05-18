import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor() { }
  setCookie(cname: string, cvalue: string, expires_in: number) {
    localStorage.setItem(cname, cvalue);
  }

  getCookie(cname) {
    return localStorage.getItem(cname);
  }
  deleteCookie(name) {
    localStorage.removeItem(name);
  }
}
