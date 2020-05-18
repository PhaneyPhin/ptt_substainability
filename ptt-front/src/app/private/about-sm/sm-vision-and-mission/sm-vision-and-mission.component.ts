import { Component, OnInit } from '@angular/core';
import { AboutSMService } from 'src/app/service/about-sm.service';
import { ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-sm-vision-and-mission',
  templateUrl: './sm-vision-and-mission.component.html',
  styleUrls: ['./sm-vision-and-mission.component.css']
})
export class SmVisionAndMissionComponent implements OnInit {

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
