import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Role } from '../model/role';
import { Menu } from '../model/menu';

@Injectable({
  providedIn: 'root'
})

export class MenuService {
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

  getMenu(id): Observable<Menu> {
    this.createHeaders();
    return this.http.get<Menu>(this.apiURL + '/menus/' + id, this.httpOptions)
    .pipe(      
      catchError(this.handleError)
    )
  }  

  saveMenu(menu): Observable<string> {    
    this.createHeaders();
    return this.http.post<string>(this.apiURL + '/menus', JSON.stringify(menu), this.httpOptions)    
    .pipe(      
      catchError(this.handleError)
    )
  }  

  deleteMenu(id): Observable<string> {
    this.createHeaders();
    return this.http.put<string>(this.apiURL + '/menus/' + id, null, this.httpOptions)
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
