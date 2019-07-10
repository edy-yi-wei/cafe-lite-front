import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class InvoiceService {
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

  selectMenu(page, search): Observable<any> {
    this.createHeaders();
    return this.http.get(this.apiURL + '/menus?search='+search+'&page=' + page, this.httpOptions)
    .pipe(      
      catchError(this.handleError)
    )
  }

  selectInvoice(startDate, endDate, page): Observable<any> {
    this.createHeaders();
    return this.http.get(this.apiURL + '/invoices?startDate='+startDate+'&endDate='+endDate+'&page=' + page, this.httpOptions)
    .pipe(      
      catchError(this.handleError)
    )
  }

  saveInvoice(invoice): Observable<string> {
    this.createHeaders();
    return this.http.post<string>(this.apiURL + '/invoices', JSON.stringify(invoice), this.httpOptions)
    .pipe(      
      catchError(this.handleError)
    )
  }  

  doClosing(userName, userPassword): Observable<string> {    
    this.createHeaders();
    return this.http.post<string>(this.apiURL + '/invoices/closing?userName='+userName+'&userPassword='+userPassword, '', this.httpOptions)
    .pipe(      
      catchError(this.handleError)
    )
  }  

  reprintInvoice(userName): Observable<any> {
    this.createHeaders();
    return this.http.get(this.apiURL + '/invoices/reprint?userName='+userName, this.httpOptions)
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
      errorMessage = error.error[0];
     }
     return throwError(errorMessage);
  }

}
