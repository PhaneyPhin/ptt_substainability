import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonService } from 'src/app/service/common.service';
declare function selctMenu(currentRoute): any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {

  private loading = false;
  private data = {
    searchText: null,
    pageSize: 10,
    pageNumber: 1
  }
  private categories = [];
  private subscribe: Subscription;

  constructor(private route: ActivatedRoute, private router: Router, private commonService: CommonService) {

    route.params.subscribe(val => {

      let allcateJson = localStorage.getItem('all_category');
      if (allcateJson) {
        this.categories = JSON.parse(allcateJson);
        // set route
        this.categories.forEach(item => {
          item.route = this.commonService.getRouteName(item.id, item.name, item.categoryType);
        });
        this.search();
      } else {
        this.commonService.getCategory().subscribe(data => {
          this.categories = data;
          // set route
          this.categories.forEach(item => {
            item.route = this.commonService.getRouteName(item.id, item.name, item.categoryType);
          });
          this.search();
        });
      }
    });
    //...
  }

  ngOnInit() {

  }

  search() {
    this.loading = true;
    this.data.searchText = this.route.snapshot.params['q'];
    this.commonService.searchAllContent(this.data).subscribe(data => {
      this.data = data;
      this.loading = false;
    });
  }

  pageChange(event) {
    this.search();
  }

  go(data) {
    
    let fwdRoute = "";
    let prefix = "";

    // find selected current category
    var selectedCategory = null;
    this.categories.forEach(c => {
      if (c.id == data.categoryID)
        selectedCategory = c;
    });
    //console.log(selectedCategory);
    var c = {
      categoryID: selectedCategory.id,
      categoryName: selectedCategory.name,
      categoryType: selectedCategory.categoryType 
    };
   localStorage.setItem('current_category', JSON.stringify(c));
        localStorage.setItem('current_data', JSON.stringify(data));

    if (selectedCategory.route.routeGroup == 'news') {
      prefix = selectedCategory.route.prefix;
      fwdRoute = `${selectedCategory.route.prefix}/${selectedCategory.route.route}-detail/${data.id}`;
    }
    else if (selectedCategory.route.routeGroup == 'applications') {
      // Application
      prefix = selectedCategory.route.prefix;
      fwdRoute = selectedCategory.route.prefix;
      // force open application url with new tab
      window.open(data.applicationURL, "_blank");
      return;
    }
    else if (selectedCategory.route.routeGroup == 'policy-and-target') {
      prefix = selectedCategory.route.prefix;
      fwdRoute = `${selectedCategory.route.prefix}/${selectedCategory.route.route}/${c.categoryID}`;
    }
    else if (selectedCategory.route.routeGroup == 'download') {
      prefix = selectedCategory.route.prefix;
      fwdRoute = `${selectedCategory.route.prefix}/${selectedCategory.route.route}/${c.categoryID}`;
    }

    if (fwdRoute.indexOf('-detail') < 0) {
      this.router.navigate([fwdRoute, { s: data.id }]);
    } else {
      this.router.navigate([fwdRoute]);
    }

    selctMenu(prefix);

  }

  ngOnDestroy() {
    //this.subscribe.unsubscribe();
  }

}
