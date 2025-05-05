import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'app-editable-text',
  templateUrl: './editable-text.component.html',
  styleUrls: ['./editable-text.component.scss']
})
export class EditableTextComponent implements OnInit, OnChanges {

  @Input()
  labelText: string;

  @Input()
  required: boolean = false;

  @Input()
  maxChar: number = 100;

  @Input()
  labelValue: string;


  @Input()
  registrationId: number;

  @Input()
  isEditable: false;

  @Input()
  isVisible: true;
  
  @Input()
  isMasked: false;

  @Input()
  isRowMasked: true;
  
  @Output()
  public update = new EventEmitter();

  initialValue: string;
  finalValue: string;

  showTextBox = false;

  constructor() {

  }

  ngOnInit() {
    if (!this.labelValue.trim().split('^^')[0]) {
      this.showTextBox = true;
    }
    this.finalValue = this.initialValue = this.labelValue.split('^^')[0];
  }

  toggleTextBoxVisibility() {
    this.showTextBox = !this.showTextBox;
  }

  updateValue() {
    if (this.finalValue)
      this.finalValue = this.finalValue.trim();

    this.showTextBox = !this.showTextBox;
    if (this.required) {
      if (this.finalValue && this.initialValue !== this.finalValue) {
        this.update.emit(this.finalValue);
      } else {
        this.finalValue = this.initialValue;

      }
    }
    else {
      this.update.emit(this.finalValue);
    }


    if (!this.finalValue) {
      this.showTextBox = true;
    }

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.hasOwnProperty('labelValue')) {
      this.finalValue = this.initialValue = changes.labelValue ? changes.labelValue.currentValue.split('^^')[0] : '';
      if (!this.finalValue) {
        this.showTextBox = true;
      }
      else {
        this.showTextBox = false;
      }
    }
  }


}
