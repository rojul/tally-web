import { Component, forwardRef, Input, ChangeDetectorRef, ViewChild, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-euro-input',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EuroInputComponent),
    multi: true
  }],
  templateUrl: './euro-input.component.html',
  styleUrls: ['./euro-input.component.css']
})
export class EuroInputComponent implements ControlValueAccessor {

  private static readonly valRegex = /^\d*[.,]?\d{0,2}/;

  @Input() placeholder: string;

  private _value = '';
  elemFocusEventEmitter = new EventEmitter<boolean>();
  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };

  get value() {
    return this._value;
  }

  set value(value) {
    if (value === this._value) {
      return;
    }
    this._value = value;
    this.onChangeCallback(this.intValue());
  }

  intValue() {
    const value = Math.round(Number(this._value.replace(',', '.')) * 100);
    if (isNaN(value) || value < 1) {
      return;
    }
    const match = EuroInputComponent.valRegex.exec(this._value.trim());
    const matchValue = match ? match[0] : '';
    if (matchValue === this._value) {
      return value;
    }
  }

  writeValue(value: any) {
    if (value) {
      this._value = Math.abs(value / 100).toFixed(2).replace('.', ',');
    }
  }

  public focus() {
    this.elemFocusEventEmitter.emit(true);
  }

  onBlur() {
    this.onTouchedCallback();
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }
}
