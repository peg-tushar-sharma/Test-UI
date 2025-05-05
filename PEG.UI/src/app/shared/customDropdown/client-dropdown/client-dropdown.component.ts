import { Component } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-client-dropdown',
  templateUrl: './client-dropdown.component.html',
  styleUrls: ['./client-dropdown.component.scss']
})
export class ClientDropdownComponent implements ICellEditorAngularComp {
  public value;

  public suggestions = ["Avent", "Advent HC", "Bain Capital", "Blackstone", "Centerbridge", "Coco Cola"]
  public userSuggestion = []
  public userInput = "";
  public params;

  constructor() { }

  getValue() {
    return this.userInput
  }

  isPopup() {
    return true
  }

  OnSelectItem(event) {
    if(event.target.dataset.option) {
      this.userInput = event.target.dataset.option;
      this.params.stopEditing()
    }
  }

  onChange(event) {
    this.userInput = event.target.value;
    this.userSuggestion = this.suggestions.filter( element => element.toLocaleLowerCase().includes(this.userInput.toLocaleLowerCase()))
  }

  agInit(params): void {
    this.params = params;
    this.value = params.value    
  }

}
