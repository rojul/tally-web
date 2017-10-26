import { Component, forwardRef, Input, ChangeDetectorRef, ViewChild, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

class MinMaxObject {
  min: number;
  max: number;
}

@Component({
  selector: 'app-name-input',
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => NameInputComponent),
    multi: true
  }],
  templateUrl: './name-input.component.html',
  styleUrls: ['./name-input.component.css']
})
export class NameInputComponent implements ControlValueAccessor {
  @Input() length: MinMaxObject;

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
    this.onChangeCallback(this.getValue());
  }

  getValue() {
    const value = this._value.trim().replace(/ +(?= )/g, '');
    if (value.length >= this.length.min && value.length <= this.length.max) {
      return value;
    }
  }

  writeValue(value: any) {
    if (value) {
      this._value = value;
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
