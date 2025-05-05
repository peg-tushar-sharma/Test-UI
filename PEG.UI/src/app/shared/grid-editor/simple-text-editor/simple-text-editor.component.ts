import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';
import { Field } from '../../enums/Fields';
@Component({
  selector: 'app-simple-text-editor',
  templateUrl: './simple-text-editor.component.html',
  styleUrls: ['./simple-text-editor.component.scss']
})
export class SimpleTextEditorComponent implements AgEditorComponent, AfterViewInit {

  params: any;
  inputData: string = '';
  readonly ConstatntField = Field;
  constructor() { }

  @ViewChild('input', { read: ViewContainerRef }) public input: ViewContainerRef;

  ngAfterViewInit() {
    // focus on the input
    setTimeout(() => this.input.element.nativeElement.focus());
  }
  agInit(params): void {
    this.params = params;
    if (this.params.colDef.field == this.ConstatntField.targetName) {
      this.inputData = this.params.value;
    }
    else {
      this.inputData = this.params.data[this.params.colDef.field];
    }

  }
  getValue(): any {
    if (this.params.colDef.field == this.ConstatntField.targetName) {
      if (!this.params.data.target) {
        this.params.data.target = { targetId: 0, targetName: undefined }
      }
      this.params.data.target[this.params.colDef.field] = this.inputData;
      return this.params.data.target[this.params.colDef.field];
    }
    else {
      this.params.data[this.params.colDef.field] = this.inputData;
      return this.params.data[this.params.colDef.field];
    }
  }
  isPopup(): boolean {
    return false;
  }
  getPopupPosition(): string {
    return "inside";
  }


}
