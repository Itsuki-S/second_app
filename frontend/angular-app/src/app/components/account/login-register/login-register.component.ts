import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/services/session.service';
import { AccountService } from 'src/app/services/account.service';
import { LoginUser, RegisterUser } from './models/user';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login-register.component.html',
  styleUrls: ['./login-register.component.scss']
})
export class LoginRegisterComponent implements OnInit {
  private subscription: Subscription[] = [];
  public loginUser: LoginUser = { email: '', password: ''  };
  public registerUser: RegisterUser = { 
                        name: '',
                        email: '',
                        password: '',
                        password_confirmation: ''
                      }
  public form: NgForm;

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    private sessionService: SessionService,
    private accountService: AccountService,
  ) { }

  ngOnInit(): void {
  }

  ngOnDestroy() {
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
      this.accountService.createNewAccount(form.value).subscribe(
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


