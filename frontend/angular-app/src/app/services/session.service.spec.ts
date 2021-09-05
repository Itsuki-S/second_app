import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SessionService } from './session.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpHeaders, HttpResponse, HttpErrorResponse } from '@angular/common/http';

describe('SessionService', () => {
  let service: SessionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {provide: CookieService, useClass: MockCookieService},
        {provide: Router, useClass: MockRouter}
      ]
    });
    service = TestBed.inject(SessionService);
    httpMock = TestBed.inject(HttpTestingController)
  });

  describe('destroy', () => {
    beforeEach(() => {
      spyOn<any>(service, 'deleteCookie')
    });

    it('deleteCookieが呼ばれること', () => {
      service.destroy()
      expect(service['deleteCookie']).toHaveBeenCalled();
    });

    it('ログインページへリダイレクトされること', () => {
      service.destroy()
      expect(service.router.navigateByUrl).toHaveBeenCalledWith('/account/login-register')
    });
  });

  describe('create', () => {
    beforeEach(() => {
      spyOn<any>(service, 'setSession');
      service.create({}).subscribe();
    });

    afterEach(()=>{
      httpMock.verify();
    });

    it('postリクエストが送られること', () => {
      const req = httpMock.expectOne(environment.apiUrl+'/auth/sign_in');
      expect(req.request.method).toBe('POST');
    });

    describe('リクエストが成功した場合', () => {
      it('setSessionが呼ばれること', () => {
        const req = httpMock.expectOne(environment.apiUrl+'/auth/sign_in');
        const responseBody = {test: 'test'};
        req.flush(responseBody);
        expect(service.setSession).toHaveBeenCalledWith(
          new HttpResponse({
            status: 200, 
            statusText: 'OK',
            url: environment.apiUrl+'/auth/sign_in',
            body: responseBody
          })
        )
      });
    });

    describe('リクエストが失敗した場合', () => {
      it('setSessionが呼ばれないこと', () => {
        const emsg = 'deliberate 404 error';
        const req = httpMock.expectOne(environment.apiUrl+'/auth/sign_in');
        req.flush(emsg, { status: 404, statusText: 'Not Found' });
        expect(service.setSession).not.toHaveBeenCalled();
      });
    });
  });

  describe('setSession', () => {
    beforeEach(() => {
      spyOn<any>(service, 'deleteCookie');
      service.setSession(
        new HttpResponse({
          headers: new HttpHeaders({
            'access-token': 'test',
            'uid': 'test.mail.com',
            'client': 'test'
          }),
          status: 200, 
          statusText: 'OK',
        })
      )
    });

    it('deleteCookieが呼ばれること', () => {
      // @ts-ignore
      expect(service.deleteCookie).toHaveBeenCalled()
    });
    
    it('access-tokenを保存すること', () => {
      const secureFlag = location.protocol === 'https:' ? true : false;
      // @ts-ignore
      expect(service.cookieService.set).toHaveBeenCalledWith('access-token', 'test', 14, '/', undefined, secureFlag, 'Lax')
    });
    
    it('uidを保存すること', () => {
      const secureFlag = location.protocol === 'https:' ? true : false;
      // @ts-ignore
      expect(service.cookieService.set).toHaveBeenCalledWith('uid', 'test.mail.com', 14, '/', undefined, secureFlag, 'Lax')
    });
    
    it('clientを保存すること', () => {
      const secureFlag = location.protocol === 'https:' ? true : false;
      // @ts-ignore
      expect(service.cookieService.set).toHaveBeenCalledWith('client', 'test', 14, '/', undefined, secureFlag, 'Lax')
    });

    it('ダッシュボードへリダイレクトされること', () => {
      expect(service.router.navigateByUrl).toHaveBeenCalledWith('/panel/dashboard')
    });
  });

  describe('deleteCookie', () => {
    beforeEach(() => {
      // @ts-ignore
      service.deleteCookie();
    });

    it('access-tokenを削除すること', () => {
      // @ts-ignore
      expect(service.cookieService.delete).toHaveBeenCalledWith('access-token', '/')
    });
    
    it('uidを削除すること', () => {
      // @ts-ignore
      expect(service.cookieService.delete).toHaveBeenCalledWith('uid', '/')
    });
    
    it('clientを削除すること', () => {
      // @ts-ignore
      expect(service.cookieService.delete).toHaveBeenCalledWith('client', '/')
    });
  });
  
  describe('checkToken', () => {  
    afterEach(()=>{
      httpMock.verify();
    });
    
    it('getリクエストが送られること', () => {
      // @ts-ignore
      service.checkToken('test', 'test.mail.com', 'testtest').subscribe();
      const req = httpMock.expectOne(environment.apiUrl+'/auth/validate_token');
      expect(req.request.method).toBe('GET');
      expect(req.request.headers).toEqual(
        new HttpHeaders().set('access-token', 'test').set('uid', 'test.mail.com').set('client', 'testtest')
      )
    });
      
    describe('リクエストが成功した場合', ()=>{
      it('trueが返されること', () => {
        let response: any;
        // @ts-ignore
        service.checkToken('test', 'test.mail.com', 'testtest').subscribe(
          success => {response = success}
        );
        const req = httpMock.expectOne(environment.apiUrl+'/auth/validate_token');
        req.flush({});
        expect(response.status).toEqual(200);
      });
    });
    
    describe('リクエストが失敗した場合', ()=>{
      it('errorが返されること', () => {
        let errResponse: any;
        const emsg = 'deliberate 404 error';
        // @ts-ignore
        service.checkToken('test', 'test.mail.com', 'testtest').subscribe(
          () => {},
          error => {errResponse = error}
        );
        const req = httpMock.expectOne(environment.apiUrl+'/auth/validate_token');
        req.flush(emsg, { status: 404, statusText: 'Not Found' });
        expect(errResponse.error).toEqual(emsg);
      });
    });
  });

  describe('authCheck', () => {
    beforeEach(() => {
      spyOn<any>(service, 'deleteCookie');
    });

    it('access-tokenが取得される', () => {
      // @ts-ignore
      spyOn<any>(service.cookieService, 'get');
      service.authCheck();
      // @ts-ignore
      expect(service.cookieService.get).toHaveBeenCalledWith('access-token')
    });
    
    it('uidが取得される', () => {
      // @ts-ignore
      spyOn<any>(service.cookieService, 'get');
      service.authCheck();
      // @ts-ignore
      expect(service.cookieService.get).toHaveBeenCalledWith('uid') 
    });
    
    it('clientが取得される', () => {
      // @ts-ignore
      spyOn<any>(service.cookieService, 'get');
      service.authCheck();
      // @ts-ignore
      expect(service.cookieService.get).toHaveBeenCalledWith('client')
    });

    describe('cookieにログイン情報が保存されていない場合', () => {
      it('deleteCookieが呼ばれること', () => {
        // @ts-ignore
        spyOn<any>(service.cookieService, 'get');
        service.authCheck();
        // @ts-ignore
        expect(service.deleteCookie).toHaveBeenCalled()
      });

      it('Observable: falseを返すこと', () => {
        let result: any;
        // @ts-ignore
        spyOn<any>(service.cookieService, 'get');
        service.authCheck().subscribe(
          res => {result = res}
        );
        expect(result).toBeFalsy();
      });
    });

    describe('cookieにログイン情報が保存されている場合', () => {
      describe('トークンが正当である時', () => {
        it('Observable: trueを返すこと', () => {
          let response: any;
          service.authCheck().subscribe(
            res => { response = res }
          );
          const req = httpMock.expectOne(environment.apiUrl+'/auth/validate_token');
          req.flush({});
          expect(response).toBeTruthy()
        });
      });
      
      describe('トークンが不正である時', () => {
        it('deleteCookieが呼ばれること', () => {
          service.authCheck().subscribe();
          const req = httpMock.expectOne(environment.apiUrl+'/auth/validate_token');
          req.flush('test error', { status: 404, statusText: 'Not Found' });
          // @ts-ignore
          expect(service.deleteCookie).toHaveBeenCalled();
        });
        
        it('Observable:falseを返すこと', () => {
          let errResponse: any;
          service.authCheck().subscribe(
            res => { errResponse = res }
          );
          const req = httpMock.expectOne(environment.apiUrl+'/auth/validate_token');
          req.flush('test error', { status: 404, statusText: 'Not Found' });
          expect(errResponse).toBeFalsy();
        });
      });
    });
  });
});

export class MockRouter {
  navigateByUrl = jasmine.createSpy('navigateByUrl')
}

export class MockCookieService {
  set = jasmine.createSpy('set');
  delete = jasmine.createSpy('delete');
  public get(str: string) {
    return str;
  };
}