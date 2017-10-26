import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';

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
export class ChargeConfigComponent implements OnInit, OnDestroy {

  @ViewChildren(EuroInputComponent) inputs: QueryList<EuroInputComponent>;

  unchangedCharges: Number[] = [];
  charges: TmpCharge[] = [];
  loading = true;
  config$;

  constructor(
    private apiService: ApiService
  ) { }

  ngOnInit() {
    this.getChargeDefaults();
  }

  ngOnDestroy() {
    this.config$.unsubscribe();
  }

  private getChargeDefaults() {
    this.loading = true;
    this.config$ = this.apiService.getConfig(true).subscribe(config => {
      const charges = config.recharge;
      this.unchangedCharges = charges.sort((a, b) => a - b);
      this.charges = charges.map(charge => {
        return {
          value: charge.toString()
        };
      });
      this.loading = false;
    });
  }

  cancel() {
    this.getChargeDefaults();
  }

  saveData() {
    return this.charges.map(charge => Number(charge.value));
  }

  isValid() {
    for (const charge of this.charges) {
      if (!charge.value) {
        return false;
      }
    }
    return true;
  }

  save() {
    this.loading = true;
    const charges = this.saveData();
    this.apiService.putRechargeAmounts(charges).subscribe(() => {
      this.getChargeDefaults();
    }, err => {
      this.loading = false;
    });
  }

  create() {
    this.charges.push({
      value: ''
    });
    setTimeout(() => { // HACK
      this.inputs.last.focus();
    }, 0);

  }

  remove(charge: TmpCharge) {
    const index = this.charges.indexOf(charge);
    this.charges.splice(index, 1);
  }

  isChanged() {
    if (this.charges.length !== this.unchangedCharges.length) {
      return true;
    }
    const charges = this.saveData().sort((a, b) => a - b);
    for (let i = 0; i < charges.length; i++) {
      if (charges[i] !== this.unchangedCharges[i]) {
        return true;
      }
    }
    return false;
  }

}
