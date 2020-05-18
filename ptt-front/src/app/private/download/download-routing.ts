import { Routes, RouterModule } from '@angular/router';
import { ReportDetailComponent } from './report-detail/report-detail.component';
import { DownloadComponent } from './download.component';

export const downloadRoutes: Routes = [
  /*{
    path: 'sm-magazine/:id',
    component: SmMagazineComponent
  },
  {
    path: 'poster/:id',
    component: PosterComponent
  },
  {
    path: 'training/:id',
    component: TrainingComponent
  },
  {
    path: 'report/:id',
    component: ReportComponent
  }, {
    path: 'report-detail/:id',
    component: ReportDetailComponent
  },
  {
    path: 'guideline/:id',
    component: GuidelineComponent
  },
  {
    path: 'education/:id',
    component: EducationComponent
  },
  {
    path: 'vdo/:id',
    component: VdoComponent
  },
  {
    path: 'e-billing/:id',
    component: EBillingComponent
  },*/
  {
    path: 'category/:id',
    component: DownloadComponent
  },
  {
    path: 'detail/:id',
    component: ReportDetailComponent
  }
];

