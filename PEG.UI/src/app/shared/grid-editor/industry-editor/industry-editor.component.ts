import { Component } from "@angular/core";
import { ICellEditorAngularComp } from "ag-grid-angular";
import { Subject } from 'rxjs';
import { industry } from '../../interfaces/industry';
import { NewRegistrationService } from '../../../registrations/new-registration/new-registration.service';

@Component({
  selector: 'app-industry-editor',
  templateUrl: './industry-editor.component.html',
  styleUrls: ['./industry-editor.component.scss']
})
export class IndustryEditorComponent implements ICellEditorAngularComp {

  industryTypeAhead = new Subject<string>();
  industries: industry[] = [];
  industryLoad: boolean = false;
  selectedIndustries = [];
  params: any
  isClearOnIndustry: boolean = false;
  constructor(private newRegistrationService: NewRegistrationService) {
    
    this.newRegistrationService.getIndustries('').subscribe(items => {
      this.industries = items
    });
  }
  agInit(params: any): void {
    this.params = params;
    if (this.params.data.expertIndustries) {
      let industries = this.params.data.expertIndustries.split(';').map(industry => industry.trim());
      this.selectedIndustries = industries;
    }
  }

  isPopup() {
    return true;
  }
  
  getValue(): any {
    return this.selectedIndustries.join(';');
  }

  onIndustryChange(event) {
  }

}
