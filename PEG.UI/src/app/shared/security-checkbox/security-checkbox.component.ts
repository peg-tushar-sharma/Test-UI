import { Component, OnInit, Input, EventEmitter, Output, SimpleChanges, OnChanges } from '@angular/core';

@Component({
  selector: 'security-checkbox',
  templateUrl: './security-checkbox.component.html',
  styleUrls: ['./security-checkbox.component.scss'],
})
export class SecurityCheckboxComponent implements OnInit {  

  @Input()
  labelText:string;

  @Input()
  controlName:string;

  @Input()
  accessTierId:number;

  @Input()
  isChecked:any;

  @Input()
  employeeCode:string;

  @Input()
  property:string;

  @Input()
  tabName:string;

  @Output()
  public outSecurityValue = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {    
  }

  updateValue(value) {
    let emittedVal: any = {};
    emittedVal.employeeCode = this.employeeCode;
    emittedVal.property = this.property;
    emittedVal.value = value;
    emittedVal.tab = this.tabName;
    this.outSecurityValue.emit(emittedVal);
  }

  
  ngOnChanges(changes: SimpleChanges) {
    if(changes != undefined && changes.hasOwnProperty('accessTierId')){
      this.accessTierId =  changes.accessTierId.currentValue;
    }
 }

}
