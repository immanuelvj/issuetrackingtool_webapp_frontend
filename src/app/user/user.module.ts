import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './signup/signup.component';
import { LoginComponent } from './login/login.component';
import {RouterModule,Routes} from '@angular/router';
import { FormsModule }   from '@angular/forms';
import { ToastrModule } from 'ng6-toastr-notifications';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [SignupComponent, LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild([
      {path:'signup',component:SignupComponent}
    ]),
    BrowserAnimationsModule,
    ToastrModule.forRoot()
  ]
})
export class UserModule { }
