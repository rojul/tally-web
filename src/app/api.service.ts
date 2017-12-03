import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { MatSnackBar } from '@angular/material';

import { environment } from '../environments/environment';
import { User } from './users';
import { Product, Wallet } from './user';
import { Transaction } from './transactions';
import { Config } from './config';
import { Metrics } from './metrics';

@Injectable()
export class ApiService {

  private url = environment.apiUrl;
  private configSubject = new ReplaySubject<Config>(1);
  private configRequest: Observable<Config>;

  constructor(
    private http: Http,
    public snackBar: MatSnackBar
  ) { }

  getConfig(refresh = false): Observable<Config> {
    if (refresh || !this.configRequest) {
      this.configRequest = this.http
      .get(this.url + '/config')
      .map(res => res.json())
      .catch(e => this.handleError(e, this));

      this.configRequest.subscribe(
        res => this.configSubject.next(res),
        err => this.configSubject.error(err)
      );
    }
    return this.configSubject.asObservable();
  }

  createTransaction(userId: number, value: number): Observable<number> {
    return this.http.post(this.url + '/users/' + userId + '/transactions', { value })
      .map(res => res.json().transactionId)
      .catch(e => this.handleError(e, this));
  }

  getTransactions(userId: number, limit: number, beforeId?: number): Observable<any> {
    const search = new URLSearchParams();
    if (beforeId) {
      search.set('before', beforeId.toString());
    }
    search.set('limit', limit.toString());
    return this.http
      .get(this.url + '/users/' + userId + '/transactions', { search })
      .map(res => res.json())
      .catch(e => this.handleError(e, this));
  }

  deleteTransaction(transactionId: number): Observable<number> {
    return this.http.delete(this.url + '/transactions/' + transactionId)
      .map(res => res.json())
      .catch(e => this.handleError(e, this));
  }

  createUser(name: string): Observable<number> {
    return this.http.post(this.url + '/users', { name })
      .map(res => res.json().userId)
      .catch(e => this.handleError(e, this));
  }

  getUser(userId: number): Observable<Wallet> {
    return this.http.get(this.url + '/users/' + userId)
      .map(res => res.json())
      .catch(e => this.handleError(e, this));
  }

  updateUser(userId: number, name: string): Observable<void> {
    return this.http.put(this.url + '/users/' + userId, { name })
      .map(res => res.json())
      .catch(e => this.handleError(e, this));
  }

  removeUser(userId: number): Observable<void> {
    return this.http.delete(this.url + '/users/' + userId)
      .map(res => res.json())
      .catch(e => this.handleError(e, this));
  }

  getProducts(): Observable<Product[]> {
    return this.http.get(this.url + '/products')
      .map(res => res.json().products)
      .map(products => products.sort((p1, p2) => p1.price > p2.price))
      .catch(e => this.handleError(e, this));
  }

  getUsers(): Observable<User[]> {
    return this.http.get(this.url + '/users')
      .map(res => res.json().users)
      .catch(e => this.handleError(e, this));
  }

  getMetrics(): Observable<Metrics> {
    return this.http.get(this.url + '/metrics')
      .map(res => res.json())
      .catch(e => this.handleError(e, this));
  }

  putRechargeAmounts(value: number[]): Observable<void> {
    return this.putConfigValue('recharge', value);
  }

  bulkProductUpdate(patch: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const promises: Promise<any>[] = [];
      for (const productId of patch.delete) {
        promises.push(this.http.delete(this.url + '/products/' + productId)
          .map(res => res.json())
          .toPromise());
      }
      for (const product of patch.create) {
        promises.push(this.http.post(this.url + '/products/', product)
          .map(res => res.json())
          .toPromise());
      }
      for (const product of patch.update) {
        promises.push(this.http.put(this.url + '/products/' + product.id, product)
          .map(res => res.json())
          .toPromise());
      }
      Promise.all(promises).then(results => {
        resolve(results);
      }).catch(err => {
        console.log('products bulk update error:', err);
        this.say('Fehler beim Update der Produkte');
        reject(err);
      });
    });
  }

  updateGeneralConfig(config: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const promises: Promise<any>[] = [];
      for (const key of Object.keys(config)) {
        const value = config[key];
        if (value !== null) {
          promises.push(this.http.put(this.url + '/config/' + key, { value })
            .map(res => res.json())
            .toPromise());
        } else {
          promises.push(this.http.delete(this.url + '/config/' + key)
            .map(res => res.json())
            .toPromise());
        }
      }
      Promise.all(promises).then(results => {
        resolve(results);
      }).catch(err => {
        console.log('config bulk update error:', err);
        this.say('Fehler beim Update der Einstellungen');
        reject(err);
      });
    });
  }

  private putConfigValue(key: string, value: any): Observable<void> {
    return this.http.put(this.url + '/config/' + key, { value })
      .map(res => res.json())
      .catch(e => this.handleError(e, this));
  }

  private handleError(res: any, that: ApiService) {
    try {
      res._body = JSON.parse(res._body);
    } catch (err) {}

    if (res.status === 0) {
      that.say('Verbindungsfehler');
    } else if (res._body && res._body.error) {
      that.say('Fehler:', res._body.error);
    } else {
      if (res.status === 400) {
        that.say('Validierungsfehler');
      } else {
        that.say('Unbekannter Fehler');
      }
      console.error('Error:', res);
    }

    return Promise.reject(res);
  }

  private say(...msg: string[]) {
    this.snackBar.open(msg.join(' '), 'OK', {
      duration: 3000
    });
  }

}
