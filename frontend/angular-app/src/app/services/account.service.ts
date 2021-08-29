import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private httpClient: HttpClient,
  ) {}

  public createNewAccount(body: {[k: string]: any}): Observable<any> {
    body.confirm_success_url = "http://localhost:4200/account/login-register";
    return this.httpClient.post(
      environment.apiUrl+'/auth',
      body, 
      {headers: new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest').set('content-type','application/json'), observe: 'response'}
    )
  }
}
