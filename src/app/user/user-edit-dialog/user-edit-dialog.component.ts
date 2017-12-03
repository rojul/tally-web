import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ApiService } from '../../api.service';
import { Wallet } from '../wallet.model';

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.css']
})
export class UserEditDialogComponent implements OnInit {
  name = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public wallet: Wallet,
    public dialogRef: MatDialogRef<UserEditDialogComponent>,
    private apiService: ApiService
  ) {
    this.name = wallet.name;
  }

  ngOnInit() {
  }

  clickOk() {
    if (this.name) {
      this.dialogRef.close(this.name);
    }
  }
}
