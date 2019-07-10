import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Module } from '../model/module';

@Injectable({
  providedIn: 'root'
})

export class ModuleService {
  
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

  selectModule(page, search): Observable<any> {
    this.createHeaders();
    return this.http.get(this.apiURL + '/modules?search='+search+'&page=' + page, this.httpOptions)
    .pipe(      
      catchError(this.handleError)
    )
  }

  getModule(id): Observable<Module> {
    this.createHeaders();
    return this.http.get<Module>(this.apiURL + '/modules/' + id, this.httpOptions)
    .pipe(      
      catchError(this.handleError)
    )
  }  

  saveModule(module): Observable<string> {
    this.createHeaders();
    return this.http.post<string>(this.apiURL + '/modules', JSON.stringify(module), this.httpOptions)    
    .pipe(      
      catchError(this.handleError)
    )
  }  

  deleteModule(id): Observable<string> {    
    this.createHeaders();
    return this.http.put<string>(this.apiURL + '/modules/' + id, null, this.httpOptions)
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
