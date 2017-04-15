import { Component, OnInit, ViewContainerRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MdDialog, MdDialogConfig, MdDialogRef, MdInputDirective } from '@angular/material';

import { Transaction } from '../transactions';
import { Wallet } from './wallet.model';
import { Product } from './product.model';
import { ApiService } from '../api.service';
import { UserRemoveDialogComponent } from './user-remove-dialog';
import { UserEditDialogComponent } from './user-edit-dialog';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  @ViewChild('customRechargeInput') customRechargeInput: MdInputDirective;

  removeUserDialogRef: MdDialogRef<UserRemoveDialogComponent>;
  editUserDialogRef: MdDialogRef<UserEditDialogComponent>;
  wallet: Wallet;
  products: Product[] = [];
  chargeDefaults: number[] = [];
  orderActive: boolean = true;
  customChargeShowing: boolean = false;
  customChargeValue?: number;
  loading = 0;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    public dialog: MdDialog,
    public viewContainerRef: ViewContainerRef
  ) { }

  openRemoveUserDialog() {
    this.removeUserDialogRef = this.dialog.open(UserRemoveDialogComponent);

    this.removeUserDialogRef.afterClosed().subscribe(result => {
      if (result)
        this.removeUser()
      this.removeUserDialogRef = undefined;
    })
  }

  openEditUserDialog() {
    this.editUserDialogRef = this.dialog.open(UserEditDialogComponent);
    this.editUserDialogRef.afterClosed().subscribe(result => {
      if (result)
        this.saveEditName(result)
      this.editUserDialogRef = undefined;
    })
  }

  ngOnDestroy() {
    if (this.removeUserDialogRef)
      this.removeUserDialogRef.close();
    if (this.editUserDialogRef)
      this.editUserDialogRef.close();
  }

  ngOnInit() {
    this.route.params
      .map(params => params['userId'])
      .subscribe(userId => {
        this.getUser(userId)
      });

    this.loading += 2;
    this.apiService.getProducts().subscribe(products => {
      this.products = products
      this.loading--;
    }, err => {
      this.loading--;
    })
    this.apiService.getChargeDefaults().subscribe(chargeDefaults => {
      this.chargeDefaults = chargeDefaults
      this.loading--;
    }, err => {
      this.loading--;
    })
  }

  toggleCustomRecharge() {
    this.customChargeShowing = !this.customChargeShowing
    if (this.customChargeShowing) {
      setTimeout(() => { // HACK
        this.customRechargeInput.focus();
      }, 0)
    } else
      this.customChargeValue = 0;
  }

  customCharge() {
    if (this.customChargeValue)
      this.charge(this.customChargeValue)
    this.toggleCustomRecharge()
  }

  charge(amount: number) {
    this.disableOrdersForSecond()
    this.loading++;
    this.apiService.createTransaction(this.wallet.id, amount).subscribe(
      id => {
        // TODO move in service
        this.getUser(this.wallet.id)
        this.loading--;
      }, err => {
      this.loading--;
    })
  }

  deleteTransaction(id: number) {
    this.loading++;
    this.apiService.deleteTransaction(id).subscribe(
      id => {
        // TODO move in service
        this.getUser(this.wallet.id)
        this.loading--;
      }, err => {
      this.loading--;
    })
  }

  private disableOrdersForSecond() { // HACK
    this.orderActive = false;
    setTimeout(() => {
      this.orderActive = true;
    }, 300)
  }

  private newTransaction(product: Product) {
    let amount = product.price;
    this.charge(amount * -1);
  }

  private getUser(userId: number) {
    this.loading++;
    this.apiService.getUser(userId).subscribe(
      wallet => {
        this.wallet = wallet
        this.loading--;
      },
      err => {
        this.loading--;
        if (err._body && err._body.error === 'user not found') {
          this.router.navigate(['/']);
        }
      })
  }
  
  private saveEditName(name: string) {
    this.loading++;
    this.apiService.updateUser(this.wallet.id, name).subscribe(() => {
      this.loading--;
      this.wallet.name = name;
    }, err => {
      this.loading--;
    })
  }

  private removeUser() {
    this.loading++;
    this.apiService.removeUser(this.wallet.id).subscribe(() => {
      this.router.navigate(['/']);
    }, err => {
      this.loading--;
    })
  }
}
