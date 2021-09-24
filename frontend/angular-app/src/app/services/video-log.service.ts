import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideoLogService {

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
  ) {}

  public createNewVideoLogs(body: Object): Observable<any> {
    return this.httpClient.post(
      environment.apiUrl+'/video_logs',
      body,
      { headers: this.setHeader(), observe: 'response' }
    )
  }

  public getUserVideoLogs(date_str: string): Observable<any> {
    return this.httpClient.get(
      environment.apiUrl+'/video_logs',
      { headers: this.setHeader(), params: {date_param: date_str}, observe: 'response' }
    )
  }

  private setHeader() {
    return new HttpHeaders().set('content-type','application/json').set('access-token', this.cookieService.get('access-token')).set('uid', this.cookieService.get('uid')).set('client', this.cookieService.get('client'))
  }
}
