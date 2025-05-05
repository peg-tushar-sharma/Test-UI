import { Component, Input, OnChanges, SimpleChanges,OnDestroy } from '@angular/core';
import { DealsService } from '../../../deals.service';
import { deals } from '../../../deal';

@Component({
  selector: 'app-edit-allocation-notes',
  templateUrl: './edit-allocation-notes.component.html',
  styleUrls: ['./edit-allocation-notes.component.scss']
})
export class EditAllocationNotesComponent implements OnChanges,OnDestroy {

  @Input()
  public deal: deals = null;

  @Input()
  dealClientId: number;

  @Input()
  dealLabel: any;

  @Input()
  isTabReadOnly: boolean;
  
  allocationNote: string;

  constructor(public dealService: DealsService) {
  }
  ngOnDestroy(): void {
    var openPopup = document.getElementById('btnNoteClose')
    openPopup.click();
    }

  ngOnChanges(changes: SimpleChanges) {
    this.bindNoteValue();
  }

  saveAllocationNote() {
    let currentClient = this.deal.clients.filter(a => a.dealClientId == this.dealClientId);
    if (currentClient) {
      let showFullText = false;
      currentClient[0].allocationNote = this.allocationNote;
      var currentReadButton: HTMLLinkElement = document.getElementById('currentAllocationNotesReadButton' + this.dealClientId) as HTMLLinkElement;
      if(currentReadButton && currentReadButton.innerText.trim() != 'Read more'){
        showFullText = true;
      }
      currentClient[0].allocationNoteFormatted = this.dealService.formateAllocationNote(this.allocationNote,false);
      document.getElementById('btnNoteClose').click();
    }
  }

  closeModal(){
    this.bindNoteValue();
  }

  bindNoteValue(){
    if (this.dealClientId != null && this.dealClientId != undefined) {
      let currentClient = this.deal.clients.filter(a => a.dealClientId == this.dealClientId);
      if (currentClient && currentClient[0]) {
        this.allocationNote = currentClient[0].allocationNote.trim();
      }
    }
  }
    // When user presses enter, start a new line
    onEnterKeyPress(event) {
      event.stopPropagation();
      
    }

}
