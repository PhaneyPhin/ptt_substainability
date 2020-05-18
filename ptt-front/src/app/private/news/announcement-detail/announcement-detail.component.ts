import { Component, OnInit } from '@angular/core';
import { NewsService } from 'src/app/service/news.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/service/common.service';

declare function initAnnouncementGallaryImage(): any;
@Component({
  selector: 'app-announcement-detail',
  templateUrl: './announcement-detail.component.html',
  styleUrls: ['./announcement-detail.component.css']
})
export class AnnouncementDetailComponent implements OnInit {

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

  constructor(private location:Location
    , private router:Router
    , private route: ActivatedRoute
    , private newsService: NewsService
    , private commonService: CommonService) { }

  ngOnInit() {
    this.loading = true;
    this.newsID = this.route.snapshot.params['id'];
    this.newsService.getNewsDetail(this.newsID).subscribe(d => {
      this.data = d;
      let self = this;

      if (this.data.images && this.data.images.length > 0){
        this.firstImage = this.data.images[0];
      }

      setTimeout(function () {
        initAnnouncementGallaryImage();
        self.loading = false;
      }, 100);
    });
    this.downloadUrl = "";

    let cUrl = window.location.href;
    let itemId = this.newsID;
    this.commonService.addLog(cUrl, itemId).subscribe(data => {});
  }
  back(){

      this.location.back();

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
