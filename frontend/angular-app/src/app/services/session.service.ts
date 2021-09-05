import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { RouterModule, Router } from '@angular/router';
import { catchError, map, switchMap } from 'rxjs/operators';

import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private requestedUrl: string;
  private afterloginUrl: string = '/panel/dashboard';
  private afterlogoutUrl: string = '/account/login-register';

  constructor(
    public router: Router,
    private httpClient: HttpClient,
    private cookieService: CookieService,
    ) {}
    
  // ログインリクエストをAPIに送る
  public create(body: Object): Observable<any> {
    return this.httpClient.post(
      environment.apiUrl+'/auth/sign_in',
      body, 
      {headers: new HttpHeaders().set('X-Requested-With', 'XMLHttpRequest').set('content-type','application/json'), observe: 'response'}
    ).pipe(
        map(response => {
          this.setSession(response);
        })
      );
    }
  
  // ログアウト
  public destroy() {
    this.deleteCookie()
    this.router.navigateByUrl(this.afterlogoutUrl)
  }

  // APIから送られてきたaccess-token・uid・clientをcookieに保存
  public setSession(response: any) {
    const secureFlag = location.protocol === 'https:' ? true : false;
    this.deleteCookie()
    this.cookieService.set('access-token', response.headers.get('access-token'), 14, '/', undefined, secureFlag, 'Lax');
    this.cookieService.set('uid', response.headers.get('uid'), 14, '/', undefined, secureFlag, 'Lax');
    this.cookieService.set('client', response.headers.get('client'), 14, '/', undefined, secureFlag, 'Lax');

    this.router.navigateByUrl('/panel/dashboard')
  }

  // cookieからaccess-token・uid・clientを削除
  private deleteCookie(){
    this.cookieService.delete('access-token', '/')
    this.cookieService.delete('uid', '/')
    this.cookieService.delete('client', '/')
  }

  // 
  private checkToken(accessToken: string, uid: string, client: string): Observable<any> {
    const option = {
      headers: new HttpHeaders().set('access-token', accessToken).set('uid', uid).set('client', client),
      observe: 'response' as const
    };
    return this.httpClient.get(environment.apiUrl+'/auth/validate_token', option)
  }

  // authentication.guardとauthenticated.guardのためにログイン状態にあることを確認する
  public authCheck(): Observable<boolean> {
    let accessToken = this.cookieService.get('access-token');
    let uid = this.cookieService.get('uid');
    let client = this.cookieService.get('client');
    if(accessToken && uid && client) {
      return this.checkToken(accessToken, uid, client).pipe(
        switchMap(() => {
          return of(true);
        }),
        catchError(() => {
          this.deleteCookie();
          return of(false);
        })
      )
    } else {
      this.deleteCookie();
      return of(false);
    }
  }
}
