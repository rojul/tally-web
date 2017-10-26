import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MdDialog, MdDialogRef } from '@angular/material';

import { Transaction } from './transaction.model';
import { ApiService } from '../api.service';
import { TransactionDeleteDialogComponent } from './transaction-delete-dialog';

class TmpTransaction extends Transaction {
  before: number;
  after: number;
}

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit, OnDestroy {

  userId: number;
  balance: number;
  transactions: TmpTransaction[] = [];
  beforeId: number;
  allLoaded = false;
  loading = false;
  deleteTransactionDialogRef: MdDialogRef<TransactionDeleteDialogComponent>;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    public dialog: MdDialog
  ) { }

  ngOnInit() {
    this.route.params
      .map(params => params['userId'])
      .subscribe(userId => {
        this.userId = userId;
        this.reloadTransactions();
      });
  }

  ngOnDestroy() {
    if (this.deleteTransactionDialogRef) {
      this.deleteTransactionDialogRef.close();
    }
  }

  reloadTransactions() {
    this.beforeId = undefined;
    this.allLoaded = false;
    this.getTransactions();
  }

  getTransactions() {
    const limit = 50;
    if (this.allLoaded || this.loading) {
      return;
    }
    this.loading = true;
    this.apiService.getTransactions(this.userId, limit, this.beforeId).subscribe(
      data => {
        this.loading = false;
        if (!this.beforeId) {
          this.balance = data.balance;
          this.transactions = this.enrichTransactions(data.transactions, this.balance);
        } else {
          const balance = this.transactions[this.transactions.length - 1].before;
          this.transactions = this.transactions.concat(this.enrichTransactions(data.transactions, balance));
        }
        if (data.transactions.length < limit) {
          this.allLoaded = true;
          return;
        }
        this.beforeId = data.transactions[data.transactions.length - 1].id;
      },
      err => {
        this.loading = false;
      });
  }

  openRemoveTransactionDialog(transaction: TmpTransaction) {
    this.deleteTransactionDialogRef = this.dialog.open(TransactionDeleteDialogComponent, {
      data: transaction
    });
    this.deleteTransactionDialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteTransaction(transaction);
      }
      this.deleteTransactionDialogRef = undefined;
    });
  }

  private deleteTransaction(transaction: TmpTransaction) {
    this.loading = true;
    this.apiService.deleteTransaction(transaction.id).subscribe(
      res => {
        this.loading = false;
        this.reloadTransactions();
      }, err => {
        this.loading = false;
    });
  }

  private enrichTransactions(transactions: Transaction[], balance: number): TmpTransaction[] {
    return transactions.map(transaction => {
      const after = balance;
      balance -= transaction.value;
      const before = balance;
      return {
        id: transaction.id,
        created: transaction.created,
        value: transaction.value,
        before,
        after
      };
    });
  }
}
