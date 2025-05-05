import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { RegistrationStage } from '../interfaces/models';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-registrationBulkUpdate',
  templateUrl: './registrationBulkUpdate.component.html',
  styleUrls: ['./registrationBulkUpdate.component.scss']
})
export class RegistrationBulkUpdate implements OnInit {
  @Input()
  registrationStage: RegistrationStage[];
  requiredConfirmation:boolean = false;
  
  @ViewChild('StageConfirmationForm', { static: true })
  private StageConfirmationForm: NgForm;

  @ViewChild('dismissButton', { static: true })
  private dismissButton: ElementRef<HTMLElement>;
  selectedStageName:string ='';

  constructor() { 

  }

  

  public selectedStage;

  @Output()
  emittedConfirmation: EventEmitter<any> = new EventEmitter<any>();

  ngOnInit() {
  }

  Submit()
  {
    this.requiredConfirmation = true; 
    this.selectedStageName = this.registrationStage.find(x=>x.registrationStageId == this.selectedStage).stageTypeName;   
  }
  
  Confirm()
  {
    this.requiredConfirmation= false;        
    this.emittedConfirmation.emit(this.selectedStage);
    this.StageConfirmationForm.reset();
    this.StageConfirmationForm.resetForm();
    this.dismissButton.nativeElement.click();
  }

  CancelConfirmation()
  {
    this.requiredConfirmation = false;
  }

  Cancel()
  {
    this.StageConfirmationForm.reset()
    this.StageConfirmationForm.resetForm();
    this.dismissButton.nativeElement.click();
  }

}
