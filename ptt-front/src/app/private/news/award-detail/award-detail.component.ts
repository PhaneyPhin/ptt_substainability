import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from 'src/app/service/news.service';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/service/common.service';

declare var $: any;
declare function initAwardGallaryImage(): any;
@Component({
  selector: 'app-award-detail',
  templateUrl: './award-detail.component.html',
  styleUrls: ['./award-detail.component.css']
})
export class AwardDetailComponent implements OnInit {

  private data = {
    id: 0,
    announceDate: new Date(),
    images: []
  };
  private downloadUrl = "";
  private newsID: any;
  private loading = false;
  private downloading = false;
  private firstImage = null;

  constructor(public location:Location
    , private route: ActivatedRoute
    , private commonService: CommonService
    , private newsService: NewsService) { }

  ngOnInit() {
    this.loading = true;
    this.newsID = this.route.snapshot.params['id'];
    this.newsService.getNewsDetail(this.newsID).subscribe(d => {
      this.data = d;

      if (this.data.images && this.data.images.length > 0){
        this.firstImage = this.data.images[0];
      }

      let self = this;
      setTimeout(function () {
        initAwardGallaryImage();
        self.loading = false;
      }, 100);
    });
    this.downloadUrl = "";

    let cUrl = window.location.href;
    let itemId = this.newsID;
    this.commonService.addLog(cUrl, itemId).subscribe(data => {});
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
