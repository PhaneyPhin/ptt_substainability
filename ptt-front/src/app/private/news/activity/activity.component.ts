import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/service/common.service';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from 'src/app/service/news.service';

import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})

export class ActivityComponent implements OnInit {

  private data = {
    categoryID: null,
    pageSize: 6,
    pageNumber: 1,
    total: 0,
    news: [],
    filter: {}
  };

  private loading = false;
  private color = '#3db049';
  private categoryName = 'Activity and Gallery'

  constructor(private route: ActivatedRoute
    , private newsService: NewsService
    , private commonService: CommonService
    , private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.data.categoryID = this.route.snapshot.params['id'];
    this.commonService.getCategoryByID(this.data.categoryID).subscribe(data => {
      this.color = data.color;
      this.categoryName = data.name;
    });
    this.pageChange(null);

    let cUrl = window.location.href;
    let itemId = this.data.categoryID;
    this.commonService.addLog(cUrl, itemId).subscribe(data => {});
  }

  pageChange($event) {
    this.loading = true;
    this.newsService.getNews(this.data).subscribe(data => {
      this.data = data;
      this.loading = false;
    });
  }
  searchCallback(data) {
    this.data.pageNumber = 1;
    this.data.filter = data;
    this.pageChange(null);
  }


  bypassUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
