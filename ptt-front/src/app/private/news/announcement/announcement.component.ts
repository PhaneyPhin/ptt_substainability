import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NewsService } from 'src/app/service/news.service';
import * as moment from 'moment';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-announcement',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent implements OnInit {

  private data = {
    categoryID: null,
    pageSize: 6,
    pageNumber: 1,
    total: 0,
    news: [],
    filter: {}
  };
  categoryName = 'Announcement';
  private color = '#007dbd';

  private loading = false;
  coverImage:any=null;
  constructor(private route: ActivatedRoute
    , private newsService: NewsService
    , private commonService: CommonService
    , private router: Router, private sanitizer: DomSanitizer) {
    route.params.subscribe(val => {
      
      this.data.categoryID = this.route.snapshot.params['id'];
      this.commonService.getCategoryByID(this.data.categoryID).subscribe(data => {
        this.categoryName = data.name
        this.color = data.color;
      });
      this.pageChange(null);
      this.coverImage=this.commonService.getImage(1);
      console.log("coverImage",this.coverImage)
      let cUrl = window.location.href;
      let itemId = this.data.categoryID;
      this.commonService.addLog(cUrl, itemId).subscribe(data => {});
    });
  }


  ngOnInit() {
    
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
