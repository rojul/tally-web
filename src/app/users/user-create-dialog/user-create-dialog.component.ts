import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';

import { ApiService } from '../../api.service';

@Component({
  selector: 'app-user-create-dialog',
  templateUrl: './user-create-dialog.component.html',
  styleUrls: ['./user-create-dialog.component.css']
})
export class UserCreateDialogComponent implements OnInit {
  name: string;

  constructor(
    public dialogRef: MatDialogRef<UserCreateDialogComponent>,
    private router: Router,
    private apiService: ApiService
  ) { }

  ngOnInit() {
  }

  clickOk() {
    if (this.name) {
      return this.createUser(this.name);
    }
  }

  private createUser(name: string) {
    this.apiService.createUser(name).subscribe(id => {
      this.dialogRef.close();
      this.router.navigate(['/users', id]);
    });
  }
}
