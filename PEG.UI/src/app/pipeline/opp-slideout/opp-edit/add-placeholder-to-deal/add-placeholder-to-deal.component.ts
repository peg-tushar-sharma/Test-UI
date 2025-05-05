import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { debounceTime, switchMap, tap } from 'rxjs/operators';
import { PegTostrService } from '../../../../core/peg-tostr.service';
import { DealsService } from '../../../../deals/deals.service';
import { RegistrationService } from '../../../../registrations/registrations/registration.service';
import { TrackerStatus } from '../../../../shared/enums/trackerStatus.enum';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-placeholder-to-deal',
  templateUrl: './add-placeholder-to-deal.component.html',
  styleUrls: ['./add-placeholder-to-deal.component.scss']
})
export class AddPlaceholderToDealComponent implements OnInit {

  @Output() closeEmitter = new EventEmitter();

   @Output() SaveLinkedPlaceholderEmitter = new EventEmitter();


  
  dealTypeAhead = new Subject<string>();
  dealList: any[] = [];
  dealload = false;
  selectedDeal: number;
  saveInProgress: boolean = false;
  transacted = TrackerStatus.Transacted;
  constructor(public modalRef: BsModalRef,private dealService: DealsService, private route: Router, private registrationService: RegistrationService, private toastr: PegTostrService) 
  {
    this.dealTypeAhead.pipe(
      tap(() => { this.dealload = true; this.dealList = []; }),
      debounceTime(200),
      switchMap(term => this.dealService.getDealsByName(term)),
      tap(() => this.dealload = false)
    ).subscribe(items => {
      this.dealList = items;
      this.dealList = this.dealList.map(obj => ({ ...obj, disabled: (obj.appSessionId ) ? true : false }))
    });

  }
  ngOnInit(): void {
   
  }
  
  saveToTracker(goToTracker:boolean) {
    if (!this.saveInProgress) {
      this.saveInProgress = true;
    
      this.SaveLinkedPlaceholderEmitter.emit(this.selectedDeal);
      this.close();
     
    
    }
  }
  clearItems() {   
    this.dealList = [];    
  }
  close() {
    this.modalRef.hide();
    this.closeEmitter.emit(true);
  }

}
