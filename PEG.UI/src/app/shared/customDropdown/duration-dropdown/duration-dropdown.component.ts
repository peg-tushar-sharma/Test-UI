import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';
import { GlobalService } from '../../../global/global.service';
import { PipelineQuantifier } from '../../enums/pipelineQuantifier'



const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_BACKSPACE = 8;
const KEY_DELETE = 46;
const KEY_F2 = 113;
const KEY_ENTER = 13;
const KEY_TAB = 9;


@Component({
  selector: 'app-durationdropdown',
  templateUrl: './duration-dropdown.component.html',
  styleUrls: ['./duration-dropdown.component.scss']
})
export class DurationDropdownComponent implements ICellEditorAngularComp, AfterViewInit {

  public params;
  public quantifier = [];
  public startDuration: any;
  public endDuration: any;
  public mDescription: any;
  public isValid:boolean = true;

  public errorDuration = {
    startDuration: false,
    endDuration: false
  };

  @ViewChild('inputStartDuration', { read: ViewContainerRef }) public inputStartDuration;

  constructor(private globalService: GlobalService) { }

  ngAfterViewInit() {
    setTimeout(() => {
      this.inputStartDuration.element.nativeElement.focus();
    });
  }

  getValue() {
    if(this.isValid)
    {
    this.params.data.duration.quantifier = this.mDescription;
    this.params.data.duration.startDuration = (this.startDuration && this.startDuration != '') ? this.startDuration : 0;
    this.params.data.duration.endDuration = (this.endDuration && this.endDuration != '') ? this.endDuration : 0;
    }
    return this.getDuration();
  }

  

getDuration(){
  let duration = '';
  if (this.params.data && this.params.data.duration && this.params.data.duration.startDuration) {
      duration = this.params.data.duration.startDuration;
      if (this.params.data && this.params.data.duration && this.params.data.duration.endDuration) {
          duration = duration + ' - ' + this.params.data.duration.endDuration;
      }

      if (this.params.data && this.params.data.duration && this.params.data.duration.quantifier) {
          duration = duration + '' + this.params.data.duration.quantifier;
      }
  }
  else {
      duration = (this.params.data && this.params.data.duration && this.params.data.duration.quantifier) ? this.params.data.duration.quantifier : ''
  }
  return duration;
}


  isPopup?(): boolean {
    return true
  }

  selectOption(event) {
    if (event.target) {
      this.mDescription = event.target.innerHTML;
    }
  }

  agInit(params): void {
    this.globalService.getPipelineQuantifier(PipelineQuantifier.Duration).subscribe(res => {
      this.quantifier = res;
    })
    this.params = params;

    this.mDescription = (this.params && this.params.data.duration) ? this.params.data.duration.quantifier : '';
    this.startDuration = (this.params && this.params.data.duration) ? (this.params.data.duration.startDuration == 0) ? '' : this.params.data.duration.startDuration : '';
    this.endDuration = (this.params && this.params.data.duration) ? (this.params.data.duration.endDuration == 0) ? '' : this.params.data.duration.endDuration : '';
  }



  //Returns true only when start duration is valid and has some value
  isStartDurationValid(): boolean {
    var isDisabled = true
    if (this.startDuration != undefined && this.startDuration != '' && !this.errorDuration.startDuration) {
      isDisabled = false;

    }

    return isDisabled

  }


  private getCharCodeFromEvent(event: any): any {
    event = event || window.event;
    return typeof event.which == 'undefined' ? event.keyCode : event.which;
  }

  private isCharNumeric(charStr: string): boolean {
    return !!/\d/.test(charStr);
  }

  private isKeyPressedNumeric(event: any): boolean {
    const charCode = this.getCharCodeFromEvent(event);
    const charStr = event.key ? event.key : String.fromCharCode(charCode);
    return this.isCharNumeric(charStr);
  }

  private deleteOrBackspace(event: any) {
    return (
      [KEY_DELETE, KEY_BACKSPACE].indexOf(this.getCharCodeFromEvent(event)) > -1
    );
  }

  private isTab(event: any) {
    const charCode = this.getCharCodeFromEvent(event);

    return charCode === KEY_TAB;
  }

  private isLeftOrRight(event: any) {
    return [37, 39].indexOf(this.getCharCodeFromEvent(event)) > -1;
  }

  private finishedEditingPressed(event: any) {
    const charCode = this.getCharCodeFromEvent(event);
    return charCode === KEY_ENTER || charCode === KEY_TAB;
  }

  onKeyDown(event: any): void {

    if (this.isTab(event)) {
      event.stopPropagation();
      return;
    }

    if (this.isLeftOrRight(event) || this.deleteOrBackspace(event)) {
      event.stopPropagation();
      return;
    }

    if (
      !this.finishedEditingPressed(event) && !this.isKeyPressedNumeric(event)) {
      if (event.preventDefault) event.preventDefault();
    }
  }

  onKeyDownquantifier(event: any, i: any) {

    const keyCode = event.keyCode;

    const isNavigationKey = keyCode === KEY_TAB || KEY_DOWN || KEY_UP;
    const isStopEditing = keyCode === KEY_ENTER;

    if (isNavigationKey && (this.quantifier.length - 1) != i) {
      // this stops the grid from receiving the event and executing keyboard navigation
      event.stopPropagation();
    }

    if (isStopEditing) {
      this.getValue();
      this.params.api.stopEditing();
    }

  }

  validation(event: any, type: any) {

    let isBlankValue = (event.target.value == '') ? true : false;

    switch (type) {
      case 'startDuration':
        if (isBlankValue) {
          (this.endDuration && parseInt(this.endDuration) > 0) ? this.errorDuration.startDuration = true : this.errorDuration.startDuration = false;
        }
        else {

          (parseInt(event.target.value) > parseInt(this.endDuration) ? this.errorDuration.startDuration = true : this.errorDuration.startDuration = false);
        }

        break;
      case 'endDuration':
        if (!isBlankValue) {
          (parseInt(event.target.value) < parseInt(this.startDuration) ? this.errorDuration.endDuration = true : this.errorDuration.endDuration = false);
        }
        else{
          this.errorDuration.endDuration = false;
        }

        break

    }

    if(this.errorDuration.startDuration || this.errorDuration.endDuration)
    {
      this.isValid = false;
    }
    else{
      this.isValid = true;
    }
  }

}
