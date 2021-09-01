import { TestBed } from '@angular/core/testing';

import { HttpClientModule } from '@angular/common/http';
import { SessionService } from './session.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

describe('SessionService', () => {
  let service: SessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        CookieService,
        {provide: Router, useClass: MockRouter}
      ]
    });
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

export class MockRouter {
  public navigateByUrl(){}
}