import { Component, forwardRef, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { MdInput } from '@angular/material';

@Component({
  selector: 'euro-input',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EuroInputComponent),
    multi: true
  }],
  templateUrl: './euro-input.component.html',
  styleUrls: ['./euro-input.component.css']
})
export class EuroInputComponent implements ControlValueAccessor {
  @ViewChild('elem') elem: MdInput;
  @Input() placeholder: string;

  private onTouchedCallback: () => void = () => { };
  private onChangeCallback: (_: any) => void = () => { };
  private static valRegex = /^\d*[.,]?\d{0,2}/;
  private _value = '';

  get value() {
    return this._value;
  }

  set value(value) {
    if (value === this._value)
      return
    this._value = value
    this.onChangeCallback(this.intValue());
  }

  intValue() {
    let value = Math.round(Number(this._value.replace(',', '.')) * 100)
    if (isNaN(value) || value < 1)
      return
    let match = EuroInputComponent.valRegex.exec(this._value.trim())
    let matchValue = match ? match[0] : '';
    if (matchValue == this._value)
      return value
  }

  writeValue(value: any) {
    if (value) {
      this._value = Math.abs(value / 100).toFixed(2).replace('.', ',')
    }
  }

  focus() {
    this.elem.focus();
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