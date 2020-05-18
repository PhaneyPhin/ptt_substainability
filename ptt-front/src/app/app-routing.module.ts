import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PublicLayoutComponent } from './public/public-layout/public-layout.component';
import { PrivateLayoutComponent } from './private/private-layout/private-layout.component';
import { InternalServerErrorComponent } from './public/internal-server-error/internal-server-error.component';
import { NotFoundComponent } from './public/not-found/not-found.component';
import { ActivateUserComponent } from './activate-user/activate-user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path: 'public',
    component: PublicLayoutComponent,
    loadChildren: './public/public.modules#PublicModule',
  }, {
    path: 'home',
    component: PrivateLayoutComponent,
    loadChildren: './private/private.modules#PrivateModule',
  }, {
    path: 'activate',
    component: ActivateUserComponent
  }, {
    path: 'reset',
    component: ResetPasswordComponent
  },
  {
    path: '',
    redirectTo: 'public',
    pathMatch: 'full'
  },
  {
    path: '500',
    component: InternalServerErrorComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
