import { Component, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { DealClientNote } from '../../../dealClientNote';
import { DealsService } from '../../../deals.service';
import { DealTracker } from '../../../dealTracker';

@Component({
  selector: 'app-strategy-allocation-notes',
  templateUrl: './strategy-allocation-notes.component.html',
  styleUrls: ['./strategy-allocation-notes.component.scss']
})
export class StrategyAllocationNotesComponent implements OnChanges, OnDestroy {

  @Input()
  public dealTracker: DealTracker = null;

  @Input()
  registrationId: number;

  @Input()
  dealLabel: any;

  @Input()
  isTabReadOnly: boolean;

  allocationNote: string;

  constructor(public dealService: DealsService) {
  }

  ngOnDestroy(): void {
    var openPopup = document.getElementById('btnNoteClose');
    openPopup.click();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.bindNoteValue();
  }

  saveAllocationNote() {
    let currentClient = this.dealTracker.clients.filter(a => a.registrationId == this.registrationId);
    if (currentClient) {
      let showFullText = false;
      currentClient[0].allocationNote = this.allocationNote;
      var currentReadButton: HTMLLinkElement = document.getElementById('currentAllocationNotesReadButton' + this.registrationId) as HTMLLinkElement;
      if (currentReadButton && currentReadButton.innerText.trim() != 'Read more') {
        showFullText = true;
      }
      currentClient[0].allocationNoteFormatted = this.dealService.formateAllocationNote(this.allocationNote, false);

      // Save the deal allocation note
      let dealClientNote: DealClientNote = {
        registrationId: this.registrationId,
        allocationNote: this.allocationNote
      };
      this.dealService.saveDealClientAllocationNotes(dealClientNote).subscribe(allocationData => {
        console.log(allocationData);
      })
      document.getElementById('btnNoteClose').click();
    }
  }

  closeModal() {
    this.bindNoteValue();
  }

  bindNoteValue() {
    if (this.registrationId != null && this.registrationId != undefined) {
      let currentClient = this.dealTracker.clients.filter(a => a.registrationId == this.registrationId);
      if (currentClient && currentClient[0]) {
        this.allocationNote = currentClient[0]?.allocationNote? currentClient[0]?.allocationNote.trim():"";
      }
    }
  }

  // When user presses enter, start a new line
  onEnterKeyPress(event) {
    event.stopPropagation();
  }
}
