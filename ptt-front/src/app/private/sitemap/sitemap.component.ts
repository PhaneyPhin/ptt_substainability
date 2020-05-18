import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  styleUrls: ['./sitemap.component.css']
})
export class SitemapComponent implements OnInit {

  private categories = null;
  private sitemaps = [];

  constructor(private router: Router
    , private commonService: CommonService) { }

  ngOnInit() {
    let allcateJson = localStorage.getItem('all_category');
    
    if (allcateJson) {
      this.categories = JSON.parse(allcateJson);
      this.buildSitemap();
    }
    else {
      this.commonService.getCategory().subscribe(data => {
        this.categories = data;
        this.buildSitemap();
      });
    }
  }

  buildSitemap(){
    // home
    this.sitemaps.push({
      name: 'Home',
      fixRoute: '/home/highlight',
      route: null
    })
    // about sm
    let mAbouts = this.getCategory("about-sm");
    let firstAbout = mAbouts && mAbouts.length > 0 ? mAbouts[0] : null;
    this.sitemaps.push({
      name: 'About SM',
      fixRoute: null,
      id: firstAbout.id,
      categoryType: "about-sm",
      route: firstAbout.route
    })
    this.sitemaps = this.sitemaps.concat(mAbouts);
    
    // applications
    this.sitemaps.push({
      name: 'Applications',
      fixRoute: '/home/applications',
      route: null
    })

    // news
    let mNews = this.getCategory("news");
    let firstNews = mNews && mNews.length > 0 ? mNews[0] : null;
    this.sitemaps.push({
      name: 'News',
      fixRoute: null,
      id: firstNews ? firstNews.id : 0,
      categoryType: "news",
      route: firstNews ? firstNews.route : null
    })
    this.sitemaps = this.sitemaps.concat(mNews);

    // Policy and Target
    let mPolicies = this.getCategory("policy-and-target");
    let firstPolicy = mPolicies && mPolicies.length > 0 ? mPolicies[0] : null;
    this.sitemaps.push({
      name: 'Policy and Target',
      fixRoute: null,
      id: firstPolicy ? firstPolicy.id : 0,
      categoryType: "policy-and-target",
      route: firstPolicy ? firstPolicy.route : null
    })
    this.sitemaps = this.sitemaps.concat(mPolicies);

    // download
    let mDownloads = this.getCategory("download");
    let firstDownload = mDownloads && mDownloads.length > 0 ? mDownloads[0] : null;
    this.sitemaps.push({
      name: 'Download',
      fixRoute: null,
      id: firstDownload ? firstDownload.id : 0,
      categoryType: "download",
      route: firstDownload ? firstDownload.route : null
    })
    this.sitemaps = this.sitemaps.concat(mDownloads);

    // contact us
    this.sitemaps.push({
      name: 'Contact Us',
      fixRoute: '/home/contact-us/contact-form',
      route: null
    })
    this.sitemaps.push({
      name: 'Contact Form',
      fixRoute: '/home/contact-us/contact-form',
      route: null
    })
    this.sitemaps.push({
      name: 'FAQs',
      fixRoute: '/home/contact-us/faq',
      route: null
    })

  }

  getCategory(type){
    var cates = [];
    if (this.categories){
      this.categories.forEach(item => {
        if (type == item.categoryType.toLowerCase()) {
          cates.push({
            id: item.id,
            name: item.name,
            route: this.commonService.getRouteName(item.id, item.name, item.categoryType)
          });
        }
      });
    }
    return cates;
  }

  goto(data) {
    
    // fixed route
    if (data.fixRoute) {
      //console.log(' fixed route', data);
      this.router.navigate([data.fixRoute]);
    }
    else if (data.route) {
      //console.log(' route', data.route);
      var c = {
        categoryID: data.id,
        categoryName: data.name,
        categoryType: data.categoryType
      };
     localStorage.setItem('current_category', JSON.stringify(c));
        localStorage.setItem('current_data', JSON.stringify(data));

      let route = data.route.prefix + '/' + data.route.route + '/' + c.categoryID;

      if (data.route.routeGroup == 'news' && data.displayLayout !== null) {
        if (data.displayLayout == 'LAYOUT_ANNOUNCEMENT') {
          route = data.route.prefix + '/announcements/' + c.categoryID;
        }
        else if (data.displayLayout == 'LAYOUT_AWARD') {
          route = data.route.prefix + '/awards/' + c.categoryID;
        }
        else if (data.displayLayout == 'LAYOUT_ACTIVITY') {
          route = data.route.prefix + '/activities/' + c.categoryID;
        }
        else {
          // default layout for news
          route = data.route.prefix + '/announcements/' + c.categoryID;
        }

        this.router.navigate([route]);
      }
      else if (data.route.routeGroup == 'download' && data.displayLayout !== null) {
        route = data.route.prefix + '/' + data.route.route + '/' + c.categoryID;
        this.router.navigate([route, { t: (new Date).getTime() }]);
      }
      else {
        this.router.navigate([route]);
      }
    }
  }
}
