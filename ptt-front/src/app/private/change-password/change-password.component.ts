import { Component, OnInit } from '@angular/core';
import { ToastService } from 'src/app/service/toast.service';
import { PublicService } from 'src/app/service/public.service';
import { CommonService } from 'src/app/service/common.service';

declare var $: any;

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  private submited = false;
  private changing = false;
  private data = {};
  private winAuth = false;

  constructor(private toastService: ToastService
    , private commonService: CommonService
    , private publicService: PublicService) { }

  ngOnInit() {

    $('#main-menu').click();

    // this for hide change password when user from window authentication
    if (localStorage.getItem('isWinAuth')) {
      this.winAuth = localStorage.getItem('isWinAuth') == 'yes' ? true : false;
    }

    let cUrl = window.location.href;
    let itemId = 0;
    this.commonService.addLog(cUrl, itemId).subscribe(data => {});
  }

  onSubmit(form) {
    this.submited = true;
    if (form.valid) {
      this.changing = true;
      this.publicService.changePassword(this.data).subscribe(data => {
        this.submited = false;
        this.changing = false;
        form.reset();
        this.toastService.showSuccess("Change password successfully.");
      }, error => {
        this.submited = false;
        this.changing = false;
      });
    }
  }
}
