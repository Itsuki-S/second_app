import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginRegisterComponent } from './login-register.component';
import { SessionService } from 'src/app/services/session.service';
import { RegisterService } from 'src/app/services/register.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginRegisterComponent', () => {
  let component: LoginRegisterComponent;
  let fixture: ComponentFixture<LoginRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginRegisterComponent ],
      imports: [
        FormsModule,
        MaterialModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatSnackBar, useClass: MockSnackBar },
        { provide: SessionService, useClass: MockSessionService },
        { provide: RegisterService, useClass: MockRegisterService },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

export class MockSessionService {
  public create(){}
}

export class MockRegisterService {
  public createNewAccount(){}
}

export class MockSnackBar {
  public open(){}
}
