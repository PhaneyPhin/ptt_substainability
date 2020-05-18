import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from 'src/app/service/news.service';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/service/common.service';

declare function initActivityImage(): any;
@Component({
  selector: 'app-activity-detail',
  templateUrl: './activity-detail.component.html',
  styleUrls: ['./activity-detail.component.css']
})
export class ActivityDetailComponent implements OnInit {

  private data = {
    id: 0,
    announceDate: new Date()
  };
  private newsID: any;
  private loading = false;
  private downloading = false;

  constructor(public location:Location,private route: ActivatedRoute
    , private commonService: CommonService
    , private newsService: NewsService) { }

  ngOnInit() {
    this.loading = true;
    this.newsID = this.route.snapshot.params['id'];

    let cUrl = window.location.href;
    let itemId = this.newsID;
    this.commonService.addLog(cUrl, itemId).subscribe(data => {});

    this.newsService.getNewsDetail(this.newsID).subscribe(d => {
      this.data = d;
      let self = this;
      setTimeout(function () {
        initActivityImage();
        self.loading = false;
      }, 100);
    });
  }

  downloadFile() {
    if (!this.downloading) {
      this.downloading = true;
      let self = this;
      this.newsService.downloadZipImages(this.newsID, function () {
        self.downloading = false;
      });
    }
  }

}
