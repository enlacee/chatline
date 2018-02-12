import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginFormAdminComponent } from './login-form-admin.component';

describe('LoginFormAdminComponent', () => {
  let component: LoginFormAdminComponent;
  let fixture: ComponentFixture<LoginFormAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginFormAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginFormAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
