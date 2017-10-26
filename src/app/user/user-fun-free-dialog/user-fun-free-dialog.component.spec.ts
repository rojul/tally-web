import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserFunFreeDialogComponent } from './user-fun-free-dialog.component';

describe('UserFunFreeDialogComponent', () => {
  let component: UserFunFreeDialogComponent;
  let fixture: ComponentFixture<UserFunFreeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserFunFreeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFunFreeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
