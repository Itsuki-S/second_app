import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { SessionService } from './services/session.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedGuard implements CanActivate {
  private afterloginUrl: string = '/panel/dashboard';

  constructor(
    private sessionService: SessionService,
    private router: Router,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
    return this.sessionService.authCheck().pipe(
      map(bool => {
        if (bool == true) {
          this.router.navigateByUrl(this.afterloginUrl)
          return false;
        } else {
          return true;
        }
      })
    )
  }
}
