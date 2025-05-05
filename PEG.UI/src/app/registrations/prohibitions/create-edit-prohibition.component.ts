import { Component, Input, SimpleChanges, Output, EventEmitter, ViewChild, ElementRef, HostListener, OnInit } from '@angular/core';
import { Prohibition } from './prohibition';
import { ProhibitionService } from './prohibition.service';
import { PegTostrService } from '../../core/peg-tostr.service';
import { NgForm } from '@angular/forms';
import { CoreService } from '../../core/core.service';
@Component({
  selector: 'create-edit-prohibition',
  templateUrl: './create-edit-prohibition.html',
  styleUrls: ['./prohibition.component.scss'],
})
export class CreateEditProhibitionComponent implements OnInit {
  @ViewChild('form', { static: true })
  private form: NgForm;

  @ViewChild('dismissButton', { static: true })
  private dismissButton: ElementRef<HTMLElement>;


  @ViewChild('prohibitionForm', { static: true })
  private prohibitionForm: ElementRef<HTMLElement>;
  // @Input()
  public prohibition: Prohibition = new Prohibition();

  @Output()
  public prohibitionUpdated: EventEmitter<Prohibition> = new EventEmitter<Prohibition>();

  @Output()
  public prohibitionInserted: EventEmitter<Prohibition> = new EventEmitter<Prohibition>();

  @Output()
  public closed: EventEmitter<boolean> = new EventEmitter();

  @Input()
  public submittedByName: string = '';
  //public submittedByEcode: string = '';

  public inProgress = false;

  /**
   *
   */
  constructor(private _prohibitionService: ProhibitionService, private toastr: PegTostrService, private coreService: CoreService) {
    this.prohibition = new Prohibition();
    this.coreService.editProhibition.subscribe(res => {
      if (res) {

        this.prohibition = res;
        this.prohibitionForm.nativeElement.click();
        document.getElementById('prohibition-form').click();
      }
    })
  }

  ngOnInit() {
    let user = this.coreService.loggedInUser;
    if (user && Object.entries(user).length > 0) {
      this.submittedByName = user.lastName + ', ' + (user.familiarName != null ? user.familiarName : user.firstName) + ' (' + user.officeAbbreviation + ')';
      //this.submittedByEcode = user.employeeCode;
    }
  }

  ngOnChanges(changes: SimpleChanges) {

    if (changes.prohibition) {
      if (!changes.prohibition.currentValue) {


        this.prohibition = new Prohibition();
      }
    }
  }

  save() {
    this.dismissButton.nativeElement.click();
    this.inProgress = true;
    if (this.prohibition.id > 0) {
      this.prohibition.ub = this.coreService.loggedInUser.employeeCode;
      this.updateProhibition();
    } else {
      this.prohibition.sb = this.coreService.loggedInUser.employeeCode;
      this.insertProhibition();
    }
  }

  insertProhibition() {
    this._prohibitionService.insertProhibition(this.prohibition).subscribe((prohibition: Prohibition) => {
      this.prohibition = prohibition;
      //this.prohibitionInserted.emit(Object.assign({}, prohibition));
      this.coreService.addProhibition.next(prohibition);
      this.clearForm();
      this.toastr.showSuccess('Prohibition has been created successfully', 'Success');
    },
      () => {
        this.toastr.showError('Error while creating prohibition. Please try again.', 'Error');
        this.clearForm();
      }
    );
  }

  updateProhibition() {
    this._prohibitionService.updateProhibition(this.prohibition).subscribe((prohibition: Prohibition) => {
      this.prohibition = prohibition;
      this.coreService.updateProhibition.next(Object.assign({}, prohibition));
      this.clearForm();
    },
      () => {
        this.toastr.showError('Error while updating prohibition. Please try again.', 'Error');
        this.clearForm();
      }
    );
  }

  clearForm() {
    this.form.reset();
    this.form.resetForm();
    this.prohibition = new Prohibition();
    this.inProgress = false;
  }

  @HostListener('document:keydown.escape', ['$event'])
  public beforeClose(element) {
    this.dismissButton.nativeElement.click();
    this.clearForm()
  }

  cancel() {
    this.dismissButton.nativeElement.click();
    this.clearForm();
    this.closed.emit(true);
  }
}