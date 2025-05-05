import { Component, OnInit } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-leadership-dropdown',
  templateUrl: './leadership-dropdown.component.html',
  styleUrls: ['./leadership-dropdown.component.scss']
})
export class LeadershipDropdownComponent implements ICellEditorAngularComp {

  public value;

  listOfPerson = [
    {
      name: "Smith, John(LON)"
    },
    {
      name: "Smith, Jon(CHI)"
    },
    {
      name: "Domingo, Emilo(LON)"
    },
    {
      name: "Di Venuto, Nic(NYC)"
    },
    {
      name: "Brinda, M.(LON)"
    }
  ]

  public id: number = 1;

  public inputList = [
    {
      id: this.id,
      role: "",
      person: [],
      qualifier: ""
    }
  ]

  public listOfRole = [
    "SVP",
    "RVP",
    "OVP"
  ]
  
  constructor() { }

  getValue() {
    let personArray = this.inputList.map(element => Object.values(element));
    return personArray
  }

  isPopup() {
    return true
  }

  addInput() {
    this.inputList.push({
      id: ++this.id,
      role: "",
      person: [],
      qualifier: ""
    })
  }

  agInit(params): void {
    this.value = params.value
  }

  deleteInput(inputId) {
    if(this.inputList.length === 1) return
    this.inputList = this.inputList.filter(element => element.id !== inputId)
  }

}
