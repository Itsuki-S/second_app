import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { RouterModule, Routes } from '@angular/router';

import { CookieService } from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UserComponent } from './components/user/user.component';
import { PageNotFoundComponent } from './components/error/page-not-found/page-not-found.component';
import { NavComponent } from './components/nav/nav.component';

import { CommonModule } from '@angular/common';
import { LayoutModule } from '@angular/cdk/layout';
import { LoginRegisterComponent } from './components/account/login-register/login-register.component';
import { PanelComponent } from './components/panel/panel.component';
import { MaterialModule } from './material.module';
import { LogRegisterComponent } from './components/log-register/log-register.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    UserComponent,
    PageNotFoundComponent,
    NavComponent,
    LoginRegisterComponent,
    PanelComponent,
    LogRegisterComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    RouterModule,
    LayoutModule,
    MaterialModule,
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }
