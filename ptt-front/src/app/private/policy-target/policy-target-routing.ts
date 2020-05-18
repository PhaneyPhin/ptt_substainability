import { Routes, RouterModule } from '@angular/router';
import { PolicyTargetComponent } from './policy-target.component';

export const policyTargetRoutes: Routes = [
  {
    path: 'policy/:id',
    component: PolicyTargetComponent,
    data: {
      name: 'Policy'
    }
  },
  {
    path: 'target/:id',
    component: PolicyTargetComponent,
    data: {
      name: 'Target'
    }
  }
];

