import { Component, OnInit, Input } from '@angular/core';
import { SocketService } from '../../socket.service';
import { AppService } from '../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AlifeFileToBase64Module } from 'alife-file-to-base64';
import { ActivatedRoute, Router } from '@angular/router'
import { StaticInjector } from '@angular/core/src/di/injector';

import { from } from 'rxjs';

@Component({
  selector: 'app-create-issue',
  templateUrl: './create-issue.component.html',
  styleUrls: ['./create-issue.component.css']
})
export class CreateIssueComponent implements OnInit {
  public watcherIssueId: String;
  public allUsers = [];
  public selectFile: String = '';
  public selectedFileName: String = '';
  public issueName: String = '';
  public issueStatus: String = '';
  public issueDescription: String = '';
  public issueReporterName: String = Cookie.get('receiverName')
  public issueReporterId: String = Cookie.get('receiverId')
  public issueAssigneeId: String = '';
  public issueAssigneeName: String = '';
  public watcherName: String = '';

  constructor(
    public ActivatedRoute: ActivatedRoute,
    public AppService: AppService,
    public Router: Router,
    public Toastr: ToastrManager,
    public SocketService: SocketService
  ) { }

  ngOnInit() {
    this.getAllUser()
    this.GetNotified()
  }
  //editor modules
  modules = {
    formula: true,
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'color': [] }],
      [{ 'align': [] }],

    ]
  };
  //editor Modules

  //image Base64 fucntion 
  public onFileChanges = (files) => {
    this.selectedFileName = files[0].name;
    this.selectFile = files[0].base64;
    console.log(files);
  }


  //end of Image Base64
  //get all user 

  public getAllUser = () => {
    this.AppService.getAllUser()
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.allUsers = apiResponse.data;
          console.log(this.allUsers)
        }
        else {
          this.Toastr.errorToastr(apiResponse.message)
        }
      }, (err) => {
        this.Toastr.errorToastr('Some Internal Error Occured')
      })
  }
  //end of get all user function
  //get information of single user


  //end of get single user info
  public getsingleUserDetails = () => {
    this.AppService.getSingleUser(this.issueAssigneeId)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          console.log(apiResponse.data.firstName)
          this.issueAssigneeName = apiResponse.data.firstName;

        }
        else {
          this.Toastr.errorToastr(apiResponse.message)
        }
      }, (err) => {
        this.Toastr.errorToastr('Some Internal Error Occured');
      })
  }


  // Create Issue fucntion

  public createData = () => {
    console.log('creating data')
    let watcherName = [{ id: this.issueAssigneeId, name: this.issueAssigneeName }, { id: this.issueReporterId, name: this.issueReporterName }]
    let data = {
      issueName: this.issueName,
      issueStatus: this.issueStatus,
      issueDescription: this.issueDescription,
      issueReporterId: this.issueReporterId,
      issueReporterName: this.issueReporterName,
      issueAssigneeId: this.issueAssigneeId,
      issueAssigneeName: this.issueAssigneeName,
      issueRelatedImages: this.selectFile
    }
    console.log(data)
    this.AppService.createIssue(data)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.Toastr.successToastr('Issue Creation Sucessfull')
          this.watcherIssueId = apiResponse.data.issueId;
          console.log(this.watcherIssueId);
        }
        else {
          this.Toastr.errorToastr(apiResponse.message)
        }

      }, (err) => {
        this.Toastr.errorToastr('Some Internal Error Occured')
      })
  }

  public createWatcher = (issueId, userId, userName) => {

    let data = {
      issueId: issueId,
      userId: userId,
      userName: userName
    }
    this.AppService.addWatcher(data)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          console.log('watcher added')
        }
        else {
          console.log(apiResponse.message)
        }
      }, (err) => {
        console.log('internal error at watcher')
      })
  }

  public sendNotication = (issueId, userId, message) => {
    let data = {
      issueId: issueId,
      userId: userId,
      message: message
    }
    this.SocketService.SendNotificationMessage(data);
  }

  public createIssue() {
    this.getsingleUserDetails();
    setTimeout(() => {
      this.createData();
    }, 1000);
    setTimeout(() => {
      this.createWatcher(this.watcherIssueId, this.issueReporterId, this.issueReporterName);
      this.sendNotication(this.watcherIssueId, this.issueReporterId, 'Your issue has been created')
      this.createWatcher(this.watcherIssueId, this.issueAssigneeId, this.issueAssigneeName);
      this.sendNotication(this.watcherIssueId, this.issueAssigneeId, 'You have been assigned an Issue')

    }, 2000);

  }
  //end of create Issue Function

  public changeToDashboardView = () => {
    this.Router.navigate(['/dashboard']);
  }

  public GetNotified: any = () => {
    console.log('get notified called')
    this.SocketService.NotificationReceiver(this.issueReporterId)
      .subscribe((data) => {
        this.Toastr.successToastr(`Notification : ${data.message}`);
      })
  }
}
