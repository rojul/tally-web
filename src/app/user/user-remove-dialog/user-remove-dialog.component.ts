import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';

import { ApiService } from '../../api.service';
import { Wallet } from '../wallet.model';

@Component({
  selector: 'app-user-remove-dialog',
  templateUrl: './user-remove-dialog.component.html',
  styleUrls: ['./user-remove-dialog.component.css']
})
export class UserRemoveDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public wallet: Wallet,
    public dialogRef: MatDialogRef<UserRemoveDialogComponent>,
    private router: Router,
    private apiService: ApiService,
  ) { }

  ngOnInit() {
  }

  clickOk() {
    this.dialogRef.close(true);
  }

}
