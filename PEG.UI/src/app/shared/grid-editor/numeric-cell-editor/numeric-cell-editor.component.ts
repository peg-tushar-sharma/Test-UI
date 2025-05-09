import { AfterViewInit, Component, ViewChild, ViewContainerRef, } from '@angular/core';
import { AgEditorComponent, ICellEditorAngularComp } from 'ag-grid-angular';

const KEY_BACKSPACE = 8;
const KEY_DELETE = 46;
const KEY_F2 = 113;
const KEY_ENTER = 13;
const KEY_TAB = 9;
@Component({
  selector: 'app-numeric-cell-editor',
  templateUrl: './numeric-cell-editor.component.html',
  styleUrls: ['./numeric-cell-editor.component.scss']
})
export class NumericCellEditorComponent implements AgEditorComponent {

  private params: any;
  public value: number;
  public highlightAllOnFocus: boolean = true;
  private cancelBeforeStart: boolean = false;

  @ViewChild('input', { read: ViewContainerRef }) public input: any;

  agInit(params: any): void {
    this.params = params;
    this.setInitialState(this.params);

    // only start edit if key pressed is a number, not a letter
    this.cancelBeforeStart =
      params.charPress && '1234567890'.indexOf(params.charPress) < 0;
  }

  setInitialState(params: any) {
    let startValue;
    let highlightAllOnFocus = true;

    if (params.keyPress === KEY_BACKSPACE || params.keyPress === KEY_DELETE) {
      // if backspace or delete pressed, we clear the cell
      startValue = '';
    } else if (params.charPress) {
      // if a letter was pressed, we start with the letter
      startValue = params.charPress;
      highlightAllOnFocus = false;
    } else {
      // otherwise we start with the current value
      startValue = params.value;
      if (params.keyPress === KEY_F2) {
        highlightAllOnFocus = false;
      }
    }

    this.value = startValue;
    this.highlightAllOnFocus = highlightAllOnFocus;
  }

  getValue(): any {
    let value;
    if (this.value) {
      value = this.value > 100 ? 100 : Math.fround(this.value);
    } else {
      value = ''
    }
    return value;
  }

  isCancelBeforeStart(): boolean {
    if (this.value != undefined && this.value <= 0) {
      this.value = undefined;
    }
    return this.cancelBeforeStart;
  }

  // // will reject the number if it greater than 1,000,000
  // // not very practical, but demonstrates the method.
  // isCancelAfterEnd(): boolean {
  //    return this.value > 100;

  // }

  onKeyDown(event: any): void {
    if (this.isLeftOrRight(event) || this.deleteOrBackspace(event)) {
      event.stopPropagation();
      return;
    }

    if (
      !this.finishedEditingPressed(event) && !this.isKeyPressedNumeric(event)) {
      if (event.preventDefault) event.preventDefault();
    }
  }

  // dont use afterGuiAttached for post gui events - hook into ngAfterViewInit instead for this
  ngAfterViewInit() {
    window.setTimeout(() => {
      this.input.element.nativeElement.focus();
      if (this.highlightAllOnFocus) {
        this.input.element.nativeElement.select();

        this.highlightAllOnFocus = false;
      } else {
        // when we started editing, we want the carot at the end, not the start.
        // this comes into play in two scenarios: a) when user hits F2 and b)
        // when user hits a printable character, then on IE (and only IE) the carot
        // was placed after the first character, thus 'apply' would end up as 'pplea'
        const length = this.input.element.nativeElement.value
          ? this.input.element.nativeElement.value.length
          : 0;
        if (length > 0) {
          this.input.element.nativeElement.setSelectionRange(length, length);
        }
      }

      this.input.element.nativeElement.focus();
    });
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

  private isLeftOrRight(event: any) {
    return [37, 39].indexOf(this.getCharCodeFromEvent(event)) > -1;
  }

  private finishedEditingPressed(event: any) {
    const charCode = this.getCharCodeFromEvent(event);
    return charCode === KEY_ENTER || charCode === KEY_TAB;
  }

}
