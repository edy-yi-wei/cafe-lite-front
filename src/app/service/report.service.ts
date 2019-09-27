import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MenuService } from './menu.service';

@Injectable({
  providedIn: 'root'
})

export class ReportService {
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

  selectInvoice(startDate, endDate, page): Observable<any> {
    this.createHeaders();
    return this.http.get(this.apiURL + '/report/invoices?startDate='+startDate+'&endDate='+endDate+'&page=' + page, this.httpOptions)
    .pipe(      
      catchError(this.handleError)
    )
  }

  selectCashierSession(startDate, endDate, page): Observable<any> {
    this.createHeaders();
    return this.http.get(this.apiURL + '/report/cashierSessions?startDate='+startDate+'&endDate='+endDate+'&page=' + page, this.httpOptions)
    .pipe(      
      catchError(this.handleError)
    )
  }

  selectSoldMenu(startDate, endDate, page): Observable<any> {
    this.createHeaders();
    return this.http.get(this.apiURL + '/report/soldMenus?startDate='+startDate+'&endDate='+endDate+'&page=' + page, this.httpOptions)
    .pipe(      
      catchError(this.handleError)
    )
  }

  sendMail(startDate, endDate): Observable<any> {
    this.createHeaders();
    return this.http.get(this.apiURL + '/report/sendMail?startDate='+startDate+'&endDate='+endDate, this.httpOptions)
    .pipe(
      catchError(this.handleError)
    )
  }

  selectPurchasing(startDate, endDate, page): Observable<any> {
    this.createHeaders();
    return this.http.get(this.apiURL + '/report/purchasings?startDate=' + startDate + '&endDate=' + endDate + '&page=' + page, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  selectAdjustment(startDate, endDate, page): Observable<any> {
    this.createHeaders();
    return this.http.get(this.apiURL + '/report/adjustments?startDate=' + startDate + '&endDate=' + endDate + '&page=' + page, this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

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
