import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { privateRoutes } from './private-routing';
import { PrivateComponent } from './private.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HighlightComponent } from './highlight/highlight.component';
import { HighlightItemComponent } from './highlight/highlight-item/highlight-item.component';
import { ApplicationComponent } from './application/application.component';
import { NotPttAppComponent } from './application/not-ptt-app/not-ptt-app.component';
import { PttAppComponent } from './application/ptt-app/ptt-app.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MenuItemComponent } from './private-layout/menu-item/menu-item.component';
import { SearchComponent } from './search/search.component';
import { SitemapComponent } from './sitemap/sitemap.component';
import { PipeModule } from '../pipes/pipe.modules';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FilterBoxModule } from './filter-box/filter-box..modules';

@NgModule({
    imports: [
        RouterModule.forChild(privateRoutes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        PipeModule,
        NgbModule,
        FilterBoxModule
    ],
    declarations: [
        PrivateComponent,
        HighlightComponent,
        HighlightItemComponent,
        ApplicationComponent,
        PttAppComponent,
        NotPttAppComponent,
        ChangePasswordComponent,
        MenuItemComponent,
        SearchComponent,
        SitemapComponent
    ]

})
export class PrivateModule { }
