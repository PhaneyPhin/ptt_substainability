import { Routes, RouterModule } from '@angular/router';
import { AnnouncementComponent } from './announcement/announcement.component';
import { AnnouncementDetailComponent } from './announcement-detail/announcement-detail.component';
import { ActivityComponent } from './activity/activity.component';
import { ActivityDetailComponent } from './activity-detail/activity-detail.component';
import { AwardComponent } from './award/award.component';
import { AwardDetailComponent } from './award-detail/award-detail.component';

export const newsRoutes: Routes = [
  {
    path: 'announcements/:id',
    component: AnnouncementComponent
  },
  {
    path: 'announcements-detail/:id',
    component: AnnouncementDetailComponent
  },
  {
    path: 'activities/:id',
    component: ActivityComponent
  },
  {
    path: 'activities-detail/:id',
    component: ActivityDetailComponent
  },
  {
    path: 'awards/:id',
    component: AwardComponent
  },
  {
    path: 'awards-detail/:id',
    component: AwardDetailComponent
  }
];

