import { Client } from '../../../shared/interfaces/client';
import { Component, ViewChild } from "@angular/core";
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { ICellEditorAngularComp } from "ag-grid-angular";
import { NewOpportunityService } from "../../../opportunity/new-opportunity/new-opportunity.service";
import { NgSelectComponent } from "@ng-select/ng-select";
import { Subject } from 'rxjs';


@Component({
  selector: 'app-client-editor',
  templateUrl: './client-editor.component.html',
  styleUrls: ['./client-editor.component.scss']
})
export class ClientEditorComponent implements ICellEditorAngularComp {
  @ViewChild('clientComp') clientComponentElement: NgSelectComponent
  clientTypeAhead = new Subject<string>();
  clients: Client[] = [];
  clientLoad = false;
  selectedClients = [];
  params: any;
  isMultiple: boolean = true;
  bak_selectedClients = [];
  dropdownPosition: string = 'auto';
  constructor(private newOpportunityService: NewOpportunityService,) {
    this.clientTypeAhead.pipe(
      tap(() => { this.clientLoad = true; }),
      debounceTime(200),
      switchMap(term => this.newOpportunityService.getClientsByName(term == undefined || term == null ? '' : term.toString().trim())),
      tap(() => this.clientLoad = false)
    ).subscribe(items => {
      this.clients = items;
    });

  }

  agInit(params: any): void {

    if (params.rowIndex && params.rowIndex > 4)
      this.dropdownPosition = "top";

    this.isMultiple = params.data.isMultipleClient;
    this.params = params;
    if (this.params.data.hasOwnProperty('expertClients')) {
      if (this.params.data.expertClients != '') {
        let clients = this.params.data.expertClients.split(';');
        this.selectedClients = clients;
      }
    }
    else if (params.data.hasOwnProperty('client') && (params.data.hasOwnProperty('opportunityTypeId') && params.data.opportunityTypeId > 0)) {
      this.selectedClients = params.data.client ? params.data.client.map(z => z.clientName).join(",") : undefined;
    }
    else if (params.data.hasOwnProperty('clientName')) {
      this.selectedClients = params.data.clientName;
    }

    if (this.selectedClients != undefined) {
      this.bak_selectedClients = JSON.parse(JSON.stringify(this.selectedClients));

      if (this.params.data?.oppName != null) {
        this.params.data.oppName = "";
      }
    }
    setTimeout(() => {
      if (this.clientComponentElement != undefined) {
        this.clientComponentElement.searchInput.nativeElement.focus()
      }

    }, 200);
  }

  isPopup() {
    return true;
  }

  onDropdownOpen() {
    this.clients = [];
  }

  getValue(): any {
    if (this.selectedClients) {
      return this.isMultiple == false || this.isMultiple == undefined ? this.selectedClients.toString().trim().replace(/\s+/g, " ") : this.selectedClients.join(';');
    }
    else if (!this.isMultiple) {
      return this.bak_selectedClients.toString().trim().replace(/\s+/g, " ");
    }
  }

  onClientChange(event) {

    if (this.isMultiple == false) {
      if (event.clientName.trim() == '') {
        this.selectedClients = this.params.data.client.clientName;
      } else {
        if (event) {
          let CurrClient = this.clients.find(r => r.clientName == event.clientName.trim());
          this.params.data.client = CurrClient ? CurrClient : event;
          this.params.data.clientId = CurrClient ? CurrClient.clientId : undefined;
          this.params.data.client.clientId = CurrClient ? CurrClient.clientId : undefined;
          this.params.data.priorityName = CurrClient ? CurrClient.clientPriorityName : undefined;
          this.params.data.clientPrioritySortOrder = CurrClient ? CurrClient.clientPrioritySortOrder : undefined;
        }
      }
    } else { // for search grid
      if (Object.prototype.hasOwnProperty.call(this.params.data, "opportunityTypeId")  && this.params.data.opportunityTypeId > 0) {
        this.params.data.client = event ? [event] : undefined;
      }
      else if (event) {
        let CurrClient = this.clients.find(r => r.clientName == event.clientName.trim());
        this.params.data.clientId = CurrClient ? CurrClient.clientReferenceId : undefined;
      }
    }

    this.params.api.stopEditing();
  }


}
