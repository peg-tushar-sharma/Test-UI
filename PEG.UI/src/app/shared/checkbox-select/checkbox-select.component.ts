import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter } from '@angular/core';
import { GridValues } from '../../shared/grid-generator/grid-constants';

@Component({
  selector: 'app-checkbox-select',
  templateUrl: './checkbox-select.component.html',
  styleUrls: ['./checkbox-select.component.scss']
})
export class CheckboxSelectComponent implements OnInit {
  @Input()
  name: string = "";

  @Input()
  modelValue: any;

  @Input()
  uniqueId: string;

  @Input()
  labelText: string;
  
  @Input()
  disabled: boolean=false;

  @Input()
  isEditable: boolean;

  @Output()
  public outModelChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
  updateValue(value) {
    this.outModelChange.emit(value);

  }
  prevent(event){
    event.target.checked=!event.target.checked
  }
}
