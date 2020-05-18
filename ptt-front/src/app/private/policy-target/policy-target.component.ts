import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PolicyTargetService } from 'src/app/service/policy-target.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-policy-target',
  templateUrl: './policy-target.component.html',
  styleUrls: ['./policy-target.component.css']
})
export class PolicyTargetComponent implements OnInit {

  private data = {
    categoryID: null,
    documentID: null,
    pageSize: 6,
    pageNumber: 1,
    total: 0,
    policys: [],
    filter: {}
  };

  private name = "";

  private loading = false;

  constructor(private route: ActivatedRoute
    , private policyTargetService: PolicyTargetService
    , private commonService: CommonService
    , private sanitizer: DomSanitizer) { 
    route.params.subscribe(val => {
      
      if (localStorage.getItem('current_category')) {
        var cate = JSON.parse(localStorage.getItem('current_category'));
        this.name = cate.categoryName;
      }
      this.data.categoryID = this.route.snapshot.params['id'];
      this.data.documentID = this.route.snapshot.params['s'];
      this.pageChange(null);

      let cUrl = window.location.href;
      let itemId = this.data.categoryID;
      this.commonService.addLog(cUrl, itemId).subscribe(data => {});
    });
  }

  ngOnInit() {
    // this.name = this.route.snapshot.data.name;
    // this.data.categoryID = this.route.snapshot.params['id'];
    // this.data.documentID = this.route.snapshot.params['s'];
    // this.pageChange(null);
  }

  pageChange($event) {
    this.loading = true;
    this.policyTargetService.getPolicy(this.data).subscribe(data => {
      this.data = data;
      this.loading = false;
    });
  }

  downloadFile(item) {
    if (!item.downloading) {
      item.downloading = true;
      
      let cUrl = window.location.href;
      let itemId = item.id;
      this.commonService.addDownloadLog(cUrl, itemId).subscribe(data => {});
      
      this.policyTargetService.downloadPolicyFile(item, function () {
        item.downloading = false;
      });
    }
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
