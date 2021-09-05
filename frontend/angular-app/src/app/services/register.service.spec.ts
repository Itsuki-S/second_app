import { TestBed } from '@angular/core/testing';

import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegisterService } from './register.service';
import { environment } from 'src/environments/environment';

describe('RegisterService', () => {
  let service: RegisterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(RegisterService);
    httpMock = TestBed.inject(HttpTestingController)
  });

  describe('createNewAccount', () => {
    afterEach(()=>{
      httpMock.verify();
    });

    it('postリクエストが送られること', () => {
      service.createNewAccount({test: 'test'}).subscribe();
      const req = httpMock.expectOne(environment.apiUrl+'/auth');
      expect(req.request.method).toBe('POST');
    });

    describe('リクエストが成功した場合', () => {
      it('successが返されること', () => {
        let response: any;
        service.createNewAccount({test: 'test'}).subscribe(
          success => {response = success}
        )
        const req = httpMock.expectOne(environment.apiUrl+'/auth');
        req.flush({});
        expect(response.status).toEqual(200);
      });
    });
    
    describe('リクエストが失敗した場合', ()=>{
      it('errorが返されること', () => {
        let errResponse: any;
        const emsg = 'deliberate 404 error';
        service.createNewAccount({test: 'test'}).subscribe(
          () => {},
          error => {errResponse = error}
        );
        const req = httpMock.expectOne(environment.apiUrl+'/auth');
        req.flush(emsg, { status: 404, statusText: 'Not Found' });
        expect(errResponse.error).toEqual(emsg);
      })
    });
  });
});
