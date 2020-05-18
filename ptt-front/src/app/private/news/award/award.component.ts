import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from 'src/app/service/news.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-award',
  templateUrl: './award.component.html',
  styleUrls: ['./award.component.css']
})
export class AwardComponent implements OnInit {

  private data = {
    categoryID: null,
    pageSize: 6,
    pageNumber: 1,
    total: 0,
    news: [],
    filter: {}
  };

  private loading = false;
  categoryName = 'Award and Achievement';
  private color = '#fcb712';
  coverImage:any=null;
  constructor(private route: ActivatedRoute
    , private newsService: NewsService
    , private commonService: CommonService
    , private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.coverImage=this.commonService.getImage(2);
    this.data.categoryID = this.route.snapshot.params['id'];
    this.commonService.getCategoryByID(this.data.categoryID).subscribe(data => {
      this.categoryName = data.name
      this.color = data.color;
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
