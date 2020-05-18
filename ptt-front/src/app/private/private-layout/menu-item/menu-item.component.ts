import { Component, OnInit, Input, NgModule } from '@angular/core';
import { Router } from '@angular/router';

@NgModule({

})

@Component({
  selector: 'sub-menu-item',
  templateUrl: './menu-item.component.html',
  styleUrls: ['./menu-item.component.css']
})
export class MenuItemComponent implements OnInit {


  @Input()
  public items;

  @Input()
  public parent;

  constructor(
    private router: Router) { }

  ngOnInit() {

  }

}
