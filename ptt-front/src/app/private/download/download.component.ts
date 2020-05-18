import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { PlatformLocation } from '@angular/common';
import { filter, map } from 'rxjs/operators';
import { DownloadService } from 'src/app/service/download.service';
import { CommonService } from 'src/app/service/common.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FilterBoxComponent } from '../filter-box/filter-box.component';

declare var $: any;

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {

  private loading = false;
  safeSrc: SafeResourceUrl;

  private category = { id: null, name: '' };
  private currentCategory = null;
  private data = {
    categoryID: null,
    documentID: null,
    pageNumber: 1,
    filter: {},
    documents: []
  };
  private subdata = [];
  usageLayout = 'DISPLAY_1';
  haveSubCategory = false;
  private currentColorIndex = 1;
  private counter = -1;
  private nodata = '';
  dataCategory:any=null;
  constructor(public router: Router
    , private route: ActivatedRoute
    , private downloadService: DownloadService
    , private commonService: CommonService
    , private sanitizer: DomSanitizer
    , private location: PlatformLocation) {

    route.params.subscribe(val => {
      // reset 
      this.data = {
        categoryID: null,
        documentID: null,
        pageNumber: 1,
        filter: {},
        documents: []
      };
      
      let json = localStorage.getItem('current_category');

      let storageObj = JSON.parse(json);

      this.category.id = storageObj.categoryID;
      this.category.name = storageObj.categoryName;

      let cUrl = window.location.href;
      let itemId = this.category.id;
      this.commonService.addLog(cUrl, itemId).subscribe(data => {});

      // load category info
      this.commonService.getCategoryByID(this.category.id).subscribe(data => {
        //console.log(data);
        var c = {
          categoryID: data.id,
          categoryName: data.name,
          categoryType: data.categoryType
        };
        
        localStorage.setItem('current_category', JSON.stringify(c));

        this.currentCategory = data;
        console.log('data',data);
        this.category.name = this.currentCategory.name;

        this.data.categoryID = this.category.id;
        let docID = this.route.snapshot.params['s'];
        if (docID) {
          this.data.documentID = docID;
        } else {
          this.data.documentID = 0;
        }
        console.log(data);

        this.usageLayout = this.currentCategory.displayLayout;
        this.haveSubCategory = this.currentCategory.downloadSubCategorys != null && this.currentCategory.downloadSubCategorys.length > 0 ? true : false;
        
        // try to reset filter componenet
        FilterBoxComponent.yourString.next('refresh');

        if (this.haveSubCategory && this.usageLayout == 'DISPLAY_5') {
          this.pageChangeWithSubCategory(null);
        } else {
          this.pageChange(null);
        }

      });
    });
  }

  ngOnInit() {
    setTimeout(() => {
      var figure = $(".vdo").hover(hoverVideo, hideVideo);
      function hoverVideo(e) {
        let video = $('video', this).get(0);
        if (video) {
          video.play();
        }
      }
      function hideVideo(e) {
        let video = $('video', this).get(0);
        if (video) {
          video.pause();
          video.currentTime = 0;
        }
      }
    }, 500);
  }

  downloadFile(data) {
    let cUrl = window.location.href;
    let itemId = data.id;
    this.commonService.addDownloadLog(cUrl, itemId).subscribe(data => {});
    
    if (!data.loading) {
      data.loading = true;
      this.downloadService.downloadDocument(data, function () {
        data.loading = false;
      });
    }
  }

  verifyCoverImage(data, subCategoryName) {
    // verify cover image if not set will use default image
    data.forEach(item => {
      if (!item.thumbnail) {
        if (this.currentCategory.name == 'SM Magazine') {
          item.thumbnail = 'assets/cover_default/download-SM-Magazine.png';
        }
        else if (this.currentCategory.name == 'Poster') {
          item.thumbnail = 'assets/cover_default/download-Poster.png';
        }
        else if (this.currentCategory.name == 'Training') {
          item.thumbnail = 'assets/cover_default/download-Training.png';
        }
        else if (this.currentCategory.name == 'Report') {
          if (subCategoryName == 'Meeting Report') {
            item.thumbnail = 'assets/cover_default/download-meetingReport.png';
          }
          else if (subCategoryName == 'Perfomance Report') {
            item.thumbnail = 'assets/cover_default/download-PerfomanceReport.png';
          }
          else {
            item.thumbnail = 'assets/cover_default/download-meetingReport.png';
          }
        }
        else if (this.currentCategory.name == 'Guideline') {
          if (subCategoryName == 'Quality') {
            item.thumbnail = 'assets/cover_default/download-quality.png';
          }
          else if (subCategoryName == 'Safety') {
            item.thumbnail = 'assets/cover_default/safety.png';
          }
          else if (subCategoryName == 'Security') {
            item.thumbnail = 'assets/cover_default/download-Security.png';
          }
          else if (subCategoryName != null && (subCategoryName.indexOf('Health') != -1 || subCategoryName == 'Occupational Health')) {
            item.thumbnail = 'assets/cover_default/Occupational.png';
          }
          else if (subCategoryName == 'Environment') {
            item.thumbnail = 'assets/cover_default/Environment.png';
          }
          else if (subCategoryName != null && (subCategoryName.indexOf('Emergency') != -1 || subCategoryName == 'Emergency and Crisis Management and BCM')) {
            item.thumbnail = 'assets/cover_default/download-emergency.png';
          }
          else {
            item.thumbnail = 'assets/cover_default/download-quality.png';
          }
        }
        else if (this.currentCategory.name == 'Education') {
          item.thumbnail = 'assets/cover_default/Education.png';
        }
        else {
          item.thumbnail = 'assets/cover_default/4NewCate.png';
        }
      }
    });
  }

  pageChange($event) {

    this.loading = true;
    this.nodata = '';
    this.downloadService.getDocumentByCagetory(this.data).subscribe(d => {
      this.data = d;

      if (this.data && this.currentCategory.displayLayout == 'DISPLAY_4') {
        this.data.documents.map(d => {
          if (d.youtubeURL)
            d.parsedYoutubeURL = this.bypassUrl(d.youtubeURL);// protected duplicate by pass
        });

        setTimeout(function () {
          var nowPlaying = "none";
          $('.box-border-target').hover(function () {
            nowPlaying = $(this).find('iframe').attr('src');
            $(this).find('iframe').attr('src', nowPlaying + '?rel=0&showinfo=0&autoplay=1&mute=1');
          }, function () {
            $(this).find('iframe').attr('src', nowPlaying);
          });
        }, 300);

        this.loading = false;
      } else {
        if (this.data) {
          this.verifyCoverImage(this.data.documents, null);
        }
        this.loading = false;
      }
      
      if (this.data.documents === null || this.data.documents.length === 0){
        this.nodata = 'No data found.';
      }
    });

  }
  pageChangeWithSubCategory($event) {

    this.loading = true;
    this.downloadService.getDocumentWithSubCagetory(this.category.id, this.data.documentID).subscribe(d => {
      this.subdata = d;
      if (this.subdata && this.subdata.length > 0) {
        this.subdata.forEach(item => {
          this.verifyCoverImage(item.documents, item.subCategoryName);
        });
      }

      this.loading = false;
    });
  }

  searchCallback(data) {
    //console.log('searchCallback.....');
    if (this.haveSubCategory) {
      this.loading = true;
      this.downloadService.getDocumentWithSubCagetoryFilter({
        categoryID: this.currentCategory.id,
        documentID: 0,
        filter: {
          subCategoryIDs: data.categoryIDs,
          fromDate: data.fromDate,
          toDate: data.toDate
        }
      }).subscribe(d => {
        this.subdata = d;
        this.subdata.forEach(item => {
          this.verifyCoverImage(item.documents, item.subCategoryName);
        });
        this.loading = false;
      });
    } else {
      this.data.pageNumber = 1;
      this.data.filter = data;
      this.pageChange(null);
    }
  }

  bypassUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  getRowColor(): any {
    this.counter += 1;
    if (this.counter > 1) {
      this.counter = 0;
      if (this.currentColorIndex < 3) {
        this.currentColorIndex += 1;
      } else {
        this.currentColorIndex = 1;
      }

    }
    return 'box-ebill-' + this.currentColorIndex;
  }
}
