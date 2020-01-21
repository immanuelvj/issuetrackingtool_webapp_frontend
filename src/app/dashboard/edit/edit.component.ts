import { Component, OnInit } from '@angular/core';

import { AppService } from '../../app.service';
import { ToastrManager } from 'ng6-toastr-notifications';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { AlifeFileToBase64Module } from 'alife-file-to-base64';
import { ActivatedRoute, Router } from '@angular/router'
import { SocketService } from '../../socket.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  public userId: String = Cookie.get('receiverId')
  public currentIssueId: any;
  public currentWatcher: any;
  public currentImage: any;
  public commentList: any;
  public allUsers = [];
  public files: any;
  public selectFile: String = '';
  public selectedFileName: String = '';
  public issueAssigneeId: String = '';
  public issueAssigneeName: String = '';
  public watcherName: String = '';
  public watcherAdd: any = '';
  public comment: any = '';
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

  constructor(public ActivatedRoute: ActivatedRoute,
    public Router: Router,
    public AppService: AppService,
    public Toastr: ToastrManager,
    public SocketService: SocketService) { }

  ngOnInit() {
    let clickedIssueId = this.ActivatedRoute.snapshot.paramMap.get('issueId')
    this.getAllUser()
    this.getIssueById(clickedIssueId)
    this.getWatcherIssue(clickedIssueId)
    this.getImageList(clickedIssueId)
    this.getCommentList(clickedIssueId)
    this.GetNotified()
  }

  public GetNotified: any = () => {
    console.log('get notified called')
    this.SocketService.NotificationReceiver(this.userId)
      .subscribe((data) => {
        this.Toastr.successToastr(`Notification : ${data.message}`);
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
  // get clicked Issue Details Function
  public getIssueById = (data) => {
    this.AppService.getSingleIssueById(data)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.currentIssueId = apiResponse.data;
          console.log(apiResponse.data);
        }
        else {
          this.Toastr.errorToastr(apiResponse.message)
        }
      }, (err) => {
        this.Toastr.errorToastr('Some Internal Error Occured')
      })
  }
  // end of fucntion


  //edit this issue

  public editTheIssue = () => {
    this.AppService.editAissue(this.currentIssueId.issueId, this.currentIssueId)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          setTimeout(() => {
            this.Toastr.successToastr('Issue Edited Sucessfully');
            this.Router.navigate(['/view', this.currentIssueId.issueId])

          }, 1000);
        }
        else {
          this.Toastr.errorToastr(apiResponse.message)
        }
      }, (err) => {
        this.Toastr.errorToastr('Some Internal Error')
      })
  }

  public editIssue = () => {
    this.getsingleUserDetails();
    console.log(this.currentIssueId)
    setTimeout(() => {
      this.editTheIssue()
    }, 1000);
    this.currentWatcher.forEach(watcher => {
      this.sendNotication(this.currentIssueId.issueId, watcher.userId, `There has some changes in the issue ${this.currentIssueId.issueName}`)
    });
  }


  deleteThisBlog(): any {
    console.log(this.currentIssueId.issueId)

    this.AppService.deleteIssue(this.currentIssueId)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          setTimeout(() => {
            this.Toastr.successToastr('Issue deleted sucessfully')
            this.Router.navigate(['/dashboard'])
          }, 1000);
          this.currentWatcher.forEach(watcher => {
            this.sendNotication(this.currentIssueId.issueId, watcher.userId, `The ${this.currentIssueId.issueName} has been deleted`)
          });
        }
        else {
          this.Toastr.errorToastr(apiResponse.message)
        }
      }, (err) => {
        this.Toastr.errorToastr('Some Internal Error Occured')
      })

  }
  // view watcher list 

  public getWatcherIssue = (data) => {
    this.AppService.viewWatcher(data)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.currentWatcher = apiResponse.data;
          console.log(this.currentWatcher)
        }
        else {
          this.Toastr.errorToastr(apiResponse.message)
        }
      }, (err) => {
        this.Toastr.errorToastr('Some Internal Error Occured')
      })
  }

  //add watcher List

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


  public addWatcherIssue = () => {
    if (!this.watcherName) {
      this.Toastr.errorToastr('Empty User Field')
    }
    else {
      this.AppService.getSingleUser(this.watcherName)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            console.log(apiResponse.data.firstName)
            this.watcherAdd = apiResponse.data.firstName;

            console.log(this.watcherAdd.userName)
          }
          else {
            this.Toastr.errorToastr(apiResponse.message)
          }
        }, (err) => {
          this.Toastr.errorToastr('Some Internal Error Occured');
        })
    }
  }

  public addWatcher = () => {
    this.addWatcherIssue()
    setTimeout(() => {
      console.log(this.watcherAdd)
      this.createWatcher(this.currentIssueId.issueId, this.watcherName, this.watcherAdd);
      this.getWatcherIssue(this.currentIssueId.issueId);
    }, 1000);
    this.currentWatcher.forEach(watcher => {
      this.sendNotication(this.currentIssueId.issueId, watcher.userId, `Watcher has been added for the issue ${this.currentIssueId.issueName}`)
    });

  }

  //

  //get Image list

  public getImageList = (data) => {
    this.AppService.viewImage(data)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.currentImage = apiResponse.data;
        }
        else {
          this.Toastr.errorToastr(apiResponse.message)
        }
      }, (err) => {
        this.Toastr.errorToastr('Some Internal Error Occured')
      })
  }
  //add imagelist
  public addAImage = () => {
    if (!this.selectFile) {
      this.Toastr.errorToastr('No File Selected')
    }
    else {
      let data = {
        issueId: this.currentIssueId.issueId,
        userName: Cookie.get('receiverName'),
        imageData: this.selectFile
      }
      this.AppService.addImage(data)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
           this.Toastr.successToastr('Image has been added')
          }
          else {
            this.Toastr.errorToastr(apiResponse.message)
          }
        }, (err) => {
          this.Toastr.errorToastr('Some Error Occured')
        })
    }
  }

  public addImage = () =>{
    this.addAImage()
    setTimeout(() => {
      window.location.reload()
    },1000);
    this.currentWatcher.forEach(watcher => {

      this.sendNotication(this.currentIssueId.issueId, watcher.userId, `Image has been added for the issue ${this.currentIssueId.issueName}`)
    });

  }
  //get Comment List
  public getCommentList = (data) => {
    this.AppService.viewComment(data)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          this.commentList = apiResponse.data;
          console.log(this.commentList)
        }
        else {
          this.Toastr.errorToastr(apiResponse.message)
        }
      }, (err) => {
        this.Toastr.errorToastr('Some Internal Error Occured')
      })
  }
  //add comment 

  public addAComment = () => {
    if (!this.comment) {
      this.Toastr.errorToastr('No Comment in the Input')
    }
    else {
      let data = {
        issueId: this.currentIssueId.issueId,
        userId: Cookie.get('receiverId'),
        userName: Cookie.get('receiverName'),
        message: this.comment
      }
      console.log(data)
      this.AppService.addComment(data)
        .subscribe((apiResponse) => {
          if (apiResponse.status === 200) {
            this.Toastr.successToastr('Comment has been added')
          }
          else {
            this.Toastr.errorToastr(apiResponse.message)
          }
        }, (err) => {
          this.Toastr.errorToastr('Some Internal Error')
        })
    }
  }

  public addComment = () =>{
    this.addAComment()
    setTimeout(() => {
      this.getCommentList(this.currentIssueId.issueId)
    },1000);
    this.currentWatcher.forEach(watcher => {
      this.sendNotication(this.currentIssueId.issueId, watcher.userId, `Comment has been added for the issue ${this.currentIssueId.issueName}`)
    });
  }

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

  public getsingleUserDetails = () => {
    this.AppService.getSingleUser(this.currentIssueId.issueAssigneeId)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          console.log(apiResponse.data.firstName)
          this.currentIssueId.issueAssigneeName = apiResponse.data.firstName;
        }
        else {
          this.Toastr.errorToastr(apiResponse.message)
        }
      }, (err) => {
        this.Toastr.errorToastr('Some Internal Error Occured');
      })
  }


  public changeToDashboardView = () => {
    this.Router.navigate(['/dashboard']);
  }

  //delete watcher
  deleteThisWatcher(data): any {


    this.AppService.deleteWatcher(data)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          setTimeout(() => {
         window.location.reload()
          }, 1000);
           this.Toastr.successToastr('Watcher deleted sucessfully')
           this.getWatcherIssue(this.currentIssueId.issueId)

           this.currentWatcher.forEach(watcher => {

             this.sendNotication(this.currentIssueId.issueId, watcher.userId, `watcher has been deleted for the issue ${this.currentIssueId.issueName}`)
           });
         
        }
        else {
          this.Toastr.errorToastr(apiResponse.message)
        }
      }, (err) => {
        this.Toastr.errorToastr('Some Internal Error Occured')
      })

  }

  //delete image


  deleteThisImage(data): any {


    this.AppService.deleteImage(data)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          setTimeout(() => {
            window.location.reload()
          }, 1000);
          this.Toastr.successToastr('Image deleted sucessfully')
            this.getImageList(this.currentIssueId.issueId)

            this.currentWatcher.forEach(watcher => {

              this.sendNotication(this.currentIssueId.issueId, watcher.userId, `Image has been deleted for the issue ${this.currentIssueId.issueName}`)
            });

        }
        else {
          this.Toastr.errorToastr(apiResponse.message)
        }
      }, (err) => {
        this.Toastr.errorToastr('Some Internal Error Occured')
      })

  }

  //delete a comment


  deleteThisComment(data): any {


    this.AppService.deleteComment(data)
      .subscribe((apiResponse) => {
        if (apiResponse.status === 200) {
          setTimeout(() => {
           
            
           window.location.reload();
          }, 1000);
          this.Toastr.successToastr('comment deleted sucessfully')
          this.currentWatcher.forEach(watcher => {

            this.sendNotication(this.currentIssueId.issueId, watcher.userId, `Comment has been deleted for the issue ${this.currentIssueId.issueName}`)
          });
        }
        else {
          this.Toastr.errorToastr(apiResponse.message)
        }
      }, (err) => {
        this.Toastr.errorToastr('Some Internal Error Occured')
      })

  }
}
