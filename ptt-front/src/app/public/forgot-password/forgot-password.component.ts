import { Component, OnInit } from '@angular/core';
import { PublicService } from 'src/app/service/public.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'src/app/service/toast.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {


  private submited = false;
  private loading = false;
  private sendSuccess = false;
  private data = {};

  constructor(private route: ActivatedRoute, private router: Router, private publicService: PublicService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  onSubmit(form) {
    this.submited = true;
    if (form.valid && !this.loading) {
      this.loading = true;
      this.publicService.forgotPassword(this.data).subscribe(data => {

        this.sendSuccess = true;
        this.submited = false;
        this.loading = false;
        form.reset();

      }, error => {
        this.submited = false;
        this.loading = false;
      });
    }
  }

}
