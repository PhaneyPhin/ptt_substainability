import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { contactUsRoutes } from './contact-us-routing';
import { ContactUsComponent } from './contact-us.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactFormComponent } from './contact-form/contact-form.component';
import { FaqComponent } from './faq/faq.component';
import { FilterBoxModule } from '../filter-box/filter-box..modules';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
    imports: [
        RouterModule.forChild(contactUsRoutes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        FilterBoxModule,
        NgbModule
    ],
    declarations: [
        ContactUsComponent,
        ContactFormComponent,
        FaqComponent
    ]
})
export class ContactUsModule { }
