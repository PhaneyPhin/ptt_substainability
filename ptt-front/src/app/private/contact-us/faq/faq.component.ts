import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactUsService } from 'src/app/service/contact-us.service';
import { CommonService } from 'src/app/service/common.service';

declare function initFaqIcon();

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {


  private data = {
    categoryID: null,
    pageSize: 6,
    pageNumber: 1,
    total: 0,
    faQs: [],
    filter: {}
  };

  private loading = false;

  constructor(private route: ActivatedRoute
    , private commonService: CommonService
    , private contactUsService: ContactUsService) { }

  ngOnInit() {
    let cUrl = window.location.href;
    let itemId = 0;
    this.commonService.addLog(cUrl, itemId).subscribe(data => {});

    this.pageChange(null);
  }

  pageChange($event) {
    this.loading = true;
    this.contactUsService.getFaq(this.data).subscribe(data => {
      this.data = data;
      this.loading = false;

      setTimeout(initFaqIcon, 100);
    });
  }

  addFAQsCounter(id) {
    this.contactUsService.addfaqCounter(id).subscribe(d => {});
    let cUrl = window.location.href;
    let itemId = id;
    this.commonService.addLog(cUrl, itemId).subscribe(data => {});
  }
  searchCallback(data) {
    this.data.pageNumber = 1;
    this.data.filter = data;
    this.pageChange(null);
  }

}
