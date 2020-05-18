import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HomeService } from 'src/app/service/home.service';
import { CommonService } from 'src/app/service/common.service';

declare function selctMenu(currentRoute): any;
declare function initActivityImage_dashboard();
declare var $;
import * as moment from 'moment';
@Component({
  selector: 'app-highlight',
  templateUrl: './highlight.component.html',
  styleUrls: ['./highlight.component.css']
})
export class HighlightComponent implements OnInit {

  private data = {
    highlights: [],
    newUpdates: [],
    slideDelay:1000,
    reports:[]
  };
  reports:any;
  index=0;
  private loading = false;
  cireclecolor="red";
  constructor(private homeService: HomeService, private commonService:CommonService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
     var ctrl=this;
    this.clearInterval();
    this.loading = true;
    this.homeService.getHomeData().subscribe(data => {
      this.data = data;
      this.data.reports=data.reports.map((item)=>{
        item.due_date=moment(item.dueDate).format("DD/MM/YYYY");
        return item;
      });
      if(this.data.reports.length>0){
        var report=this.data.reports[0];

        setTimeout(()=>{

          $('.dashName').empty();
          $('.dashDate').empty();
          $('.dashName').append(`<a href="#/home/dashboard/dashboard/${report.category_ID}">${report.report_Name}</a>`);
          $('.dashDate').append(report.due_date);
          this.cireclecolor=report.color;
        },500)
      }
      this.loading = false;


      setTimeout(()=>{
        $('#Carousel').carousel({
          interval: 5000
      });

    $('#carousel').carouFredSel({
      responsive: true,
      circular: false,
      auto: false,
      items: {
        visible: 1,
        height: '40%'
      },
      scroll: {fx: 'crossfade'}
    });

    $('#thumbs').carouFredSel({
      responsive: true,
      circular: false,
      infinite: false,
      auto: false,
      prev: '#prev',
      next: '#next',
      items: {visible: {min:3},height: '50%'}
    });
   
    $("#carousel a").fancybox({
          afterShow:function(instance,slide){
            $(".fancybox-caption__body").css("visibility","hidden");
            $(".fancybox-button.fancybox-button--zoom").hide();
            $(".fancybox-button.fancybox-button--play").hide();
            $(".fancybox-button.fancybox-button--thumbs").hide();
          },
          afterClose: function(instance, slide) {
            console.log("closed");

            $('#carousel').trigger('slideTo', '#' + slide.opts.$orig[0].id);
            console.log(slide.opts.$orig[0].id);
            var index=parseInt(slide.opts.$orig[0].id);
            var report=ctrl.data.reports[index];


            $('.dashName').empty();
            $('.dashDate').empty();
            $('.dashName').append(`<a href="#/home/dashboard/dashboard/${report.category_ID}">${report.report_Name}</a>`);
            $('.dashDate').append(report.due_date);
            ctrl.cireclecolor=report.color;
          }
        });
    $('#thumbs a').click(function() {
      $('#carousel').trigger('slideTo', '#' + this.href.split('#').pop() );
      $('#thumbs a').removeClass('selected');
      $(this).addClass('selected');
      var index = parseInt($(this).data('index'));
      var report=ctrl.data.reports[index];


      $('.dashName').empty();
      $('.dashDate').empty();
      $('.dashName').append(`<a href="#/home/dashboard/dashboard/${report.category_ID}">${report.report_Name}</a>`);
      $('.dashDate').append(report.due_date);
      ctrl.cireclecolor=report.color;






      return false;
    });

      },500);
      setTimeout(()=>{
        if(ctrl.data.reports.length==1){
          // $('#thumbs-wrapper .caroufredsel_wrapper').width($('#thumbs-wrapper .caroufredsel_wrapper #thumbs a').width()/3);
          $('#thumbs-wrapper .caroufredsel_wrapper').height($('#thumbs-wrapper .caroufredsel_wrapper #thumbs a').height()/3+50);
          $('#thumbs-wrapper .caroufredsel_wrapper #thumbs a').width($('#thumbs-wrapper .caroufredsel_wrapper #thumbs a').width()/3-10);
          $('#thumbs-wrapper .caroufredsel_wrapper #thumbs a').height($('#thumbs-wrapper .caroufredsel_wrapper #thumbs a').height()/3-10);

        }else if(ctrl.data.reports.length==2){
          // $('#thumbs-wrapper .caroufredsel_wrapper').width($('#thumbs-wrapper .caroufredsel_wrapper #thumbs a').width()*2/3);
          $('#thumbs-wrapper .caroufredsel_wrapper').height($('#thumbs-wrapper .caroufredsel_wrapper #thumbs a').height()*2/3+100);
          $('#thumbs-wrapper .caroufredsel_wrapper #thumbs a').width($('#thumbs-wrapper .caroufredsel_wrapper #thumbs a').width()*2/3-10);
          $('#thumbs-wrapper .caroufredsel_wrapper #thumbs a').height($('#thumbs-wrapper .caroufredsel_wrapper #thumbs a').height()*2/3-10);
        }
      },500);

      setInterval(()=>{
        this.index=(this.index+1)%(this.data.reports.length);
        $(".report"+this.index).click();

      },this.data.slideDelay*1000);
    });

    let cUrl = window.location.href;
    let itemId = 0;
    this.commonService.addLog(cUrl, itemId).subscribe(data => {});

  }
  clearInterval(){
   var id = window.setInterval(() => {}, 0);
    console.log(id);
    while (id) {
      window.clearInterval(id);
      id--;
    }
  }
  getData(categoryName) {
    return this.data.highlights.filter(d => d.categoryName === categoryName);
  }
  goto(item){
    // console.log(item);
    window.location.href="#/home/dashboard/dashboard/"+item.category_ID
  }
  go(data){

    var r = this.commonService.getRouteName(data.categoryID, data.categoryName, data.categoryType);
    console.log(r);
    var c = {
      categoryID: data.categoryID,
      categoryName: data.categoryName,
      categoryType: data.categoryType
    };
   localStorage.setItem('current_category', JSON.stringify(c));
        localStorage.setItem('current_data', JSON.stringify(data));
    let url = "";
    if (r.routeGroup == "news"){
      url = `#/${r.prefix}/${r.route}-detail/${data.id};cate_id=${c.categoryID}`
      //this.router.navigate([`${r.prefix}/${r.route}-detail/${data.id}`]);
      //selctMenu(r.prefix);
    }
    else if (r.routeGroup == "applications") {
      url = `#/${r.route}`
      //this.router.navigate([`${r.route}`]);
      //selctMenu(r.prefix);
    }
    else if (r.routeGroup == "download"){
      url = `#/${r.prefix}/${r.route}/${r.id};t=${new Date().getTime()}`;
      //this.router.navigate([`${r.prefix}/${r.route}/${r.id};t=${new Date().getTime()}`]);
      //selctMenu(r.prefix);
    }
    else if (r.routeGroup == "policy-and-target"){
      url = `#/${r.prefix}/${r.route}/${r.id}`;
      //this.router.navigate([`${r.prefix}/${r.route}/${r.id}`]);
      //selctMenu(r.prefix);
    }
    else if (r.routeGroup == "about-sm"){
      url = `#/${r.prefix}/${r.route}/${r.id}`;
      //this.router.navigate([`${r.prefix}/${r.route}/${r.id}`]);
      //selctMenu(r.prefix);
    }
    window.location.href = url;
  }

