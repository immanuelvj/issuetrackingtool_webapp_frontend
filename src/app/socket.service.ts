import { Injectable } from '@angular/core';


import * as io from 'socket.io-client';

import { Observable, observable } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";

@Injectable()
export class SocketService {

  private url = 'http://api.issuetrackingtool.buzz';

  private socket;

  constructor(public http: HttpClient) {
    // connection is being created.
    // that handshake
    this.socket = io(this.url);

  }

  public NotificationReceiver = (userId) =>{
    console.log('receiveng data')
    return Observable.create((observer)=>{
      this.socket.on(userId,(data)=>{
        observer.next(data);
      })
    })
  }

  
  

  public SendNotificationMessage = (notificationMsgObject) => {

    this.socket.emit('Notification', notificationMsgObject);

  } // end Notification Message


  public exitSocket = () =>{


    this.socket.disconnect();


  }// end exit socket




  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if

    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError

}
