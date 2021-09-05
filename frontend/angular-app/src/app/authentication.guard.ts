import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateChild, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { SessionService } from './services/session.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate, CanActivateChild {
  private afterlogoutUrl: string = '/account/login-register';

  constructor(
    private sessionService: SessionService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.sessionService.authCheck().pipe(
      map(bool => {
        if (bool == true) {
          return true;
        } else {
          this.router.navigateByUrl(this.afterlogoutUrl)
          return false;
        }
      })
    );
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
}
