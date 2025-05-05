
import { CommonMethods } from '../../../../shared/common/common-methods';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Subject } from 'rxjs';
import { Client } from '../../../../shared/interfaces/client';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { DealClient } from '../../deal-clients/dealClient';
import { DealsService } from '../../../../deals/deals.service';
import { EXPERT_PARTNER_LEVELGRADE } from '../../../../shared/common/constants';
import { CoreService } from '../../../../core/core.service';

@Component({
  selector: 'app-client-editor-pop-up',
  templateUrl: './client-editor-pop-up.component.html',
  styleUrls: ['./client-editor-pop-up.component.scss']
})
export class ClientEditorPopUpComponent implements OnInit {
  clientTypeAhead = new Subject<string>();
  clients: Client[] = [];
  clientLoad = false;
  submittedByLoad = false;
  selectedClient: Client;
  mode: string = "add";
  dealclient: DealClient;
  trainersList = [];
  selectedSubmittedBy;
  inputSubmittedBy;
  trainersTypeAhead = new Subject<string>();

  @Output()
  public outPlaceHolderChange: EventEmitter<any> = new EventEmitter();

  constructor(public bsModalRef: BsModalRef,  private dealService: DealsService, public coreService: CoreService) {
    this.clientTypeAhead.pipe(
      tap(() => { this.clientLoad = true; }),
      debounceTime(200),
      switchMap((term) => this.dealService.getClientsByName(term == undefined || term == null ? '' : term.toString().trim())),
      tap(() => this.clientLoad = false)
    ).subscribe(items => {
      this.clients = items;
    });


    this.trainersTypeAhead.pipe(
      tap(() => { this.submittedByLoad = true; this.trainersList = []; }),
      debounceTime(200),
      switchMap((term) => this.dealService.getEmployeeByName(term == undefined || term == null ? '' : term.toString().trim(), "", EXPERT_PARTNER_LEVELGRADE, true, false)),
      tap(() => this.submittedByLoad = false)
    ).subscribe(items => {
      items.forEach((element) => {
        element.searchableName = ((element.lastName) ? element.lastName + ", " : '') +
          ((element.familiarName) ? element.familiarName : element.firstName) +
          (element.employeeStatusCode == "EX" ? '' : " (" + (element.officeAbbreviation) + ")")
      });
      this.trainersList = items

    });

  }

  setTrainers(value) {


  }
  
  ngOnInit(): void {
    if (this.inputSubmittedBy) {

      this.selectedSubmittedBy=this.inputSubmittedBy;
      this.selectedSubmittedBy.searchableName = CommonMethods.getEmployeeName(this.inputSubmittedBy)
    } else if (!this.selectedSubmittedBy && this.mode == 'add') {
      let currentUser = this.coreService.loggedInUser;
      this.selectedSubmittedBy = {searchableName:CommonMethods.getEmployeeName(this.coreService.loggedInUser), employeeCode: currentUser.employeeCode, firstName: currentUser.firstName, familiarName: currentUser.familiarName, officeAbbreviation: currentUser.officeAbbreviation };
      // this.selectedSubmittedBy.searchableName=CommonMethods.getEmployeeName(this.selectedSubmittedBy)
    }
  }

  ngAfterViewInit() {
    // The reason behind to put this code because whenever we try to apply the 
    // styling through css all the modals are impacted and we only need to add style over the confirm modal
    let modalElement = document.getElementsByClassName('modal-backdrop');
    for (let i = 0; i < modalElement.length; i++) {
      const slide = modalElement[i] as HTMLElement;
      slide.setAttribute("style", "z-index : 99999 !important");
    }

    let modalElemen = document.getElementsByClassName('modal');
    for (let i = 0; i < modalElemen.length; i++) {
      const slide = modalElemen[i] as HTMLElement;
      slide.setAttribute("style", "z-index : 99999 !important");
    }

  }

  close() {
    this.bsModalRef.hide();
  }

  save() {
    this.close();
    let outObject = { client: this.selectedClient, submittedBy: this.selectedSubmittedBy }
    this.outPlaceHolderChange.emit(outObject);
  }

}
