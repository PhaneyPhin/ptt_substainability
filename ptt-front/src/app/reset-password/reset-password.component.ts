import { Component, OnInit } from '@angular/core';
import { PublicService } from 'src/app/service/public.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  private loading = true;
  private submited = false;
  private reset = false;
  private resetSuccess = false;
  private reseted = false;

  private data = {
    code: null,
    NewPassword: null,
    Password: null
  };

  constructor(private publicService: PublicService, private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {

      this.data.code = params['v'];
      this.publicService.verifyResetPassToken(this.data).subscribe(data => {
        this.loading = false;
      }, error => {
        this.reseted = true;
        this.loading = false;
        // this.loading = false;
      });

    });
  }

  onSubmit(form) {
    this.submited = true;
    if (form.valid && this.data.NewPassword === this.data.Password) {
      this.reset = true;
      this.publicService.resetPassword(this.data).subscribe(data => {
        this.submited = false;
        this.reset = false;
        this.resetSuccess = true;
        form.reset();
      }, error => {
        this.submited = false;
        this.reset = false;
      });
    }
  }
}
