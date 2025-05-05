import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffingOpportunityTypeDetailsComponent } from '../staffing/staffing-opportunity-type-details/staffing-opportunity-type-details.component';
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [StaffingOpportunityTypeDetailsComponent],
  imports: [
    CommonModule,
    BsDropdownModule,
    FormsModule,
    
  ],
  exports: [StaffingOpportunityTypeDetailsComponent]
})
export class StaffingCommonModule { }
