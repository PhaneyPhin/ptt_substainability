import { Component, OnInit } from '@angular/core';
import { AboutSMService } from 'src/app/service/about-sm.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-sm-function',
  templateUrl: './sm-function.component.html',
  styleUrls: ['./sm-function.component.css']
})
export class SmFunctionComponent implements OnInit {

  private data = [];
  private loading = false;

  constructor(private aboutSMService: AboutSMService, private route: ActivatedRoute, private commonService: CommonService) { }

  ngOnInit() {
    let id = this.route.snapshot.params['id'];
    this.loading = true;
    this.aboutSMService.getAboutSMList(id).subscribe(data => {
      this.data = data;
      this.loading = false;
    });

    let cUrl = window.location.href;
    let itemId = id;
    this.commonService.addLog(cUrl, itemId).subscribe(data => {});
  }


}
