import { Component, OnInit } from '@angular/core';

import {AppService} from '../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AlifeFileToBase64Module } from 'alife-file-to-base64';
import {ActivatedRoute,Router} from '@angular/router'
import { ThrowStmt } from '@angular/compiler';
import { DomSanitizer } from '@angular/platform-browser';
import {SocketService} from '../../socket.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  public userId:String=Cookie.get('receiverId')
  public currentIssueId :any='';
  public currentWatcher:any='';
  public currentImage:any='';
  public commentList:any='';
  constructor(public ActivatedRoute:ActivatedRoute,
    public Router:Router,
    public AppService:AppService,
    public Toastr:ToastrManager,
    private sanitizer: DomSanitizer,
    public SocketService:SocketService) { }

  ngOnInit() {
    
    let clickedIssueId = this.ActivatedRoute.snapshot.paramMap.get('issueId');
    this.getIssueById(clickedIssueId);
    this.getWatcherIssue(clickedIssueId);
    this.getImageList(clickedIssueId);
    this.getCommentList(clickedIssueId);
    this.GetNotified();
  
  }

public getSantizeUrl(url : string) { 
  console.log(url)
  return this.sanitizer.bypassSecurityTrustUrl(url); 
}
// get clicked Issue Details Function
public getIssueById = (data) =>{
this.AppService.getSingleIssueById(data)
.subscribe((apiResponse)=>{
  if(apiResponse.status ===200){
    this.currentIssueId = apiResponse.data;
    console.log(apiResponse.data);
  }
  else{
    this.Toastr.errorToastr(apiResponse.message)
  }
},(err)=>{
  this.Toastr.errorToastr('Some Internal Error Occured')
})
}
// end of fucntion


deleteThisBlog(): any {
  console.log(this.currentIssueId.issueId)

  this.AppService.deleteIssue(this.currentIssueId)
  .subscribe((apiResponse)=>{
    if(apiResponse.status===200){
      setTimeout(() => {
        this.Toastr.successToastr('Issue deleted sucessfully')
        this.Router.navigate(['/dashboard'])
      }, 1000);
    }
    else{
      this.Toastr.errorToastr(apiResponse.message)
    }
  },(err)=>{
    this.Toastr.errorToastr('Some Internal Error Occured')
  })

}

// view watcher list 

public getWatcherIssue = (data) =>{
  this.AppService.viewWatcher(data)
  .subscribe((apiResponse)=>{
   if(apiResponse.status===200){
    this.currentWatcher = apiResponse.data;
    console.log(this.currentWatcher)
   }
   else{
     this.Toastr.errorToastr(apiResponse.message)
   }
   },(err)=>{
     this.Toastr.errorToastr('Some Internal Error Occured')
   })
}


//get Image list

public getImageList = (data) =>{
  this.AppService.viewImage(data)
  .subscribe((apiResponse)=>{
   if(apiResponse.status===200){
     this.currentImage = apiResponse.data;
     this.Toastr.successToastr('sucess')
    console.log(this.currentImage)
   }
   else{
     this.Toastr.errorToastr(apiResponse.message)
   }
   },(err)=>{
     this.Toastr.errorToastr('Some Internal Error Occured')
   })
}

//get Comment List
public getCommentList = (data) =>{
  this.AppService.viewComment(data)
  .subscribe((apiResponse)=>{
   if(apiResponse.status===200){
    this.commentList = apiResponse.data;
    console.log(this.commentList)
   }
   else{
     this.Toastr.errorToastr(apiResponse.message)
   }
   },(err)=>{
     this.Toastr.errorToastr('Some Internal Error Occured')
   })
}


public changeToDashboardView = () =>{
  this.Router.navigate(['/dashboard']);
}


public GetNotified:any = () =>{
  console.log('get notified called')
this.SocketService.NotificationReceiver(this.userId)
.subscribe((data)=>{
  this.Toastr.successToastr(`Notification : ${data.message}`);
})
}
}
