import { Component, OnInit } from '@angular/core';
import { ContactUsService } from 'src/app/service/contact-us.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { CommonService } from 'src/app/service/common.service';

declare var iziToast: any;

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {

  private submited = false;
  private loadSubj = false;
  private loading = false;
  private subjects = [];
  private data = {
    SubjectTypeID: null,
    Detail: ''
  }

  constructor(private contactUsService: ContactUsService
    , private commonService: CommonService
    , private formBuilder: FormBuilder) { 
    
  }

  ngOnInit() {

    this.loadSubj = true;
    this.contactUsService.getSubjects().subscribe(data => {
      this.subjects = data;
      this.loadSubj = false;

      // let btnClear:HTMLElement = document.getElementById('btnclear') as HTMLElement;
      // btnClear.click();
    });
    this.contactUsService.addContactCounter().subscribe(d => {});
    let cUrl = window.location.href;
    let itemId = 0;
    this.commonService.addLog(cUrl, itemId).subscribe(data => {});
  }

  onSubmit(form) {

    this.submited = true;
    if (form.valid) {
      this.loading = true;
      this.contactUsService.submitContactForm(this.data).subscribe(data => {

        iziToast.success({
          title: 'Success',
          message: 'Send contact complete'
        });

        this.data = {
          SubjectTypeID: null,
          Detail: ''
        }
        this.submited = false;
        this.loading = false;

        form.reset();

      });
    }

  }



}
