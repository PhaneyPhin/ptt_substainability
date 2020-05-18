import { Component, OnInit, Input } from '@angular/core';
import { ApplicationService } from 'src/app/service/application.service';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'not-ptt-app',
  templateUrl: './not-ptt-app.component.html',
  styleUrls: ['./not-ptt-app.component.css']
})
export class NotPttAppComponent implements OnInit {

  @Input()
  private data = [];
  private category = {
    icon: 'fa fa-list',
    color: '#3db049'
  };

  constructor(private applicationService: ApplicationService, private commonService: CommonService) { }

  ngOnInit() {
    if (this.data.length > 0 && this.data[0].categoryID){
      this.commonService.getCategoryByID(this.data[0].categoryID).subscribe(data => {
        if (data.icon)
          this.category.icon = data.icon;
        if (data.color)
          this.category.color = data.color;
      });

      let cUrl = window.location.href;
      let itemId = 0;
      this.commonService.addLog(cUrl, itemId).subscribe(data => {});
    }
  }

  goToLink(url: string, applicationId: any){
    this.commonService.addLog(url, applicationId).subscribe(data => {});
    
    this.applicationService.addApplicationCounter(applicationId).subscribe(d => {
      
    });
    window.open(url, "_blank");
  }
}
