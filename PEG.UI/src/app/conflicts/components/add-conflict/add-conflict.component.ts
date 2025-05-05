import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConflictsService } from '../../services/conflicts.service';
import { CompanyType } from '../../CompanyType';
import { CoreService } from '../../../core/core.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-conflict',
  templateUrl: './add-conflict.component.html',
  styleUrls: ['./add-conflict.component.scss']
})
export class AddConflictComponent implements OnInit {
  addConflictForm: FormGroup;
  conflictTypes: CompanyType[] = [];
  @Input()
  data: any;
  @Input()
  isEdit: any=false;

  constructor(private ngbModal: NgbActiveModal, private formBuilder: FormBuilder, private conflictsService: ConflictsService, private coreService: CoreService) { }

  ngOnInit() {
    let user = this.coreService.loggedInUser.lastName + ", " + ((this.coreService.loggedInUser.familiarName != null) ? this.coreService.loggedInUser.familiarName : this.coreService.loggedInUser.firstName);
    let currentDate = moment(new Date()).format('YYYY-MM-DD');
    this.addConflictForm = this.formBuilder.group({
      companyType: ['', Validators.required],
      companyName: ['', Validators.required],
      submittedBy: [user],
      submittedDate: [currentDate],
      stageType: ['active', Validators.required],
      notes: [],
      isEdit: [this.isEdit],
      companyId:[0]
    });

    if (this.isEdit) {
      this.addConflictForm.get('companyId').setValue(this.data.companyId);
      this.addConflictForm.get('companyType').setValue(this.data.companyType);
      this.addConflictForm.get('companyName').setValue(this.data.companyName);
      this.addConflictForm.get('submittedBy').setValue(this.data.submittedBy ? (this.data.submittedBy.lastName + ", " + ((this.data.submittedBy.familiarName != null) ? this.data.submittedBy.familiarName : this.data.submittedBy.firstName)) : "");
      this.addConflictForm.get('submittedDate').setValue(this.data.submittedBy ?  moment(this.data.submittedDate).format('YYYY-MM-DD') : "");
      this.addConflictForm.get('stageType').setValue(this.data.stageType?'active':'archived' );
      this.addConflictForm.get('notes').setValue(this.data.notes);
      this.addConflictForm.get('isEdit').setValue(this.isEdit);

     
    }


    this.getConflictTypes();
    this.addConflictForm.get('submittedBy').disable();
    this.addConflictForm.get('submittedDate').disable();
  }

  getConflictTypes() {
    this.conflictsService.getConflictTypes().subscribe((contypes: CompanyType[]) => {
      this.conflictTypes = contypes;
    })
  }

  closeModal() {
    this.ngbModal.close();
  }

  saveConflict() {
    if (this?.addConflictForm?.value?.stageType == "active") {
      this.addConflictForm.get('stageType').setValue(true)
    } else {
      this.addConflictForm.get('stageType').setValue(false)
    }

    this.ngbModal.close(this.addConflictForm.value);
  }
}
