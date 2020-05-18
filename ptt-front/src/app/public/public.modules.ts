import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { publicRoutes } from './public-routing';
import { PublicComponent } from './public.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';



@NgModule({
    imports: [
        RouterModule.forChild(publicRoutes),
        CommonModule,
        FormsModule,
        ReactiveFormsModule
    ],
    declarations: [
        PublicComponent,
        LoginComponent,
        RegisterComponent,
        ForgotPasswordComponent,
    ]
})
export class PublicModule { }
