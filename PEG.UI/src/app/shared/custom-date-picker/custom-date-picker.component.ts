import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter,  } from '@angular/core';
import { GridValues } from '../../shared/grid-generator/grid-constants';

@Component({
  selector: 'app-custom-date-picker',
  templateUrl: './custom-date-picker.component.html',
  styleUrls: ['./custom-date-picker.component.scss']
})
export class CustomDatePickerComponent implements OnInit, OnChanges {
  @Input()
  name: string = "";
  
  @Input()
  labelText: string = "";

  @Input()
  dateValue: any;

  @Input()
  isEditable: boolean;

  @Input()
  isVisible: boolean=true;

  @Output()
  public update = new EventEmitter();

  renderDateValue: string;

  constructor() {


  }
  public datePickerOptions: any = {
    // other options...
    dateFormat: GridValues.dateFormat.toLowerCase(),
    firstDayOfWeek: 'su',
    sunHighlight: true,
    markCurrentDay: true,
    disableUntil: { day: 1, month: 1, year: 1753 }
  };

  updateValue(value: any) {
    this.update.emit(value);

  }

  ngOnInit() {
    if (this.dateValue != null && this.dateValue.jsdate != null)
      this.renderDateValue = new Date(this.dateValue.jsdate).toString()

  }

  ngOnChanges(changes: SimpleChanges)
  {
    if(changes.dateValue && changes.dateValue.currentValue)
    {
      if (changes.dateValue != null && changes.dateValue.currentValue.jsdate != null)
      {
      this.renderDateValue = new Date(this.dateValue.jsdate).toString()
      }     
    }
    else
    {
      this.renderDateValue = null;
    }
  }



}
