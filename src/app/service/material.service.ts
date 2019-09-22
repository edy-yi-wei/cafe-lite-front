import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Material } from '../model/material';

@Injectable({
  providedIn: 'root'
})

export class MaterialService {
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

  selectMaterial(page, search): Observable<any> {
    this.createHeaders();
    return this.http.get(this.apiURL + '/materials?search='+search+'&page=' + page, this.httpOptions)
    .pipe(      
      catchError(this.handleError)
    )
  }

  getMaterialParent(): Observable<any> {
    this.createHeaders();
    return this.http.get(this.apiURL + '/materials/parent', this.httpOptions)
      .pipe(
        catchError(this.handleError)
      )
  }

  getMaterial(id): Observable<Material> {
    this.createHeaders();
    return this.http.get<Material>(this.apiURL + '/materials/' + id, this.httpOptions)
    .pipe(      
      catchError(this.handleError)
    )
  }  

  saveMaterial(material): Observable<string> {    
    this.createHeaders();
    return this.http.post<string>(this.apiURL + '/materials', JSON.stringify(material), this.httpOptions)    
    .pipe(      
      catchError(this.handleError)
    )
  }  

  deleteMaterial(id): Observable<string> {
    this.createHeaders();
    return this.http.put<string>(this.apiURL + '/materials/' + id, null, this.httpOptions)
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