  searchCallback(data) {
    this.loading = true;
    this.homeService.getHomeContentByFilter(data).subscribe(data => {
      this.data = data;
      this.loading = false;
    });
  }
}
  /*go(data) {

    let fwdRoute = "";
    let prefix = "";

    switch (data.categoryName) {

      // About SM
      case "Overview of SM Management":
        prefix = "/home/about-sm/";
        fwdRoute = "/home/about-sm/overview-of-sm-management/" + data.categoryID;
        break;

      case "SM Vision and Mission":
        prefix = "/home/about-sm/";
        fwdRoute = "/home/about-sm/sm-vision-and-mission/" + data.categoryID;
        break;

      case "SM Governance Mechanism":
        prefix = "/home/about-sm/";
        fwdRoute = "/home/about-sm/sm-governance-mechanism/" + data.categoryID;
        break;

      case "SM Function":
        prefix = "/home/about-sm/";
        fwdRoute = "/home/about-sm/sm-function/" + data.categoryID;
        break;

      // Application
      case "ME (Personal)":
        prefix = "/home/application";
        fwdRoute = "/home/application";
        break;

      case "WE (Function)":
        prefix = "/home/application";
        fwdRoute = "/home/application";
        break;

      // News
      case "Announcement":
        prefix = "/home/news/";
        fwdRoute = "/home/news/announcement-detail/" + data.id;
        break;

      case "Award and Achievement":
        prefix = "/home/news/";
        fwdRoute = "/home/news/award-and-achievement-detail/" + data.id;
        break;

      case "Activities and Gallery":
        prefix = "/home/news/";
        fwdRoute = "/home/news/activities-and-gallery-detail/" + data.id;
        break;

      // Policy And Target
      case "Policy":
        prefix = "/home/policy-and-target/";
        fwdRoute = "/home/policy-and-target/policy/" + data.categoryID;
        break;

      case "Target":
        prefix = "/home/policy-and-target/";
        fwdRoute = "/home/policy-and-target/target/" + data.categoryID;
        break;

      // Download
      case "SM Magazine":
        prefix = "/home/download/";
        fwdRoute = "/home/download/sm-magazine/" + data.categoryID;
        break;

      case "Poster":
        prefix = "/home/download/";
        fwdRoute = "/home/download/poster/" + data.categoryID;
        break;

      case "Training":
        prefix = "/home/download/";
        fwdRoute = "/home/download/training/" + data.categoryID;
        break;

      case "Report":
      case "Guideline":
        prefix = "/home/download/";
        fwdRoute = "/home/download/report-detail/" + data.id;
        break;

      case "Education":
        prefix = "/home/download/";
        fwdRoute = "/home/download/education/" + data.categoryID;
        break;

      case "VDO":
        prefix = "/home/download/";
        fwdRoute = "/home/download/vdo/" + data.categoryID;
        break;

      case "E-Billing":
        prefix = "/home/download/";
        fwdRoute = "/home/download/e-billing/" + data.categoryID;
        break;
    }

    if (data.categoryType == 'Applications'){
      prefix = "/home/application";
      fwdRoute = "/home/application";
    }

    this.router.navigate([fwdRoute]);
    selctMenu(prefix);
  }
*/

