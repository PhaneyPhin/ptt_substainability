import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from 'src/app/service/common.service';

declare function selctMenu(currentRoute): any;

@Component({
  selector: 'highlight-item',
  templateUrl: './highlight-item.component.html',
  styleUrls: ['./highlight-item.component.css']
})
export class HighlightItemComponent implements OnInit {

  @Input()
  data = {
    categoryID: 0
  };

  @Input()
  name: "";

  @Input()
  route: ""

  private color = [
    "blue",
    "orange",
    "green"
  ];

  constructor(private router: Router, private sanitizer: DomSanitizer, private commonService: CommonService) { }

  private announcementCategoryID = [];
  private awardCategoryID = 0;
  private activityCategoryID = 0;
  ngOnInit() {

    let allcateJson = localStorage.getItem('all_category');
    if (allcateJson) {
      let allCates = JSON.parse(allcateJson);
      // set route
      allCates.forEach(item => {
        if (item.displayLayout == 'LAYOUT_ANNOUNCEMENT'){
          this.announcementCategoryID.push(item.id);
        }else if (item.displayLayout == 'LAYOUT_AWARD'){
          this.awardCategoryID = item.id;
        }else if (item.displayLayout == 'LAYOUT_ACTIVITY'){
          this.activityCategoryID = item.id;
        }
      });
    }
  }
  
  getImage(base64Image) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64Image);
  }

  checkIsCategoryAnnouncement(categoryId){
    let check = false;
    this.announcementCategoryID.forEach(o=>{
      if (o === categoryId)
      check = true;
    });
    return check;
  }

  goListView(data) {
    
    var r = this.commonService.getRouteName(data.categoryID, data.categoryName, data.categoryType);
    var c = {
      categoryID: data.categoryID,
      categoryName: data.categoryName,
      categoryType: data.categoryType
    };
   localStorage.setItem('current_category', JSON.stringify(c));
        localStorage.setItem('current_data', JSON.stringify(data));
    this.router.navigate([`${r.prefix}/${r.route}/${c.categoryID}`]);
    selctMenu(r.prefix);
  }

  goDetailView(data, item) {
    
    var r = this.commonService.getRouteName(data.categoryID, data.categoryName, data.categoryType);
    var c = {
      categoryID: data.categoryID,
      categoryName: data.categoryName,
      categoryType: data.categoryType
    };
   localStorage.setItem('current_category', JSON.stringify(c));
        localStorage.setItem('current_data', JSON.stringify(data));
    //this.router.navigate([`${r.prefix}/${r.route}-detail/${item.id}`]);
    window.location.href = `#/${r.prefix}/${r.route}-detail/${item.id};cate_id=${c.categoryID}`;
    selctMenu(r.prefix);

  }
}
