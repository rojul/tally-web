import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Transaction } from './transaction.model';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {

  userId: number;
  balance: number;
  transactions: any[] = [];
  beforeId: number;
  allLoaded = false;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.route.params
      .map(params => params['userId'])
      .subscribe(userId => {
        this.userId = userId
        this.reloadTransactions();
      });
  }

  reloadTransactions() {
    this.beforeId = undefined;
    this.allLoaded = false;
    this.getTransactions();
  }

  getTransactions() {
    let limit = 50
    if (this.allLoaded || this.loading)
      return
    this.loading = true;
    this.apiService.getTransactions(this.userId, limit, this.beforeId).subscribe(
      data => {
        this.loading = false;
        if (!this.beforeId) {
          this.balance = data.balance
          this.transactions = this.enrichTransactions(data.transactions, this.balance)
        } else {
          let balance = this.transactions[this.transactions.length - 1].before;
          this.transactions = this.transactions.concat(this.enrichTransactions(data.transactions, balance))
        }
        if (data.transactions.length < limit) {
          this.allLoaded = true
          return
        }
        this.beforeId = data.transactions[data.transactions.length - 1].id
      },
      err => {
        this.loading = false;
      })
  }

  deleteTransaction(id: number) {
    this.loading = true;
    this.apiService.deleteTransaction(id).subscribe(
      id => {
        this.loading = false;
        this.reloadTransactions();
      }, err => {
        this.loading = false;
    })
  }

  private enrichTransactions(transactions: Transaction[], balance: number): any[] {
    return transactions.map(transaction => {
      let after = balance;
      balance -= transaction.value;
      let before = balance;
      return {
        id: transaction.id,
        created: transaction.created,
        difference: transaction.value,
        before,
        after
      };
    })
  }
}
