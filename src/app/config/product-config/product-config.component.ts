import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';

import { ApiService } from '../../api.service';
import { Product } from '../../user';
import { NameInputComponent } from '../../shared';

class TmpProduct {
  readonly id?: number;
  name: string;
  price: string;
}
class ProductData {
  create: TmpProduct[];
  update: TmpProduct[];
  delete: number[];
}

@Component({
  selector: 'app-product-config',
  templateUrl: './product-config.component.html',
  styleUrls: ['./product-config.component.css']
})
export class ProductConfigComponent implements OnInit {

  @ViewChildren(NameInputComponent) nameInputs: QueryList<NameInputComponent>;
  unchangedProducts: Product[] = [];
  products: TmpProduct[] = [];
  deletedProducts: number[] = [];
  loading = true;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.apiService.getProducts().subscribe(products => {
      this.unchangedProducts = products;
      this.deletedProducts = [];
      this.products = products.map(product => {
        return {
          id: product.id,
          name: product.name,
          price: product.price.toString()
        }
      })
      this.loading = false;
    })
  }

  cancel() {
    this.ngOnInit()
  }

  isValid() {
    for (let product of this.products) {
      if (!product.name || !product.price)
        return false
    }
    return true
  }

  saveData(): any {
    let data: ProductData = {
      create: [],
      update: [],
      delete: this.deletedProducts
    }
    this.products.forEach(product => {
      if (product.id) {
        let unchangedProduct = this.unchangedProducts.find(up => up.id == product.id)
        if (unchangedProduct.name != product.name || unchangedProduct.price != Number(product.price))
          data.update.push(product)
      }
      else
        data.create.push(product)
    })
    return data
  }

  save() {
    this.loading = true;
    let data = this.saveData();
    this.apiService.bulkProductUpdate(data).then(results => {
      this.ngOnInit()
    }).catch(err => {
      console.log(err)
      this.ngOnInit()
    })
    
  }

  isChanged() {
    let data = this.saveData();
    return data.create.length != 0 || data.update.length != 0 || data.delete.length != 0
  }

  create() {
    this.products.push({
      name: '',
      price: ''
    })
    setTimeout(() => { // HACK
      this.nameInputs.last.focus();
    }, 0)
  }

  remove(product: TmpProduct) {
    if (product.id)
      this.deletedProducts.push(product.id)
    let index = this.products.indexOf(product);
    this.products.splice(index, 1);
  }

}
