import { Component, OnInit } from '@angular/core';
import { AboutSMService } from 'src/app/service/about-sm.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-overview-of-sm-management',
  templateUrl: './overview-of-sm-management.component.html',
  styleUrls: ['./overview-of-sm-management.component.css']
})
export class OverviewOfSmManagementComponent implements OnInit {

  private data = {};
  private loading = false;

  constructor(private aboutSMService: AboutSMService, private route: ActivatedRoute, private commonService: CommonService) {
    route.params.subscribe(val => {
      
      let id = this.route.snapshot.params['id'];
      this.loadData(id);

      let cUrl = window.location.href;
      let itemId = id;
      this.commonService.addLog(cUrl, itemId).subscribe(data => {});
    });
   }

  ngOnInit() {
    
  }

  loadData(id){
    this.loading = true;
    this.aboutSMService.getAboutSMList(id).subscribe(data => {
      this.data = data;
      this.loading = false;
    });
  }

}
