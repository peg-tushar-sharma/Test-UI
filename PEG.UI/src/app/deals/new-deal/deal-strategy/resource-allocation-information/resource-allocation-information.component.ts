import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import { DealsService } from '../../../deals.service';
import { ResourceAllocationInfomration } from '../../../deal';

@Component({
  selector: 'app-resource-allocation-information',
  templateUrl: './resource-allocation-information.component.html',
  styleUrls: ['./resource-allocation-information.component.scss']
})
export class ResourceAllocationInformationComponent implements OnInit {

  @Input()
  public caseCode: string = null;

  public resourceAllocationInfomration: ResourceAllocationInfomration[];

  constructor(private dealService: DealsService) {
    if (this.dealService) {
      this.dealService?.updateResource?.subscribe(() => {
        this.resourceAllocationInfomration = [];
        this.bindallocationDetails();
      })
    }
  }

  ngOnInit(): void {
    this.resourceAllocationInfomration = [];
  }

  ngOnChanges(changes: SimpleChanges) {
    this.bindallocationDetails();
  }

  closeModal() {
    // this.bindallocationDetails();
  }

  ngOnDestroy(): void {
    var openPopup = document.getElementById('btnNoteClose');
    openPopup.click();
  }

  bindallocationDetails() {
    this.resourceAllocationInfomration = [];
    if (this.caseCode) {
      this.dealService.getResouceAllocatioInformation(this.caseCode).subscribe((data) => {
      
        data.sort(function (a, b) {
          var o1 = a.currentLevelGrade.trim();
          var o2 = b.currentLevelGrade.trim();

          var l1 = a.employeeName;
          var l2 = b.employeeName;
          
          var p1 = new Date(a.startDate).getTime();
          var p2 = new Date(b.startDate).getTime();

        //level grade  Descending  order
          if (o1 > o2) return -1;
          if (o1 < o2) return 1;
        //last Name Ascending order
          if (l1 < l2) return -1;
          if (l1 > l2) return 1;
        //start Date Ascending order
          if (p1 < p2) return -1;
          if (p1 > p2) return 1;
          return 0;
        })  
         this.resourceAllocationInfomration = data;
      });
    }
  }

}
