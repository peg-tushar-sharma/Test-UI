import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgForm, Validators } from '@angular/forms';
import { PipelineService } from '../../pipeline.service';
import { PagesTypes } from '../../../shared/enums/page-type.enum';
import { ThisReceiver } from '@angular/compiler';
import { Employee } from '../../../shared/interfaces/Employee';
import { CommonMethods } from '../../../shared/common/common-methods';
import { CoreService } from '../../../core/core.service';

@Component({
  selector: 'app-share-view-modal',
  templateUrl: './share-view-modal.component.html',
  styleUrls: ['./share-view-modal.component.scss']
})
export class ShareViewModalComponent implements OnInit, AfterViewInit {

  title: string;
  data: string;

  shareSetting: boolean = false;
  formSubmitted: boolean = false;
  pipelineUsers: Employee[] = [];
  selectedUser: any;
  @ViewChild('form', { static: true })
  private form: NgForm;

  @Input()
  customMessage: string;

  @Output()
  confirmation: EventEmitter<any> = new EventEmitter<any>();

  public event: EventEmitter<any> = new EventEmitter();

  constructor(public bsModalRef: BsModalRef, public pipelineService: PipelineService, private coreService: CoreService) { }

  ngOnInit() {
    this.pipelineService.getUserByPage(16).subscribe(res => {
      this.pipelineUsers = [];
      res.forEach(element => {
        if (element.employeeCode != this.coreService.loggedInUser.employeeCode) {
          element.searchableName = CommonMethods.getEmployeeName(element);
          this.pipelineUsers.push(element);
        }
      })

      // Get shared users list
      this.pipelineService.getSharedUserFilter(this.data).subscribe(sharedFilters => {
        sharedFilters = sharedFilters.map(r => r.employeeCode);
        let sharedFilterEmployee = []
        sharedFilters.forEach(element => {
          let emp = this.pipelineUsers.find(e => e.employeeCode == element);
          if (emp) {
            sharedFilterEmployee.push(emp);
          }
        });
        this.selectedUser = sharedFilterEmployee;
      })
    })
  }

  ngAfterViewInit() {
    // The reason behind to put this code because whenever we try to apply the 
    // styling through css all the modals are impacted and we only need to add style over the confirm modal
    let modalElement = document.getElementsByClassName('modal-backdrop');
    for (let i = 0; i < modalElement.length; i++) {
      const slide = modalElement[i] as HTMLElement;
      slide.setAttribute("style", "z-index : 99999 !important");
    }

    let modalElemen = document.getElementsByClassName('modal');
    for (let i = 0; i < modalElemen.length; i++) {
      const slide = modalElemen[i] as HTMLElement;
      slide.setAttribute("style", "z-index : 99999 !important");
    }

  }

  cancelFilterShare() {
    this.event.emit('cancel');
    this.bsModalRef.hide();
  }

  shareFilter() {
    this.event.emit({
      event: 'share',
      shareSetting: this.shareSetting,
      selectedUser: this.selectedUser
    });
    this.bsModalRef.hide();
  }

}
