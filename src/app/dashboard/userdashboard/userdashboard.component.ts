import { Component, OnInit } from '@angular/core';
import {AppService} from '../../app.service';
import {SocketService} from '../../socket.service';
import {Router} from '@angular/router';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-userdashboard',
  templateUrl: './userdashboard.component.html',
  styleUrls: ['./userdashboard.component.css']
})
export class UserdashboardComponent implements OnInit {
  public skip:number=0;
  public sort:String='';
  public allIssues = [
    ];
  public SearchText:String='';
  public isHidden:Boolean=false;
  public searchIssues = [];
  public searchViewText:String=' ';
  public showSearchIssues:Boolean=false;
  public Notifications =[];
  public userId:String=Cookie.get('receiverId')
  constructor(public appService:AppService,
    public router:Router,
    public Toastr:ToastrManager,
    public SocketService:SocketService)
     { }

  ngOnInit(  ) {
    this.getUserIssue();
    this.getissue();
    this.GetNotified();
    this.getNotification();
  }

  //getUsserIssueFunction
  public getUserIssue = () =>{
    this.appService.getUserIssue(this.skip,this.sort)
    .subscribe((apiResponse)=>{
      if(apiResponse.status === 200 ){
        this.allIssues = apiResponse.data
      }
      else{
        this.Toastr.errorToastr(apiResponse.message)
      }
    }),(err)=>{
      this.Toastr.errorToastr('Some Internal Error Occured')
    }
  }
  //End of GetUsserIssueFuntion

  //Pagination Funtion

  public previouspage = () => {
    if(this.skip===0){
      this.Toastr.errorToastr('Previous Disabled ! Initial Page Alert')
    }
    else {
      this.skip = this.skip-5;
      this.getUserIssue();
    }
  }

public nextpage = () => {
  this.skip = this.skip+5;
  this.getUserIssue();
}

//end pagination function

//get notification

public getNotification = () =>{
  this.appService.viewNotification(this.userId)
  .subscribe((apiResponse)=>{
    if(apiResponse.status===200){
      console.log(apiResponse.data)
      this.Notifications = apiResponse.data
    }
    else {
      this.Toastr.errorToastr('No notifications')
    }
  },(err)=>{
    this.Toastr.errorToastr('Some Internal Error')
  })
}
//sort value function

public sortValue = (data) =>{
  if(this.sort === data){
    this.sort=null;
    this.getUserIssue();
  }
  else{
    this.sort=data;
    this.getUserIssue();
  }
}






//Logout Function  
  public goToLogin: any = () => {

    this.router.navigate(['/login']);

  }

  public logout: any = () => {

    this.appService.logout()
      .subscribe((apiResponse) => {

        if (apiResponse.status === 200) {
          console.log("logout called")
          Cookie.delete('authtoken');

          Cookie.delete('receiverId');

          Cookie.delete('receiverName');

         // this.SocketService.exitSocket()

          this.router.navigate(['/']);

        } else {
          this.Toastr.errorToastr(apiResponse.message)

        } // end condition

      }, (err) => {
        this.Toastr.errorToastr('some error occured')


      });

  } // end logout

  
  public logoutgoogle: any = () => {

    this.appService.logoutgoogle()
      .subscribe((apiResponse) => {

        if (apiResponse.status === 200) {
          console.log("logout called")
          Cookie.delete('io');

          Cookie.delete('receiverId');

          Cookie.delete('receiverName');

         // this.SocketService.exitSocket()

          this.router.navigate(['/']);

        } else {
          this.Toastr.errorToastr(apiResponse.message)

        } // end condition

      }, (err) => {
        this.Toastr.errorToastr('some error occured')


      });

  } 
//search View Functions

public changeToSearchView=(data)=>{
  console.log('search view called')
  this.isHidden = true;
  if(data === null || data === '' ){
    this.showSearchIssues = false;
  }
  else{
    this.showSearchIssues=true;
  }
  console.log(data)
  console.log(this.showSearchIssues)
 
}

public changeToDashboardView = () =>{
  console.log('Dashboard View called')
  this.isHidden=false;
}

public getissue = () =>{
  this.appService.getAllIssue()
  .subscribe((apiResponse)=>{
    if(apiResponse.status ===200){
      this.searchIssues = apiResponse.data;
    }
    else{
      this.Toastr.errorToastr(apiResponse.message)
    }
  },
  (err)=>{
    this.Toastr.errorToastr('Some Error Occured')
  });
}
//

public issueClicked = (data)=>{
  this.router.navigate(['/view',data])
  console.log(data)
}


public GetNotified:any = () =>{
  console.log('get notified called')
this.SocketService.NotificationReceiver(this.userId)
.subscribe((data)=>{
  this.Toastr.successToastr(`Notification : ${data.message}`);
  this.getNotification();
})
}
}
