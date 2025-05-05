import { Component, OnInit, Input,Output,EventEmitter } from '@angular/core';

@Component({
  selector: 'app-dropdown-select',
  templateUrl: './dropdown-select.component.html',
  styleUrls: ['./dropdown-select.component.scss']
})
export class DropdownSelectComponent implements OnInit {
  @Input()
  id: string

  @Input()
  labelName: string

  @Input()
  clearable:boolean=false;
  @Input()
  labelValue:string

  @Input()
  modelValue:any

  @Input()
  dataObject:any

  
  @Input()
  isEditable: boolean;

@Input()
selectedText:string

  @Output()
  public outModelChange = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }
  updateValue(value) {
    this.outModelChange.emit(value);

  }
}
