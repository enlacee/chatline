import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminAssociateUserComponent } from './admin-associate-user.component';

describe('AdminAssociateUserComponent', () => {
  let component: AdminAssociateUserComponent;
  let fixture: ComponentFixture<AdminAssociateUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminAssociateUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminAssociateUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
