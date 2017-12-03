import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

import { ApiService } from '../../api.service';
import { Transaction } from '../transaction.model';

@Component({
  selector: 'app-transaction-delete-dialog',
  templateUrl: './transaction-delete-dialog.component.html',
  styleUrls: ['./transaction-delete-dialog.component.css']
})
export class TransactionDeleteDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public transaction: Transaction,
    public dialogRef: MatDialogRef<TransactionDeleteDialogComponent>,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit() {
  }

  clickOk() {
    this.dialogRef.close(true);
  }

}
