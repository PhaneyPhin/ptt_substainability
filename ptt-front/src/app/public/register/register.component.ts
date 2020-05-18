import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PublicService } from 'src/app/service/public.service';
import { Router } from '@angular/router';

declare var iziToast: any;
declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  private loading = false;
  private subContractCompanys = [];
  private submited = false;
  private regis = false;
  private regisSuccess = false;
  private passwordError = false;

  private data = {
    CompanyID: null,
    Password: null
  };

  constructor(private publicService: PublicService, private router: Router) { }

  ngOnInit() {
    this.loading = true;
    this.publicService.getSubContractCompanys().subscribe(data => {
      this.subContractCompanys = data;
      this.loading = false;
      setTimeout(() => {
        $('[type=reset]').click();
      }, 1000);
    });
  }

  onSubmit(form) {
    this.submited = true;
    this.passwordError = false;

    if (form.valid && !this.passwordError) {
      this.regis = true;
      this.publicService.register(this.data).subscribe(data => {
        iziToast.success({
          title: 'Success',
          message: 'Register complete'
        });
        this.data = {
          CompanyID: null,
          Password: null
        }
        this.submited = false;
        this.regis = false;
        this.regisSuccess = true;
        form.reset();
      }, error => {
        this.submited = false;
        this.regis = false;
      });
    }
  }

  textChanged(event) {
    let hasUpper = /[A-Z]/.test(this.data.Password);
    let hasLower = /[a-z]/.test(this.data.Password);
    this.passwordError = !hasUpper || !hasLower || this.data.Password.length < 8;
  }

}
