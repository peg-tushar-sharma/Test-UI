import { Component, ElementRef, ViewChild } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';
import { HttpClient } from '@angular/common/http';
import { GlobalService } from '../../global/global.service';
import { Client } from '../interfaces/client';
import { Priority } from '../interfaces/priority';
import { NgSelectComponent } from '@ng-select/ng-select';
@Component({
  selector: 'app-priority-cell',
  templateUrl: './priority-cell.component.html',
  styleUrls: ['./priority-cell.component.scss']
})
export class PriorityCellEditorComponent implements AgEditorComponent {
  @ViewChild('priorityComp') ela:NgSelectComponent

  client: Client;
  params: any;
  isOpen=false;
  customPriority: Priority;
  priorities: Priority[] = [];
  constructor(private globalService: GlobalService) {

  }
  AfterContentInit(){

  }

  agInit(params): void {
    setTimeout(() => {
      this.ela.searchInput.nativeElement.focus()
    }, 200);

    this.params = params;
    this.globalService.getPriority().subscribe(res => {
      this.priorities = res;
    })
    this.client = JSON.parse(JSON.stringify(params.data.client[0]))
    this.customPriority = params.data.customPriority[0];
  }
  getValue(): any {
    return this.customPriority?[this.customPriority]:[];
  }
  isPopup(): boolean {
    return true;
  }
  getPopupPosition(): string {
    return "under";
  }
  callEvent(event) {
    this.params.data.customPriority[0] = event;
  }
}