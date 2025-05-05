import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';

@Component({
  selector: 'app-radio-list-select',
  templateUrl: './radio-list-select.component.html',
  styleUrls: ['./radio-list-select.component.scss']
})

export class RadioListSelectComponent implements OnInit, OnChanges {


  @Input()
  id: string;


  @Input()
  options: any;


  @Input()
  selectedValue: any;

  @Input()
  isEditable: boolean;

  @Output()
  public outModelChange = new EventEmitter();

  textLabel: string;

  constructor() { }

  ngOnInit() {
    var item = this.options.filter((item) => item.id == this.selectedValue)[0];
    if (item != undefined) {
      this.textLabel = item.name;
    }

  }
  updateValue(value) {
    this.outModelChange.emit(value);

  }
  ngOnChanges(changes: SimpleChanges) {
    this.selectedValue = changes.selectedValue.currentValue;

  }
}
