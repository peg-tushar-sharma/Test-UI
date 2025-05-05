import { Component, OnInit, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';
import { GlobalService } from '../../../global/global.service';

@Component({
  selector: 'app-client-commitment-component',
  templateUrl: './client-commitment.component.html',
  styleUrls: ['./client-commitment.component.scss']
})
export class ClientCommitmentComponent implements ICellEditorAngularComp {
  @ViewChild('clientCommitmentComp') ela:NgSelectComponent
  params: any
  clientCommitments: any
  selectedclientCommitments
  isClear: boolean = true;
  constructor(private globalService: GlobalService) { }
  getValue() {
    return this.params.data.clientCommitment;
  }
  isPopup?(): boolean {
    return true;
  }
  agInit(params: any): void {
    setTimeout(() => {
      if(this.ela!=undefined)
      {
        this.ela.searchInput.nativeElement.focus()
      }    
    }, 200);
    this.params = params;
    this.globalService.getClientCommitment().subscribe(items => {
      this.clientCommitments = items;
      if (this.params.data.clientCommitment) {
        this.selectedclientCommitments = this.params.data.clientCommitment;
      }
    });

  }

  ngOnInit(): void {
  }
  onClientCommitmentChange(item: any) {
     if (item) {
      this.selectedclientCommitments = item;
      this.params.data.clientCommitment = item;
    }
    else
    {
      this.params.data.clientCommitment =null
    }
  }
}
