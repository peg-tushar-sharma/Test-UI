import { ChangeDetectorRef, Component, Injectable, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  template: `
  <div class="modal-header" id="timeoutmodal">
    <h4 class="modal-title">{{ title }}</h4>
  </div>
  <div class="modal-body">
    <p [innerHTML]="message"></p>
  </div>
  <div class="modal-footer">
    <button *ngIf="showCancel" type="button" class="btn btn-outline-danger" (click)="activeModal.close(false)">{{ cancelText }}</button>
    <button type="button" class="btn btn-primary" (click)="activeModal.close(true)">{{ confirmText }}</button>
  </div>
`
})


export class TimeoutDialogComponent implements OnInit {
  @Input() title;
  @Input() message;
  @Input() showCancel = false;
  @Input() confirmText: String = 'Ok';
  @Input() cancelText: String = 'Cancel';


  constructor(public activeModal: NgbActiveModal, public changeRef: ChangeDetectorRef) {
    // console.log("DialogComponent construct");
  }


  ngOnInit() {
    // console.log("DialogComponent init");
  }
}


@Injectable({
  providedIn: 'root'
})
export class TimeoutDialogService {


  constructor(private modalService: NgbModal) { }


  public confirm() {
    const modalRef = this.modalService.open(TimeoutDialogComponent);


    const instance = (modalRef as any)._windowCmptRef.instance;
    instance.windowClass = '';


    // setImmediate(() => {
    //    instance.windowClass = 'custom-show'
    // })


    setTimeout(() => {
      instance.windowClass = 'custom-show';
    }, 0);


    const fx = (modalRef as any)._removeModalElements.bind(modalRef);
    (modalRef as any)._removeModalElements = () => {
      instance.windowClass = '';
      setTimeout(fx, 250);
    };


    modalRef.componentInstance.title = 'Discard Changes?';
    modalRef.componentInstance.message = 'Are you sure you want to discard your changes?';
    modalRef.componentInstance.changeRef.markForCheck();
    return modalRef.result;
  }

public close(){
  this.modalService.dismissAll()
}
  public open(title: string, message: string, showCancel: boolean = false, confirmText: string = 'Ok', cancelText: string = 'Cancel',
    options: NgbModalOptions = { size: 'lg', backdrop: 'static', keyboard: false }) {
    const modalRef = this.modalService.open(TimeoutDialogComponent, options);

    const instance = (modalRef as any)._windowCmptRef.instance;


    // setImmediate(() => {
    //    instance.windowClass = "custom-show";
    // })


    setTimeout(() => {
      instance.windowClass = 'custom-show';
    }, 0);


    const fx = (modalRef as any)._removeModalElements.bind(modalRef);
    (modalRef as any)._removeModalElements = () => {
      instance.windowClass = '';
      setTimeout(fx, 250);
    };


    modalRef.componentInstance.title = title;
    modalRef.componentInstance.message = message;
    modalRef.componentInstance.showCancel = showCancel;
    modalRef.componentInstance.confirmText = confirmText;
    modalRef.componentInstance.cancelText = cancelText;
    modalRef.componentInstance.changeRef.markForCheck();
    return modalRef.result;
  }


  countDownFrom(milliseconds) {
    var currDate = new Date();
    currDate.setSeconds(currDate.getMilliseconds() + milliseconds);
    // Set the date we're counting down to
    var countDownDate = new Date(currDate).getTime();

    // Update the count down every 1 second
    var x = setInterval(function () {

      // Get today's date and time
      var now = new Date().getTime();

      // Find the distance between now and the count down date
      var distance = countDownDate - now;

      // Time calculations for days, hours, minutes and seconds
      var days = Math.floor(distance / (1000 * 60 * 60 * 24));
      var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);

      // Display the result in the element with id="demo"
      document.getElementById("demo").innerHTML = days + "d " + hours + "h "
        + minutes + "m " + seconds + "s ";

      // If the count down is finished, write some text
      if (distance < 0) {
        clearInterval(x);
        document.getElementById("demo").innerHTML = "saving and revoking the session..";
      }
    }, 1000);
  }
}