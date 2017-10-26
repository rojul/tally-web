import { Component, OnInit, Inject } from '@angular/core';
import { MdDialogRef, MD_DIALOG_DATA } from '@angular/material';
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
    @Inject(MD_DIALOG_DATA) public transaction: Transaction,
    public dialogRef: MdDialogRef<TransactionDeleteDialogComponent>,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit() {
  }

  clickOk() {
    this.dialogRef.close(true);
  }

}
