import { AfterViewInit, ViewContainerRef } from '@angular/core';
import { Component, OnInit, Input, SimpleChanges, OnChanges, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { Subject } from 'rxjs';
import { tap, debounceTime, switchMap } from 'rxjs/operators';
import { Client } from '../interfaces/client';
import { NewOpportunityService } from '../../opportunity/new-opportunity/new-opportunity.service';


@Component({
  selector: 'app-client-multi-select-typeahead',
  templateUrl: './client-multi-select-typeahead.component.html',
  styleUrls: ['./client-multi-select-typeahead.component.scss']
})

export class ClientMultiSelectTypeaheadComponent implements OnInit, OnChanges, AfterViewInit {

  @Input()
  isMultiSelect: false;
  @Input()
  name: string = "";
  @Input()
  selectedValue: string = "";
  @Input()
  selectedClient: string = "";
  @Input()
  isDisabled: boolean = false;

  @Input()
  isEditable: boolean = false;
  @Input()
  isOnRegistrationForm: boolean = false;


  clientLoad = false;
  clients: Client[] = [];
  selectedClients: any;
  clientTypeAhead = new Subject<string>();
  isRequired = false;
  renderedLabel: string = "";
  params: any;
  isMultiple: boolean = false;
  isClientEditing: boolean = true;

  @Output()
  public saveValue: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('selectClient') public selectClient: NgSelectComponent;

  constructor(private newOpportunityService: NewOpportunityService) {

    this.clientTypeAhead.pipe(
      tap(() => { this.clientLoad = true; this.clients = []; }),
      debounceTime(200),
      switchMap(term => this.newOpportunityService.getClientsByName(term == undefined || term == null ? '' : term.toString().trim())),
      tap(() => this.clientLoad = false)
    ).subscribe(items => {
      this.clients = items;
    });
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    window.setTimeout(() => {
      this.selectClient.open();
    }, 100)
  }

  ngOnChanges(changes: SimpleChanges) {
    this.renderedLabel = "";
    if (changes.selectedValue && changes.selectedValue.currentValue) {
      this.renderedLabel = changes.selectedValue.currentValue;
    }
    this.selectedClients = changes.selectedValue.currentValue;
  }

  onDropdownOpen() {
    this.clients = [];
  }

  emitValue(event) {
    if (!this.isMultiSelect) {
      if (event) {
        this.selectedClient = event;
        this.saveValue.emit(this.selectedClient);
      }
      else {
        this.saveValue.emit(null);
      }
    }
    else {
      this.saveValue.emit(this.selectedClients);
    }
  }

  addClient = (term) => ({ clientId: term, clientName: term });

  updateValue() {
    this.emitValue(null);
  }

}
