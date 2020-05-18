import { Routes, RouterModule } from '@angular/router';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { FaqComponent } from './faq/faq.component';

export const contactUsRoutes: Routes = [
  {
    path: 'contact-form',
    component: ContactFormComponent
  },
  {
    path: 'faq',
    component: FaqComponent
  },
  {
    path: '',
    redirectTo: 'contact-form',
    pathMatch: 'full'
  }
];

