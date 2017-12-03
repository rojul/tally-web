import { Component, OnInit, OnDestroy, ViewContainerRef, ViewChild, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material';

import { Transaction, TransactionDeleteDialogComponent } from '../transactions';
import { Wallet } from './wallet.model';
import { Product } from './product.model';
import { Config } from '../config';
import { ApiService } from '../api.service';
import { UserRemoveDialogComponent } from './user-remove-dialog';
import { UserEditDialogComponent } from './user-edit-dialog';
import { UserFunFreeDialogComponent } from './user-fun-free-dialog';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy {
  @ViewChild('customRechargeInput') customRechargeInput: any;

  removeUserDialogRef: MatDialogRef<UserRemoveDialogComponent>;
  editUserDialogRef: MatDialogRef<UserEditDialogComponent>;
  deleteTransactionDialogRef: MatDialogRef<TransactionDeleteDialogComponent>;
  funFreeDialogRef: MatDialogRef<UserFunFreeDialogComponent>;
  wallet: Wallet;
  products: Product[] = [];
  chargeDefaults: number[] = [];
  orderActive = true;
  customChargeShowing = false;
  customChargeValue?: number;
  loading = 0;
  fastRedirectEventEmitter = new EventEmitter<void>();
  config$;
  config: Config;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService,
    public dialog: MatDialog,
    public viewContainerRef: ViewContainerRef
  ) { }

  openRemoveUserDialog() {
    this.removeUserDialogRef = this.dialog.open(UserRemoveDialogComponent, {
      data: this.wallet
    });
    this.removeUserDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeUser();
      }
      this.removeUserDialogRef = undefined;
    });
  }

  openEditUserDialog() {
    this.editUserDialogRef = this.dialog.open(UserEditDialogComponent, {
      data: this.wallet
    });
    this.editUserDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveEditName(result);
      }
      this.editUserDialogRef = undefined;
    });
  }

  openFunFreeDialog(product: Product) {
    this.funFreeDialogRef = this.dialog.open(UserFunFreeDialogComponent, {
      data: product,
      backdropClass: 'rainbow-backdrop'
    });
    this.funFreeDialogRef.afterClosed().subscribe(result => {
      this.funFreeDialogRef = undefined;
    });
  }

  ngOnDestroy() {
    if (this.removeUserDialogRef) {
      this.removeUserDialogRef.close();
    }
    if (this.editUserDialogRef) {
      this.editUserDialogRef.close();
    }
    if (this.funFreeDialogRef) {
      this.funFreeDialogRef.close();
    }
    if (this.deleteTransactionDialogRef) {
      this.deleteTransactionDialogRef.close();
    }
    this.config$.unsubscribe();
  }

  ngOnInit() {
    this.route.params
      .map(params => params['userId'])
      .subscribe(userId => {
        this.getUser(userId);
      });

    this.loading += 2;

    this.apiService.getProducts().subscribe(products => {
      this.products = products;
      this.loading--;
    }, err => {
      this.loading--;
    });

    this.config$ = this.apiService.getConfig().subscribe(config => {
      this.config = config;
      this.loading--;
    }, err => {
      this.loading--;
    });
  }

  toggleCustomRecharge() {
    this.customChargeShowing = !this.customChargeShowing;
    if (this.customChargeShowing) {
      setTimeout(() => { // HACK
        this.customRechargeInput.focus();
      }, 0);
    } else {
      this.customChargeValue = 0;
    }
  }

  customCharge() {
    if (this.customChargeValue) {
      this.charge(this.customChargeValue);
    }
    this.toggleCustomRecharge();
  }

  charge(amount: number) {
    this.disableOrders();

    this.loading++;
    this.apiService.createTransaction(this.wallet.id, amount).subscribe(
      id => {
        // TODO move in service
        this.getUser(this.wallet.id);
        this.loading--;

        setTimeout(() => {
          this.fastRedirectEventEmitter.emit();
        }, 100);
      }, err => {
      this.loading--;
    });
  }

  openRemoveTransactionDialog(id: number) {
    this.deleteTransactionDialogRef = this.dialog.open(TransactionDeleteDialogComponent, {
      data: this.wallet.transactions.find(transaction => transaction.id === id)
    });
    this.deleteTransactionDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTransaction(id);
      }
      this.deleteTransactionDialogRef = undefined;
    });
  }

  private deleteTransaction(id: number) {
    this.loading++;
    this.apiService.deleteTransaction(id).subscribe(
      res => {
        // TODO move in service
        this.getUser(this.wallet.id);
        this.loading--;
      }, err => {
        this.loading--;
    });
  }

  private disableOrders() {
    this.orderActive = false;
    setTimeout(() => {
      this.orderActive = true;
    }, 300);
  }

  private isLucky(n?: number) {
    if (!n || n === 0) {
      return false;
    }
    return Math.floor(Math.random() * n) === 0;
  }

  private newTransaction(product: Product) {
    if (product.fun && this.config && this.isLucky(this.config.funChanceToWin)) {
      this.openFunFreeDialog(product);
      return;
    }
    const amount = product.price;
    this.charge(amount * -1);
  }

  private getUser(userId: number) {
    this.loading++;
    this.apiService.getUser(userId).subscribe(
      wallet => {
        this.wallet = wallet;
        this.loading--;
      },
      err => {
        this.loading--;
        if (err._body && err._body.error === 'user not found') {
          this.router.navigate(['/']);
        }
      });
  }

  private saveEditName(name: string) {
    this.loading++;
    this.apiService.updateUser(this.wallet.id, name).subscribe(() => {
      this.loading--;
      this.wallet.name = name;
    }, err => {
      this.loading--;
    });
  }

  private removeUser() {
    this.loading++;
    this.apiService.removeUser(this.wallet.id).subscribe(() => {
      this.router.navigate(['/']);
    }, err => {
      this.loading--;
    });
  }
}
