import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Router } from '@angular/router';

import { ApiService } from '../../api.service';

@Component({
  selector: 'app-user-remove-dialog',
  templateUrl: './user-remove-dialog.component.html',
  styleUrls: ['./user-remove-dialog.component.css']
})
export class UserRemoveDialogComponent implements OnInit {

  constructor(
    public dialogRef: MdDialogRef<UserRemoveDialogComponent>,
    private router: Router,
    private apiService: ApiService,
  ) { }

  ngOnInit() {
  }

  clickOk() {
    this.dialogRef.close(true)
  }

}
