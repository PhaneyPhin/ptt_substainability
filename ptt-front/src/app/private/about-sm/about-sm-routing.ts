import { Routes, RouterModule } from '@angular/router';
import { OverviewOfSmManagementComponent } from './overview-of-sm-management/overview-of-sm-management.component';
import { SmFunctionComponent } from './sm-function/sm-function.component';
import { SmGovernanceMechanismComponent } from './sm-governance-mechanism/sm-governance-mechanism.component';
import { SmVisionAndMissionComponent } from './sm-vision-and-mission/sm-vision-and-mission.component';


export const aboutSMRoutes: Routes = [
  {
    path: 'overview/:id',
    component: OverviewOfSmManagementComponent
  },
  {
    path: 'function/:id',
    component: SmFunctionComponent
  },
  {
    path: 'governance/:id',
    component: SmGovernanceMechanismComponent
  },
  {
    path: 'vision/:id',
    component: SmVisionAndMissionComponent
  },
  {
    path: 'about/:id',
    component: OverviewOfSmManagementComponent
  }
  
];

