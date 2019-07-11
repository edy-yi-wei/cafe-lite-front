import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Supplier } from '../model/supplier';

@Injectable({
  providedIn: 'root'
})

export class SupplierService {
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

  selectSupplier(page, search): Observable<any> {
    this.createHeaders();
    return this.http.get(this.apiURL + '/suppliers?search='+search+'&page=' + page, this.httpOptions)
    .pipe(      
      catchError(this.handleError)
    )
  }

  getSupplier(id): Observable<Supplier> {
    this.createHeaders();
    return this.http.get<Supplier>(this.apiURL + '/suppliers/' + id, this.httpOptions)
    .pipe(      
      catchError(this.handleError)
    )
  }  

  saveSupplier(supplier): Observable<string> {    
    this.createHeaders();
    return this.http.post<string>(this.apiURL + '/suppliers', JSON.stringify(supplier), this.httpOptions)    
    .pipe(      
      catchError(this.handleError)
    )
  }  

  deleteSupplier(id): Observable<string> {
    this.createHeaders();
    return this.http.put<string>(this.apiURL + '/suppliers/' + id, null, this.httpOptions)
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
