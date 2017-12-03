import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { Product } from '../product.model';

@Component({
  selector: 'app-user-fun-free-dialog',
  templateUrl: './user-fun-free-dialog.component.html',
  styleUrls: ['./user-fun-free-dialog.component.css']
})
export class UserFunFreeDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public product: Product
  ) { }

  ngOnInit() {
  }

}
