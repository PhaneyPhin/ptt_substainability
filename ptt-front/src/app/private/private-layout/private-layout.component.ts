import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { CookieService } from 'src/app/service/cookie.service';
import { environment } from 'src/environments/environment';
import { filter } from 'rxjs/operators';
import { menu, contactMenu } from "./menus"
declare var $: any;

declare function initListMenu(): any;
declare function initMenu(): any;
declare function selctMenu(currentRoute): any;


@Component({
  selector: 'app-private-layout',
  templateUrl: './private-layout.component.html',
  styleUrls: ['./private-layout.component.css']
})

export class PrivateLayoutComponent implements OnInit {

  private maxItem = 7;
  private currentRoute = "";
  private categories = [];
  private offset = 0;
  private pageindex_item = 0;
  private selected = "";
  private info = {};
  private keyword = "";
  private menuVisible = false;
  private footerCls = "";
  private winAuth = false;

  menus = menu;
  num = 0;
  index_item = 0;
  last = 1;
  first = 1;
  viewSub = false;
  parent: any = null;
  menuItems;
  parseInt = parseInt


  // try to detect listening for popstate on the window object
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    //console.log('Back/Previous button pressed');
    let locate = '' + window.location;

    // try to force select left menu
    this.forceSelectLeftMenu(locate);
  }

  constructor(
    public router: Router
    , private route: ActivatedRoute
    , private cookieService: CookieService
    , private commonService: CommonService) {

    this.currentRoute = this.router.url;
    this.commonService.getCoverImage().subscribe((result:any)=>{
      console.log(result);
      localStorage.setItem('coverImage',JSON.stringify(result));
    })
    // here detect code when page is refresh
    this.router.events
      .pipe(filter((rs): rs is NavigationEnd => rs instanceof NavigationEnd))
      .subscribe(event => {
        if (event.id === 1 && event.url === event.urlAfterRedirects) {
          let locate = '' + window.location;
          // try to force select left menu
          //this.router.navigate(['home/highlight']);
          this.forceSelectLeftMenu(locate);
        }
        else {
          //console.log('route changed');
          let locate = '' + window.location;
          let selectedMenuId = 0;
          if (locate.indexOf('announcements-detail/') != -1) {
            return;
          } else if (locate.indexOf('awards-detail/') != -1) {
            return;
          } else if (locate.indexOf('activities-detail/') != -1) {
            return;
          }
          else {
            //this.forceSelectLeftMenu(locate);
          }
        }
      });

    localStorage.setItem('currentRoute', this.currentRoute);
    this.menuItems = JSON.parse(JSON.stringify(menu));
    this.num = this.menuItems.length;
    this.menuItems[0].active = true;
    this.update();
  }

  forceSelectLeftMenu(locate) {
    let no_redirect_flag = null;
    if (locate.indexOf('highlight') != -1) {

      this.menuItems = JSON.parse(JSON.stringify(menu));
      this.viewSub = false;
      this.index_item = 0;
      this.menuItems[0].active = true;
      this.parent = null;
      this.router.navigate(['home/highlight']);
      this.update();
    } else if (locate.indexOf('dashboard/dashboard/') != -1) {

      let meuDashboard = menu.filter(c => c.id === 'menu-8').map((d, i) => { return d; });
      // build submenu to attribute 'item'
      //let selectedMenuId = locate.substr(locate.indexOf('about/') + 6);
      let selectedMenuId = locate.split("/")[locate.split("/").length - 1];
      this.open(meuDashboard[0], selectedMenuId, null);
    }
    else if (locate.indexOf('about-sm') != -1) {
      let menuAbout = menu.filter(c => c.id === 'menu-2').map((d, i) => { return d; });
      // build submenu to attribute 'item'
      //let selectedMenuId = locate.substr(locate.indexOf('about/') + 6);
      let selectedMenuId = locate.split("/")[locate.split("/").length - 1];
      this.open(menuAbout[0], selectedMenuId, null);
    }
    else if (locate.indexOf('applications') != -1) {
      this.menuItems = JSON.parse(JSON.stringify(menu));
      this.viewSub = false;
      this.index_item = 0;

      this.menuItems.forEach(e => {
        if (e.id == 'menu-3') {
          e.active = true;
        }
        else {
          e.active = false;
        }
      });
      this.parent = null;
      this.router.navigate(['home/applications']);
      this.update();
    }
    else if (locate.indexOf('news') != -1) {

      let menuNews = menu.filter(c => c.id === 'menu-4').map((d, i) => { return d; });
      // build submenu to attribute 'item'
      let selectedMenuId = "";
      if (locate.indexOf('announcements/') != -1) {
        //selectedMenuId = locate.substr(locate.indexOf('announcements/') + 14);
        selectedMenuId = locate.split("/")[locate.split("/").length - 1];
      } else if (locate.indexOf('awards/') != -1) {

        selectedMenuId = locate.substr(locate.indexOf('awards/') + 7);
      } else if (locate.indexOf('activities/') != -1) {

        //selectedMenuId = locate.substr(locate.indexOf('activities/') + 11);
        selectedMenuId = locate.split("/")[locate.split("/").length - 1];
      } else if (locate.indexOf('announcements-detail/') != -1) {
        selectedMenuId = locate.split(";")[1].split("=")[1];
        no_redirect_flag = true;
        //return;
      } else if (locate.indexOf('awards-detail/') != -1) {
        selectedMenuId = locate.split(";")[1].split("=")[1];
        no_redirect_flag = true;
        //return;
      } else if (locate.indexOf('activities-detail/') != -1) {
        selectedMenuId = locate.split(";")[1].split("=")[1];
        no_redirect_flag = true;
        //return;
      }
      this.open(menuNews[0], selectedMenuId, no_redirect_flag);
    }
    else if (locate.indexOf('policy') != -1) {
      let menuPolicy = menu.filter(c => c.id === 'menu-5').map((d, i) => { return d; });
      //let selectedMenuId = locate.substr(locate.indexOf('policy/policy/') + 14);
      let selectedMenuId = locate.split("/")[locate.split("/").length - 1];

      this.open(menuPolicy[0], selectedMenuId, null);
    }
    else if (locate.indexOf('download') != -1) {
      let menuDownload = menu.filter(c => c.id === 'menu-6').map((d, i) => { return d; });
      //let selectedMenuId = locate.substr(locate.indexOf('category/') + 9);
      let selectedMenuId = locate.split("/")[locate.split("/").length - 1];
      selectedMenuId = selectedMenuId.split(";")[0];
      //selectedMenuId = selectedMenuId.substr(0, selectedMenuId.indexOf(';'));
      this.open(menuDownload[0], selectedMenuId, null);
    }
    else if (locate.indexOf('contact-us') != -1) {
      this.parent = menu.filter((item) => item.id == 'menu-7')[0];
      this.menuItems = contactMenu;
      this.num = this.menuItems.length;
      this.viewSub = true;
      // this.router.navigate(['/home/contact-us/contact-form']);
      console.log(locate)
      if (locate.indexOf('contact-form') != -1) {
        console.log("contact-form")
        this.menuItems[0].active = true;
        this.update();
      } else if (locate.indexOf('faq') != -1) {
        this.menuItems[1].active = true;
        console.log("faq")
        this.update();
        //selectedMenuId = locate.substr(locate.indexOf('faq/') + 4);
      }
      // this.open(menuContact[0], selectedMenuId, null);
    }
  }
  menuLength() {
    return this.viewSub ? Math.min(this.menuItems.length + 1, 7) : Math.min(this.menuItems.length, 7);
  }
  update() {
    this.num = this.menuItems.length;
    this.first = parseInt(this.menuItems[0].class);
    this.last = parseInt(this.menuItems[this.num - 1].class);

    console.log(this.index_item, this.first, this.last, this.num);
  }
  down() {

    if (this.last > 5 + this.index_item) {
      this.menuItems = this.menuItems.map(item => {
        item.class = parseInt(item.class) - 1 + "";
        return item;
      })
      this.update();
    }
  }
  up() {
    if ((this.first < this.index_item && this.viewSub) || (!this.viewSub && this.first <= this.index_item)) {

      this.menuItems = this.menuItems.map(item => {
        item.class = parseInt(item.class) + 1 + "";
        return item;
      })
      this.update();
    }
  }
  open(item, selectedMenuId, no_redirect_flag) {
    if (item.child) {
      console.log(item)
      this.openChild(item, selectedMenuId, no_redirect_flag);
    } else {
      this.changeroot(item);
    }
  }
  openChild(parent, selectedMenuId, no_redirect_flag) {

    this.parent = parent;
    this.viewSub = true;

    if (parent.getchild == 'contact') {
      this.menuItems = contactMenu;
      this.num = this.menuItems.length;
      this.menuItems[0].active = true;
      this.update();
      this.router.navigate(['/home/contact-us/contact-form']);

    } else {

      var sub = this.getSubMenu(parent.getchild);
      console.log(sub);
      this.num = sub.length;
      if (this.num >= 6) {
        this.index_item = 1;
      } else {
        this.index_item = Math.ceil((8 - sub.length) / 2.0)
      }

      this.menuItems = sub.map((item, index_item) => {
        var src = "";
        if (parent.getchild == "about-sm") {
          src = 'assets/images/about-' + (index_item + 1) + '.png';
        } else if (parent.getchild == 'news' || parent.getchild == 'policy-and-target') {
          src = 'assets/images/news-' + (index_item + 1) + '.png'
        } else if (parent.getchild == 'download') {
          src = 'assets/images/download-' + (index_item + 1) + '.png'
        }
        if (parent.getchild == 'download' || parent.getchild == 'about-sm' || parent.getchild == 'news' || parent.getchild == 'policy-and-target') {

          return {
            class: index_item + 1,
            dataRote: this.geturl(parent.getchild, item),
            id: "menu-" + (index_item + 1),
            // click:this.selectRoot("download"),
            src: src,
            text: item.name,
            child: false,
            getchild: "",
            active: false,
            download: true,
            icon: item.icon,
            iconImagePath: item.iconImagePath,
            item: item
          }

        } else {
          return {
            class: index_item + 1,
            dataRote: this.geturl(parent.getchild, item),
            id: "menu-" + (index_item + 1),
            // click:this.selectRoot("download"),
            src: src,
            text: item.name,
            child: false,
            getchild: "",
            download: false,
            active: false,
            icon: item.icon,
            iconImagePath: item.iconImagePath,
            item: item
          }
        }
      })

      // check with selectedMenuId to force select current menu to active
      if (selectedMenuId && this.menuItems) {
        this.menuItems.forEach(m => {
          if (m.item.id == selectedMenuId) {
            m.active = true;
            //console.log('selected menuItem', m);
          } else {
            m.active = false;
          }
        });

        let selectedSub = null;
        sub.forEach(s => {
          if (selectedMenuId == s.id) {
            selectedSub = s;
          }
        });

        this.update();
        this.goto(parent.getchild, selectedSub, no_redirect_flag);

      } else {

        if(this.menuItems.length>0){
          this.menuItems[0].active = true;
          this.update();
          this.goto(parent.getchild, sub[0], null);
        }
      }
      // this.changeroot(sub[0])
    }
  }
  back() {

    this.menuItems = JSON.parse(JSON.stringify(menu));
    this.num = this.menuItems.length;
    this.viewSub = false;
    this.index_item = 0;
    this.menuItems[0].active = true;
    this.router.navigate(['home/highlight'])
    this.parent = null;
    this.update();
  }
  toggle() {

    if (this.parent != null) {
      this.menuItems = JSON.parse(JSON.stringify(menu));
      this.num = this.menuItems.length;
      this.viewSub = false;
      this.index_item = 0;
      this.menuItems = this.menuItems.map((item) => {
        if (item.class == this.parent.class) {
          item.active = true;
        }
        return item;
      })
      this.parent = null;
    }
    console.log(this.menus);
    this.update();
    this.index_item = 0;
  }
  navigateMenu() {
    this.menuVisible = !this.menuVisible;
    if (this.menuVisible) {
      this.footerCls = "footermenuopen";
    }
    else {
      this.footerCls = "";
    }
  }
  changeroot(item) {

    item.active = true;
    this.menuItems.forEach((menu, index_item) => {
      if (JSON.stringify(item) == JSON.stringify(menu)) {
        this.menuItems[index_item].active = true;
      } else {
        this.menuItems[index_item].active = false;
      }
    })

    if (this.parent != null) {
      if (this.parent.getchild != 'contact') {
        this.goto(this.parent.getchild, item.item, null);
      } else {
        this.router.navigate(item.dataRote)
      }
    } else {
      this.router.navigate(item.dataRote)
    }
  }
  ngOnInit() {

    let data = this.cookieService.getCookie(environment.cookieToken);

    if (!data) {
      this.router.navigate(['/public/login']);
      return;
    }
    this.info = JSON.parse(data);

    this.commonService.getCategory().subscribe(data => {
      this.categories = data;
      //console.log(this.categories)
      localStorage.setItem('all_category', JSON.stringify(this.categories));

      this.categories.forEach(item => {
        item.route = this.commonService.getRouteName(item.id, item.name, item.categoryType);
      });

      // selctMenu(this.currentRoute);
      initListMenu();
      $('[data-toggle="tooltip"]').tooltip();
      let locate = '' + window.location;
      this.forceSelectLeftMenu(locate);
    });

    $('#navbarNav').on('show.bs.collapse', function () {
      $('.headbar-top').addClass('-collapse');
      $('.all-container').addClass('-collapse');
      $('.hamburgers-box .svg-inline--fa').addClass('fa-times');
    });

    $('#navbarNav').on('hidden.bs.collapse', function () {
      $('.headbar-top').removeClass('-collapse');
      $('.all-container').removeClass('-collapse');
      $('.hamburgers-box .svg-inline--fa').removeClass('fa-times');
      $('.hamburgers-box .svg-inline--fa').addClass('fa-bars');
    });

    // this for hide change password when user from window authentication
    if (localStorage.getItem('isWinAuth')) {
      this.winAuth = localStorage.getItem('isWinAuth') == 'yes' ? true : false;
    }
  }

  getSubMenu(categoryType) {
    if (this.categories.length > 0) {
      let sub = this.categories.filter(c => c.route.routeGroup === categoryType).map((d, i) => {
        d.idx = i + 1;
        return d;
      });
      // sub = sub.splice(this.pageindex_item, this.maxItem);

      return sub;
    }
    return [];
  }

  selectRoot(root) {
    if (this.selected != root) {
      let sub = this.categories.filter(c => c.categoryType.toLowerCase() === root);
      this.offset = sub.length - this.maxItem;
      this.pageindex_item = 0;
      this.selected = root;
    }
  }

  clearSelected() {
    this.offset = 0;
  }

  rangeChange(event) {
    this.pageindex_item = parseInt(event.target.value);
  }
  navigate(item, parent, data) {
    console.log("%c wr:", "color:red");
    console.log(item);
    let wr = item.dataRote[0];

    //console.log('item', wr);
    // workaround for force select contact-form
    if (item.id == 'menu-7' && wr.indexOf('/home/download') <= -1) {
      let menuContact = contactMenu;
      this.openChild(menuContact[0], 0, null);
    }
    else {
      this.menuItems.forEach((menu, index_item) => {
        if (JSON.stringify(item) == JSON.stringify(menu)) {
          this.menuItems[index_item].active = true;
        } else {
          this.menuItems[index_item].active = false;
        }
      })

      this.goto(parent, data, null)
    }
  }
  goto(parent, data, no_redirect_flag) {
    console.log(data)
    var c = {
      categoryID: data.id,
      categoryName: data.name,
      categoryType: data.categoryType
    };
    console.log(c);
    localStorage.setItem('current_category', JSON.stringify(c));

    let route = data.route.prefix + '/' + data.route.route + '/' + c.categoryID;

    if (data.route.routeGroup == 'about-sm') {
      route = data.route.prefix + '/about/' + c.categoryID;
      if (!no_redirect_flag) {
        this.router.navigate([route]);
      }

    }
    else if (data.route.routeGroup == 'policy-and-target') {
      route = data.route.prefix + '/policy/' + c.categoryID;
      if (!no_redirect_flag) {
        this.router.navigate([route]);
      }
    }
    else if (data.route.routeGroup == 'news' && data.displayLayout !== null) {

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

      if (!no_redirect_flag) {
        this.router.navigate([route]);
      }
    } else if (data.route.routeGroup == 'dashboard') {
      route = data.route.prefix + '/home/dashboard/dashboard/' + c.categoryID;
      if (!no_redirect_flag) {
        this.router.navigate([route]);
      }
    }
    else if (data.route.routeGroup == 'download' && data.displayLayout !== null) {
      route = data.route.prefix + '/' + data.route.route + '/' + c.categoryID;

      if (!no_redirect_flag) {
        this.router.navigate([route, { t: (new Date).getTime() }]);
      }
    }
    else {
      if (!no_redirect_flag) {
        this.router.navigate([route]);
      }
    }
  }
  geturl(parent, data) {

    var c = {
      categoryID: data.id,
      categoryName: data.name,
      categoryType: data.categoryType
    };
    localStorage.setItem('current_category', JSON.stringify(c));

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

      return [route];
    }
    else if (data.route.routeGroup == 'download' && data.displayLayout !== null) {
      route = data.route.prefix + '/' + data.route.route + '/' + c.categoryID;
      return [route, { t: (new Date).getTime() }];
    }
    else {
      return [route];
    }
  }

  logout() {
    localStorage.removeItem('currentRoute');
    this.cookieService.deleteCookie(environment.cookieToken);
    this.router.navigate(['/public']);
  }


  search() {
    this.router.navigate(['/home/search', { q: this.keyword }]);
    this.keyword = null;
  }

  eventHandler(keyCode) {
    if (keyCode === 13) {
      this.search();
    }
  }

  openSitemap() {
    this.router.navigate(['/home/sitemap']);
  }
}
