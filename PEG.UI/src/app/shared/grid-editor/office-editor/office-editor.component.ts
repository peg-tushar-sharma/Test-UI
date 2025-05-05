import { Component, OnInit } from '@angular/core';
import { GlobalService } from '../../../global/global.service';
import { Office } from '../../interfaces/office';

@Component({
  selector: 'app-office-editor',
  templateUrl: './office-editor.component.html',
  styleUrls: ['./office-editor.component.scss']
})
export class OfficeEditorComponent implements OnInit {

  params: any
  public bainOffices: Office[];
  public selectedOfficeCode: any;
  
  constructor(private globalService: GlobalService) { }

  ngOnInit() {
    this.globalService.getOffice().subscribe(office => {
      this.bainOffices = office;
    });    
  }

  agInit(params: any){
    this.params = params;
    this.selectedOfficeCode = this.params.data.caseOffice? this.params.data.caseOffice.officeCode:0;
  }

  isPopup() {
    return true;
  }

  getValue(){
    let office = this.bainOffices.filter(x=>x.officeCode == this.selectedOfficeCode);
    if(office && office[0]){
      this.params.data.caseOffice = office[0];
      this.params.data.officeCluster = office[0].officeCluster;      
      return office[0].officeName;    
    }
    
    else {
      this.params.data.caseOffice = null;
      this.params.data.officeCluster = '';
      return '';
    }
  }

  resetOffice(){
    this.params.data.caseOffice = null;
    this.selectedOfficeCode = null;
  }

  onSelectionChange(event){
    this.params.api.stopEditing();
  }

}
