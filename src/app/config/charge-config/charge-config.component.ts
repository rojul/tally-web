import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';

import { ApiService } from '../../api.service';
import { EuroInputComponent } from '../../shared';

class TmpCharge {
  value: string;
}

@Component({
  selector: 'app-charge-config',
  templateUrl: './charge-config.component.html',
  styleUrls: ['./charge-config.component.css']
})
export class ChargeConfigComponent implements OnInit {

  @ViewChildren(EuroInputComponent) inputs: QueryList<EuroInputComponent>;
  unchangedCharges: Number[] = [];
  charges: TmpCharge[] = [];
  loading = true;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.getChargeDefaults();
  }

  private getChargeDefaults() {
    this.loading = true;
    this.apiService.getChargeDefaults().subscribe(charges => {
      this.unchangedCharges = charges.sort((a, b) => a - b);
      this.charges = charges.map(charge => {
        return {
          value: charge.toString()
        }
      })
      this.loading = false;
    })
  }

  cancel() {
    this.getChargeDefaults()
  }

  saveData() {
    return this.charges.map(charge => Number(charge.value));
  }

  isValid() {
    for (let charge of this.charges) {
      if (!charge.value)
        return false
    }
    return true
  }

  save() {
    this.loading = true;
    let charges = this.saveData();
    this.apiService.putRechargeAmounts(charges).subscribe(() => {
      this.getChargeDefaults()
      // TODO error handling
    })
  }

  create() {
    this.charges.push({
      value: ''
    })
    setTimeout(() => { // HACK
      this.inputs.last.focus();
    }, 0)

  }

  remove(charge: TmpCharge) {
    let index = this.charges.indexOf(charge);
    this.charges.splice(index, 1);
  }

  isChanged() {
    if (this.charges.length != this.unchangedCharges.length)
      return true;
    let charges = this.saveData().sort((a, b) => a - b);
    for (let i = 0; i < charges.length; i++) {
      if (charges[i] != this.unchangedCharges[i])
        return true
    }
    return false
  }

}
