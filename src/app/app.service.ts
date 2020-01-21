import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';

import { Cookie } from 'ng2-cookies/ng2-cookies';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpErrorResponse, HttpParams } from "@angular/common/http";


@Injectable()
export class AppService {

  private url =  'http://api.issuetrackingtool.buzz';

  constructor(
    public http: HttpClient
  ) {

    

  } // end constructor  


  public getUserInfoFromLocalstorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  } // end getUserInfoFromLocalstorage


  public setUserInfoInLocalStorage = (data) =>{

    localStorage.setItem('userInfo', JSON.stringify(data))


  }

  public signupFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobile', data.mobile)
      .set('email', data.email)
      .set('password', data.password)
      .set('userName', data.userName);

    return this.http.post(`${this.url}/api/v1/users/signup`, params);

  } // end of signupFunction function.

  public signinFunction(data): Observable<any> {

    const params = new HttpParams()
      .set('userName', data.userName)
      .set('password', data.password);

    return this.http.post(`${this.url}/api/v1/users/login`, params);
  } // end of signinFunction function.

  
  public logout(): Observable<any> {
       const params = new HttpParams()
      .set('authToken',Cookie.get('authtoken'))
      .set('userId',Cookie.get('receiverId'))
    return this.http.post(`${this.url}/api/v1/users/logout`, params);

    
  
  } // end logout function

  //

  public logoutgoogle():Observable<any>{
    return this.http.get(`${this.url}/api/v1/users/logoutgoogle`);
  }
  //get all user array function 

public getAllUser():Observable<any>{
  return this.http.get(`${this.url}/api/v1/users/view/all`);
}
//get specific user details
public getSingleUser(data):Observable<any>{
  return this.http.get(`${this.url}/api/v1/users/${data}/view`);
}

//end of specific user details
public isLoggedIn() {
  if(Cookie.get('authToken')||Cookie.get('io')){
    return true;
  }else{
    return false;
  }
}
  
  // Get Issue for specific user

  public getUserIssue(data,sort):Observable<any>{
    let userId = Cookie.get('receiverId');
  
    return this.http.get(`${this.url}/api/v1/issues/viewByAssigneeId/${userId}?skip=${data}&sort=${sort}`);
  }

//Creata a Issue

public createIssue(data):Observable<any>{

  const params = new HttpParams()
  .set('issueName',data.issueName)
  .set('issueStatus',data.issueStatus)
  .set('issueDescription',data.issueDescription)
  .set('issueReporterId',data.issueReporterId)
  .set('issueReporterName',data.issueReporterName)
  .set('issueAssigneeName',data.issueAssigneeName)
  .set('issueAssigneeId',data.issueAssigneeId)
  .set('issueRelatedImages',data.issueRelatedImages)
  .set('watchers',data.watchers)
  return this.http.post(`${this.url}/api/v1/issues/create`,params);
}

  //Get all Issue

  public getAllIssue():Observable<any>{
    return this.http.get(`${this.url}/api/v1/issues/allIssue`);
  }

  //get Single issue

  public getSingleIssueById(data):Observable<any>{
    return this.http.get(`${this.url}/api/v1/issues/view/${data}`);
  }

//delete a issue
public deleteIssue(data):Observable<any>{
  console.log(data.issueId)
  const params = new HttpParams()
  .set('issueId',data.issueId)
  return this.http.post(`${this.url}/api/v1/issues/delete`,params);
}


//edit a  isssue

public editAissue(id,data):Observable<any>{
  
return this.http.put(`${this.url}/api/v1/issues/${id}/edit`,data)
}

//add watcher list

  public addWatcher(data):Observable<any>{
    const params = new HttpParams()
    .set('issueId',data.issueId)
    .set('userId',data.userId)
    .set('userName',data.userName)
    return this.http.post(`${this.url}/api/v1/watcher/add`,params);
  }

  
//view watcher list by id 

public viewWatcher(data):Observable<any>{
  return this.http.get(`${this.url}/api/v1/watcher/view/${data}`);
}

//view image list by id


public viewImage(data):Observable<any>{
  return this.http.get(`${this.url}/api/v1/image/view/${data}`);
}
//view notification

public viewNotification(data):Observable<any>{
  return this.http.get(`${this.url}/api/v1/notification/view/${data}`);
}

//add image


public addImage(data):Observable<any>{
  const params = new HttpParams()
  .set('issueId',data.issueId)
  .set('imageData',data.imageData)
  .set('userName',data.userName)
  return this.http.post(`${this.url}/api/v1/image/add`,params);
}

//add Comment

public addComment(data):Observable<any>{
  const params = new HttpParams()
  .set('issueId',data.issueId)
  .set('userId',data.userId)
  .set('userName',data.userName)
  .set('message',data.message)
  return this.http.post(`${this.url}/api/v1/comment/add`,params);
}

//view all coments

public viewComment(data):Observable<any>{
  return this.http.get(`${this.url}/api/v1/comment/view/${data}`);
}

//delete a watcher
public deleteWatcher(data):Observable<any>{
  console.log(data.issueId)
  const params = new HttpParams()
  .set('WatcherId',data.WatcherId)
  return this.http.post(`${this.url}/api/v1/watcher/delete`,params);
}

//delete a image


public deleteImage(data):Observable<any>{
  console.log(data.issueId)
  const params = new HttpParams()
  .set('imageId',data.imageId)
  return this.http.post(`${this.url}/api/v1/image/delete`,params);
}

//delete a comment


public deleteComment(data):Observable<any>{
  console.log(data.issueId)
  const params = new HttpParams()
  .set('commentId',data.commentId)
  return this.http.post(`${this.url}/api/v1/comment/delete`,params);
}
}

