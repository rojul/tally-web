import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionDeleteDialogComponent } from './transaction-delete-dialog.component';

describe('TransactionDeleteDialogComponent', () => {
  let component: TransactionDeleteDialogComponent;
  let fixture: ComponentFixture<TransactionDeleteDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionDeleteDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
