import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-euro',
  templateUrl: './euro.component.html',
  styleUrls: ['./euro.component.css']
})
export class EuroComponent {
  @Input() value: number;
  @Input() colored?: boolean;
  @Input() sign?: boolean;

  get valueString(): string {
    let val = Math.abs(this.value / 100).toFixed(2).replace('.', ',');
    if (this.sign && this.value < 0) {
      val = '-' + val;
    } else if (this.sign && this.value > 0) {
      val = '+' + val;
    }
    return val;
  }

  get className(): string {
    if (this.colored !== undefined && !this.colored) {
      return '';
    } else if (this.value < 0) {
      return 'euro-minus';
    } else if (this.value > 0) {
      return 'euro-plus';
    } else {
      return 'euro-zero';
    }
  }

}
