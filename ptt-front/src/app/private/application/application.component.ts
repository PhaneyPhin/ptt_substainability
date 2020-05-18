import { Component, OnInit } from '@angular/core';
import { ApplicationService } from 'src/app/service/application.service';


@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css']
})
export class ApplicationComponent implements OnInit {

  private data: {};
  private loading = false;
  private isLogin = true;

  constructor(private applicationService: ApplicationService) { }

  ngOnInit() {

    this.loading = true;
    this.applicationService.getApplications().subscribe(data => {
      this.data = data;
      this.loading = false;
    });

  }

  searchCallback(data) {
    this.loading = true;
    this.applicationService.getApplicationFilter(data).subscribe(data => {
      this.data = data;
      this.loading = false;
    });
  }

}
