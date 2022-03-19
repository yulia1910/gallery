import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  public httpGet(url: string): Observable<any>{
    let headers = new HttpHeaders();

    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Accept', 'application/json');

    return this.http.get(url, {headers, observe: 'response'}).pipe(
      map((response) => {
        return response.body
      }),
      catchError((error) => this.handleError(error))
    )
  }

  handleError(response: Response | any): Observable<any>{
    const error = {
      message: response.message,
      httpStatusCode: response.status,
      error: response.error
    };
    return  throwError(error);
  }
}
