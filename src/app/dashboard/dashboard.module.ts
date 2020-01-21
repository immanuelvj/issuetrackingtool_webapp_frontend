import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserdashboardComponent } from './userdashboard/userdashboard.component';
import {RouterModule,Routes} from '@angular/router';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { FormsModule }   from '@angular/forms';
import { ToastrModule } from 'ng6-toastr-notifications';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {QuillModule} from 'ngx-quill';
import { AlifeFileToBase64Module } from 'alife-file-to-base64';

import {SafePipe} from '../safe-url.pipe'
import { CreateIssueComponent } from './create-issue/create-issue.component';
import { ViewComponent } from './view/view.component';
import { EditComponent } from './edit/edit.component';

@NgModule({
  declarations: [UserdashboardComponent, CreateIssueComponent, ViewComponent, EditComponent,SafePipe],
  imports: [
    CommonModule,
    RouterModule.forChild([
      {path:'dashboard',component:UserdashboardComponent},
      {path:'createissue',component:CreateIssueComponent},
      {path:'view/:issueId',component:ViewComponent},
      {path:'edit/:issueId',component:EditComponent}
    ]),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    FormsModule,
    Ng2SearchPipeModule,
    QuillModule.forRoot(),
    AlifeFileToBase64Module,
    
  ]
})
export class DashboardModule { }
