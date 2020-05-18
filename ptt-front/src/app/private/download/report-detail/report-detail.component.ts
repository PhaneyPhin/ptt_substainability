import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DownloadService } from 'src/app/service/download.service';
import { CommonService } from 'src/app/service/common.service';

@Component({
  selector: 'app-report-detail',
  templateUrl: './report-detail.component.html',
  styleUrls: ['./report-detail.component.css']
})
export class ReportDetailComponent implements OnInit {


  private loading = false;
  private currentCategory = null;
  private category = { id: null };
  private data = {
    subCategoryID: null,
    pageNumber: 1,
    pageSize: 9,
    subCategoryName: null,
    documents: null
  };

  constructor(public router: Router
    , private route: ActivatedRoute
    , private commonService: CommonService
    , private downloadService: DownloadService) { }

  ngOnInit() {
    this.data.subCategoryID = this.route.snapshot.params['id'];
    let json = localStorage.getItem('current_category');

    var d = JSON.parse(json);
    this.commonService.getCategoryByID(d.categoryID).subscribe(data => {
      this.currentCategory = data;
      this.pageChange(null);
    });
  }

  verifyCoverImage(data, subCategoryName) {
    // verify cover image if not set will use default image
    //console.log('currentCategory',this.currentCategory);
    data.forEach(item => {
      if (!item.thumbnail){
        if (this.currentCategory.name == 'SM Magazine'){
          item.thumbnail = 'assets/cover_default/download-SM-Magazine.png';
        }
        else if (this.currentCategory.name == 'Poster'){
          item.thumbnail = 'assets/cover_default/download-Poster.png';
        }
        else if (this.currentCategory.name == 'Training'){
          item.thumbnail = 'assets/cover_default/download-Training.png';
        }
        else if (this.currentCategory.name == 'Report'){
          if (subCategoryName == 'Meeting Report'){
            item.thumbnail = 'assets/cover_default/download-meetingReport.png';
          }
          else if (subCategoryName == 'Perfomance Report'){
            item.thumbnail = 'assets/cover_default/download-PerfomanceReport.png';
          }
          else {
            item.thumbnail = 'assets/cover_default/download-meetingReport.png';
          }
        }
        else if (this.currentCategory.name == 'Guideline'){
          if (subCategoryName == 'Quality'){
            item.thumbnail = 'assets/cover_default/download-quality.png';
          }
          else if (subCategoryName == 'Safety'){
            item.thumbnail = 'assets/cover_default/safety.png';
          }
          else if (subCategoryName == 'Security'){
            item.thumbnail = 'assets/cover_default/download-Security.png';
          }
          else if (subCategoryName.indexOf('Health') != -1 || subCategoryName == 'Occupational Health'){
            item.thumbnail = 'assets/cover_default/Occupational.png';
          }
          else if (subCategoryName == 'Environment'){
            item.thumbnail = 'assets/cover_default/Environment.png';
          }
          else if (subCategoryName.indexOf('Emergency') != -1 || subCategoryName == 'Emergency and Crisis Management and BCM'){
            item.thumbnail = 'assets/cover_default/download-emergency.png';
          }
          else {
            item.thumbnail = 'assets/cover_default/download-quality.png';
          }
        }
        else if (this.currentCategory.name == 'Education'){
          item.thumbnail = 'assets/cover_default/Education.png';
        }
        else {
          item.thumbnail = 'assets/cover_default/download-SM-Magazine.png';
        }
      }
    });
  }

  pageChange($event) {
    if (this.data.pageSize > 0) {
      this.loading = true;
      this.downloadService.getAllDocumentWithSubCategory(this.data).subscribe(d => {
        this.data = d;
        this.loading = false;
        this.verifyCoverImage(this.data.documents, this.data.subCategoryName);
      });
    }
  }

  downloadFile(data) {
    if (!data.loading) {
      data.loading = true;
      this.downloadService.downloadDocument(data, function () {
        data.loading = false;
      });
    }
  }

  searchCallback(data) {
    this.loading = true;
    this.downloadService.getAllDocumentWithSubCategoryFilter({
      subCategoryID: this.data.subCategoryID,
      documentID: 0,
      filter: {
        fromDate: data.fromDate,
        toDate: data.toDate
      }
    }).subscribe(d => {
      this.data = d;
      this.loading = false;
    });
  }

}
