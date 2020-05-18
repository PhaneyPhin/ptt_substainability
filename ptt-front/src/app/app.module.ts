import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import thLocale from '@angular/common/locales/th';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PublicLayoutComponent } from './public/public-layout/public-layout.component';
import { PrivateLayoutComponent } from './private/private-layout/private-layout.component';
import { NotFoundComponent } from './public/not-found/not-found.component';
import { InternalServerErrorComponent } from './public/internal-server-error/internal-server-error.component';
import { registerLocaleData } from '@angular/common';
import { BaseService } from './service/base.service';
import { ActivateUserComponent } from './activate-user/activate-user.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

registerLocaleData(thLocale, 'th');

@NgModule({
  declarations: [
    AppComponent,
    PublicLayoutComponent,
    PrivateLayoutComponent,
    NotFoundComponent,
    InternalServerErrorComponent,
    ActivateUserComponent,
    ResetPasswordComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: "th" }, { provide: HTTP_INTERCEPTORS, useClass: BaseService, multi: true }, { provide: LocationStrategy, useClass: HashLocationStrategy }],
  bootstrap: [AppComponent]
})
export class AppModule { }
