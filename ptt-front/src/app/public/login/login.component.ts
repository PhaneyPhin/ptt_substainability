import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicService } from 'src/app/service/public.service';
import { CookieService } from 'src/app/service/cookie.service';
import { environment } from 'src/environments/environment';
import { ToastService } from 'src/app/service/toast.service';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

declare var $: any;
declare var iziToast: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private loading = false;
  private loadLogin = false;
  private submited = false;
  private companys = [];
  private data = {
    CompanyID: '0',
    LDAPUsername: null,
    Username: null
  }

  private selectedCompany = {
    id: null,
    companyType: null,
    Username: null
  };

  private error = {};

  constructor(private router: Router
    , private cookieService: CookieService
    , private publicService: PublicService
    , private toastService: ToastService
    , private http: HttpClient) { }

  ngOnInit() {

    this.loading = true;
    this.publicService.getCompanys().subscribe(data => {
      this.companys = data;
      this.selectedCompany = data[0];
      this.data.CompanyID = data[0].id;
      this.loading = false;
    });

    // checking is authorized by window auth
    // $.ajax({
    //   url: environment.apiWinAuthEndPoint + '/auth/winlogin', xhrFields: {
    //     withCredentials: true
    //   }, success: function (data) {
    //     console.log(JSON.stringify(data));
    //     //var u = JSON.stringify(data);
    //   }
    // })
    this.winAuthLogin().subscribe((data) => {
      //console.log('authorzied win auth data >>', data);
      localStorage.setItem('isWinAuth', 'yes');
      this.cookieService.setCookie(environment.cookieToken, JSON.stringify(data), environment.cookieExpire);
      var current = localStorage.getItem('currentRoute');
      if (current) {
        this.router.navigate([current]);
      } else {
        this.router.navigate(['/home']);
      }
    });

  }

  winAuthLogin(): Observable<string> {
    let httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      withCredentials: true
    };
    
    let serviceUrl: string = environment.apiWinAuthEndPoint + '/auth/winlogin';
    return this.http.get(serviceUrl).pipe(map((rslt: string) => {
      return rslt;
    }));
  }

  companyChange($event) {
    this.selectedCompany = this.companys.filter(c => c.id === parseInt(this.data.CompanyID))[0];
  }

  private onSubmit(form) {

    this.submited = true;
    if (form.valid) {
      this.loadLogin = true;
      this.data.CompanyID = this.selectedCompany.id;
      this.data.Username = null;
      this.data.LDAPUsername = null;
      if (this.selectedCompany.companyType === "SUBCONTRACT") {
        this.data.Username = this.selectedCompany.Username;
      } else {
        this.data.LDAPUsername = this.selectedCompany.Username;
      }
      this.publicService.login(this.data).subscribe(data => {
        if (this.selectedCompany.companyType === "SUBCONTRACT") {
          localStorage.setItem('isWinAuth', 'no');
        } else {
          localStorage.setItem('isWinAuth', 'yes');
        }

        this.cookieService.setCookie(environment.cookieToken, JSON.stringify(data), environment.cookieExpire);
        var current=localStorage.getItem('currentRoute');
        if(current){
          this.router.navigate([current]);
        }else{
          this.router.navigate(['/home']);
        }

      }, error => {
        this.toastService.showError("Username or Password is Invalid.");
        this.loadLogin = false;
      });
    }
  }

}
