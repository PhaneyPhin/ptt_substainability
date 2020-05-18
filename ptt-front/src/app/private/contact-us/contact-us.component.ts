import { Component, OnInit } from '@angular/core';
import { ContactUsService } from 'src/app/service/contact-us.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  constructor(private contactUsService: ContactUsService) { }

  ngOnInit() {
    
  }

}
