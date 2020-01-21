import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { DashboardModule } from './dashboard/dashboard.module';
import {LoginComponent} from './user/login/login.component';

import { FormsModule }   from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import {RouterModule,Routes} from '@angular/router';
import {HttpClientModule} from '@angular/common/http';
import {ParticlesModule} from 'angular-particle';
import { ToastrModule } from 'ng6-toastr-notifications';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppService } from './app.service';
import { QuillModule} from 'ngx-quill'
import { AlifeFileToBase64Module } from 'alife-file-to-base64';
import { SocketService } from './socket.service';

@NgModule({
  declarations: [
    AppComponent,
    
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ParticlesModule,
    FormsModule,
    UserModule,
    DashboardModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent, pathMatch: 'full' },
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '*', component: LoginComponent },
      { path: '**', component: LoginComponent }
    ]),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    Ng2SearchPipeModule,
    QuillModule.forRoot(),
    AlifeFileToBase64Module
  ],
  providers: [AppService,SocketService],
  bootstrap: [AppComponent]
})

export class AppModule { }
