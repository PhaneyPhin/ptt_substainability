import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PublicService } from '../service/public.service';

@Component({
  selector: 'app-activate-user',
  templateUrl: './activate-user.component.html',
  styleUrls: ['./activate-user.component.css']
})
export class ActivateUserComponent implements OnInit {


  private data = {
    code: ""
  }
  private checking = true;
  private success = false;
  private error = "";

  constructor(private route: ActivatedRoute, private publicService: PublicService) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      this.data.code = params['v'];

      this.publicService.activate(this.data).subscribe(data => {
        this.checking = false;
        this.success = true;
      }, error => {
        this.checking = false;
        this.success = false;
        this.error = error;
      })

    });

  }

}
