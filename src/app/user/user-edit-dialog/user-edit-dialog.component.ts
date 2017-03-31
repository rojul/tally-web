import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';

import { ApiService } from '../../api.service';

@Component({
  selector: 'app-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrls: ['./user-edit-dialog.component.css']
})
export class UserEditDialogComponent implements OnInit {
  name: string;

  constructor(
    public dialogRef: MdDialogRef<UserEditDialogComponent>,
    private apiService: ApiService
  ) { }

  ngOnInit() {
  }

  clickOk() {
    if (this.name)
      this.dialogRef.close(this.name);
  }
}
