import { Component, OnInit,ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AppService } from './../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  public userName: any;
  public password: any;

  constructor(
    public appService: AppService,
    public router: Router,
    private toastr: ToastrManager,
    
  ) {

    

  }

  ngOnInit() {
  }

  public googleLogin: any =()=>{
    window.open('http://api.issuetrackingtool.buzz/auth/google', "mywindow","location=1,status=1,scrollbars=1, width=800,height=800")
    let listener = window.addEventListener('message', (message) => {
      console.log(message)
      this.appService.setUserInfoInLocalStorage(message.data.user)
      Cookie.set('receiverId', message.data.user.userId);
      Cookie.set('receiverName', message.data.user.firstName + ' ' + message.data.user.lastName);
      this.router.navigate(['/dashboard'])
    });
    
  }
  public goToSignUp: any = () => {

    this.router.navigate(['/sign-up']);

  } // end goToSignUp

  public signin: any = () => {

    if (!this.userName) {
      this.toastr.warningToastr('enter email')


    } else if (!this.password) {

      this.toastr.warningToastr('enter password')


    } else {

      let data = {
        userName: this.userName,
        password: this.password
      }

      this.appService.signinFunction(data)
        .subscribe((apiResponse) => {

          if (apiResponse.status === 200) {
            console.log(apiResponse)

             Cookie.set('authtoken', apiResponse.data.authToken);
            
             Cookie.set('receiverId', apiResponse.data.userDetails.userId);
            
             Cookie.set('receiverName', apiResponse.data.userDetails.firstName + ' ' + apiResponse.data.userDetails.lastName);
           
             this.appService.setUserInfoInLocalStorage(apiResponse.data.userDetails)
            
             this.router.navigate(['/dashboard']);

          } else {
            this.toastr.errorToastr(apiResponse.message)
          }

        }, (err) => {
          this.toastr.errorToastr('Some Error Occured')

        });

    } // end condition

  } // end signinFunction

  
  

}