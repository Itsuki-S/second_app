import { Component, OnInit, OnDestroy } from '@angular/core';
import { map } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { SessionService } from 'src/app/services/session.service';
import { RegisterService } from 'src/app/services/register.service';
import { LoginUser, RegisterUser } from './models/user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Breakpoints, BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {
  public loginUser: LoginUser = { email: '', password: ''  };
  public registerUser: RegisterUser = { 
                        name: '',
                        email: '',
                        password: '',
                        password_confirmation: ''
                      }
  public form: NgForm;
  public isMobile$: Observable<boolean> = of(false);
  public cardCol: number;

  constructor(
    private snackBar: MatSnackBar,
    private sessionService: SessionService,
    private registerService: RegisterService,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    this.isMobile$ = this.breakpointObserver.observe(Breakpoints.XSmall).pipe(
      map((state: BreakpointState) => state.matches)
    );
    this.isMobile$.subscribe((isMobile: boolean) => {
      if(isMobile){
        this.cardCol=2
      } else {
        this.cardCol=1
      }
    });
  }

  onLoginSubmit(form: NgForm): void {
    this.sessionService.create(form.value).subscribe(
      () => {},
      error => {
        this.errorSnackBar(error.message);
        this.loginUser;
      }
    )
  }

  onRegisterSubmit(form: NgForm): void {
    if(form.value.password == form.value.password_confirmation){
      this.registerService.createNewAccount(form.value).subscribe(
        success => {
          this.openSnackBar('Confimation mail is sent. Please confirm account')
        },
        error => {
          this.errorSnackBar(error.message);
        }
      )
    } else {
      this.errorSnackBar("Password_confirmation is different from Password")
    }
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "close", {
      panelClass: ['mat-toolbar', 'mat-primary']
    });
  }

  errorSnackBar(message: string) {
    this.snackBar.open(message, "close", {
      panelClass: ['mat-toolbar', 'mat-secondary']
    });
  }
}
