import { Routes, RouterModule } from '@angular/router';
import { HighlightComponent } from './highlight/highlight.component';
import { ApplicationComponent } from './application/application.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SearchComponent } from './search/search.component';
import { SitemapComponent } from './sitemap/sitemap.component';


export const privateRoutes: Routes = [
  {
    path: 'highlight',
    component: HighlightComponent
  },
  {
    path: 'applications',
    component: ApplicationComponent
  },
  {
    path: 'change-password',
    component: ChangePasswordComponent
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'sitemap',
    component: SitemapComponent
  },
  {
    path: 'news',
    loadChildren: './news/news.modules#NewsModule'
  },
  {
    path: 'contact-us',
    loadChildren: './contact-us/contact-us.modules#ContactUsModule'
  }
  ,
  {
    path: 'policy',
    loadChildren: './policy-target/policy-target.modules#PolicyTargetModule'
  },
  {
    path: 'about-sm',
    loadChildren: './about-sm/about-sm.modules#AboutSMModule'
  },
  {
    path: 'download',
    loadChildren: './download/download.modules#DownloadModule'
  },
  {
    path: 'dashboard',
    loadChildren: './dashboard/dashboard.modules#DashboardModule'
  },
  {
    path: '',
    redirectTo: 'highlight',
    pathMatch: 'full'
  }
];

