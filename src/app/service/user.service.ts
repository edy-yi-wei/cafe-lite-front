import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { User } from '../model/user';
import { Role } from '../model/role';

@Injectable({
  providedIn: 'root'
})

export class UserService {
  
  // Define API
  apiURL = 'http://localhost:8080/cafelite';

  userName = '';
  userPassword = '';

  httpOptions = {};

  constructor(private http: HttpClient) { 
  }

  createHeaders(){
    this.userName = sessionStorage.getItem('userName');
    this.userPassword = sessionStorage.getItem('userPassword');

    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Basic '+ btoa(this.userName+':'+this.userPassword)
      })
    } 
  }

  loginOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }  

  selectUser(page, search): Observable<any> {
    this.createHeaders();
    return this.http.get(this.apiURL + '/users?search='+search+'&page=' + page, this.httpOptions)
    .pipe(      
      catchError(this.handleError)
    )
  }

  getUser(id): Observable<User> {
    this.createHeaders();
    return this.http.get<User>(this.apiURL + '/users/' + id, this.httpOptions)
    .pipe(      
      catchError(this.handleError)
    )
  }  

  saveUser(user): Observable<string> {
    this.createHeaders();
    return this.http.post<string>(this.apiURL + '/users', JSON.stringify(user), this.httpOptions)    
    .pipe(      
      catchError(this.handleError)
    )
  }  

  deleteUser(id): Observable<string> {
    this.createHeaders();    
    return this.http.put<string>(this.apiURL + '/users/' + id, null, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  login(userName, password): Observable<string> {
    var user = {
      userName: userName,
      userPassword: password
    }
    // console.log(user);
    return this.http.post<string>(this.apiURL + '/security/login', JSON.stringify(user), this.loginOptions)
    .pipe(      
      catchError(this.handleError)
    )
  }

  logout(): Observable<string> {
    return this.http.post<string>(this.apiURL + '/security/logout', null, this.loginOptions)
    .pipe(      
      catchError(this.handleError)
    )
  }

  getRoleUser(userName): Observable<Role> {
    this.createHeaders();
    return this.http.get<Role>(this.apiURL + '/users/role?userName=' + userName, this.httpOptions)
    .pipe(      
      catchError(this.handleError)
    )
  }  

  // Error handling 
  handleError(error) {
     let errorMessage = '';
     if(error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       let arrMessage = error.error.messages;
       if(arrMessage!=null){
         arrMessage.forEach(function(value) {           
           errorMessage += value + "\n";
         });
       }
     }
     return throwError(errorMessage);
  }

}
