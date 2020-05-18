import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

export const dashboardRoute: Routes = [
  {
    path: 'dashboard/:id',
    component: DashboardComponent,
    data: {
      name: 'Dashboard'
    }
  }
];

