import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from 'src/app/service/dashboard.service';
import { DomSanitizer } from '@angular/platform-browser';
import { CommonService } from 'src/app/service/common.service';
import * as moment from 'moment';
declare var $;
declare function initActivityImage_dashboard1(): any;
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private data = {
    reports:[],
    categoryID:"",
    documentID:""
  };

  private name = "";

  private loading = false;

  constructor(private route: ActivatedRoute
    , private dashboardService: DashboardService
    , private commonService: CommonService
    , private sanitizer: DomSanitizer) {
    route.params.subscribe(val => {

      if (localStorage.getItem('current_category')) {
        var cate = JSON.parse(localStorage.getItem('current_category'));
        this.name = cate.categoryName;
      }
      this.data.categoryID = this.route.snapshot.params['id'];
      this.data.documentID = this.route.snapshot.params['s'];
      this.pageChange(null);

      let cUrl = window.location.href;
      let itemId = this.data.categoryID;
      this.commonService.addLog(cUrl, itemId).subscribe(data => {});
      // console.log(this.data);
    });
  }

  ngOnInit() {
    // this.name = this.route.snapshot.data.name;
    // this.data.categoryID = this.route.snapshot.params['id'];
    // this.data.documentID = this.route.snapshot.params['s'];
    // this.pageChange(null);

  }
  go_url(url){
    if(url.indexOf("http://")>-1||url.indexOf("https://")>-1){
      // window.location.href=url
      var win = window.open(url, '_blank');
      win.focus();
    }else{
      // window.location.href=;
      var win = window.open("http://"+url, '_blank');
      win.focus();
    }
    setTimeout(()=>{
      $(".fancybox-button--close").click();
    },500)
  }
  pageChange($event) {
    this.loading = true;
    this.dashboardService.getDashboard(this.data).subscribe(data => {
      this.data = data;
      this.data.reports=this.data.reports.map((item,index)=>{
        item.id=index;
        item.border_style="0.2rem solid red !important"
        item.start_date=moment(item.start_Date).format("DD/MM/YYYY");
        item.end_date=moment(item.end_Date).format("DD/MM/YYYY");
        item.due_date=moment(item.dueDate).format("DD/MM/YYYY")
        return item;
      });
      if(this.data.reports.length>0){
        var report=data.reports[0];
        setTimeout(()=>{
          $('.dashName').html(report.report_Name);
          $("#due_date").html(report.due_date);
          $("#start_date").html(report.start_date+' - ' +report.end_date);
          $("#report_description").html(report.description);
          if(report.tableau_URL!=null){
            $("#tableau_URL").html(`
            กรุณากด <a href="`+(report.tableau_URL.indexOf("http")>0||report.tableau_URL.indexOf("https")>0?report.tableau_URL:("http://"+report.tableau_URL)) +`" target="_blank" style="text-decoration: underline" >ที่นี่</a> และทำการระบุ Username/Password ของระบบ Tableau เพื่อดูรายละเอียด Dashboard
            `)
          }else{
            $("#tableau_URL").empty();
          }
        },1000)
      }
      console.log(this.data.reports);
      // this.data.reports=[
      //     {
      //       report_Name:"ทดสอบ",
      //       start_date:moment().format("DD/MM/YYYY"),
      //       end_date:moment().format("DD/MM/YYYY"),
      //       due_date:moment().format("DD/MM/YYYY"),
      //       description:"Lrem Sfd Lret The sdf dsfdf teadf dsfsadflskdfjt tekddlf te",
      //       path:"https://images.unsplash.com/photo-1499084732479-de2c02d45fcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
      //     },
      //     {
      //       report_Name:"ทดสอบ",
      //       start_date:moment().format("DD/MM/YYYY"),
      //       end_date:moment().format("DD/MM/YYYY"),
      //       due_date:moment().format("DD/MM/YYYY"),
      //       description:"Lrem Sfd Lret The sdf dsfdf teadf dsfsadflskdfjt tekddlf te",
      //       path:"https://images.unsplash.com/photo-1499084732479-de2c02d45fcc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80"
      //     }
      // ]
      console.log(data);
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
      var ctrl=this;
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
            var due_date = $(this).data('duedate');

            var report =ctrl.data.reports[index];
            $("#due_date").html(report.due_date);
            $("#start_date").html(report.start_date+' - ' +report.end_date);
            $("#report_description").html(report.description);
            if(report.tableau_URL!=null){
              $("#tableau_URL").html(`
              กรุณากด <a href="`+(report.tableau_URL.indexOf("http")>0||report.tableau_URL.indexOf("https")>0?report.tableau_URL:("http://"+report.tableau_URL)) +`" target="_blank" style="text-decoration: underline" >ที่นี่</a> และทำการระบุ Username/Password ของระบบ Tableau เพื่อดูรายละเอียด Dashboard
              `)
            }else{
              $("#tableau_URL").empty();
            }

            $('.dashName').empty();
            $('.dashDate').empty();
            $('.dashName').append(report.report_Name);
            $('.dashDate').append(due_date);

                }
            });
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
      $('#thumbs a').click(function() {
        $('#carousel').trigger('slideTo', '#' + this.href.split('#').pop() );
        $('#thumbs a').removeClass('selected');
        $(this).addClass('selected');
        var index=$(this).data("index");
        var thumbName = $(this).data('name');
        var due_date = $(this).data('duedate');

        var report =ctrl.data.reports[index];
        $("#due_date").html(report.due_date);
        $("#start_date").html(report.start_date+' - ' +report.end_date);
        $("#report_description").html(report.description);
        if(report.tableau_URL!=null){
          $("#tableau_URL").html(`
          กรุณากด <a href="`+(report.tableau_URL.indexOf("http")>0||report.tableau_URL.indexOf("https")>0?report.tableau_URL:("http://"+report.tableau_URL)) +`" target="_blank" style="text-decoration: underline" >ที่นี่</a> และทำการระบุ Username/Password ของระบบ Tableau เพื่อดูรายละเอียด Dashboard
          `)
        }else{
          $("#tableau_URL").empty();
        }

        $('.dashName').empty();
        $('.dashDate').empty();
        $('.dashName').append(report.report_Name);
        $('.dashDate').append(due_date);






      return false;
    });

      },500);

    });

  }

  downloadFile(item) {
    if (!item.downloading) {
      item.downloading = true;

      let cUrl = window.location.href;
      let itemId = item.id;
      this.commonService.addDownloadLog(cUrl, itemId).subscribe(data => {});

      this.dashboardService.downloadPolicyFile(item, function () {
        item.downloading = false;

      });
    }
  }

  searchCallback(data) {
    // this.data.pageNumber = 1;
    // this.data.filter = data;
    this.pageChange(null);
  }
  bypassUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}
