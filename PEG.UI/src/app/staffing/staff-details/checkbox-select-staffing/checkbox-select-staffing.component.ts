import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox-select-staffing',
  templateUrl: './checkbox-select-staffing.component.html',
  styleUrls: ['./checkbox-select-staffing.component.scss']
})
export class CheckboxSelectStaffingComponent implements OnInit {

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
