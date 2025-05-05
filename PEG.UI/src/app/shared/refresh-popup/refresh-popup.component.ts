import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-refresh-popup',
  templateUrl: './refresh-popup.component.html',
  styleUrls: ['./refresh-popup.component.scss']
})
export class RefreshPopupComponent implements OnInit {
  @Output()
  public refreshPipelineBucketData: EventEmitter<any> = new EventEmitter<any>();

  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }
  refreshPage(){
    this.refreshPipelineBucketData.emit();
    this.bsModalRef.hide();

  }
}
