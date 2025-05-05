
import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Help } from '../../shared/interfaces/help';
import { HelpService } from './help.service';
import { NgForm, Validators } from '@angular/forms';

import { PegTostrService } from '../../core/peg-tostr.service';
import { CommonMethods } from '../common/common-methods';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {


  public help: Help = {
    templateType: 3,
    query: '',
    sender: ''
  };
  @ViewChild('form', { static: true })
  public form: NgForm;
  constructor(public helpService: HelpService, private pegTostr: PegTostrService) {
  }

  ngOnInit() {

  }

  toggleSidebar() {
    var sidebar = document.getElementById("helpSidebar");
    sidebar.classList.toggle("is-shift-sidebar");

    var masterComponent = document.getElementById("masterContainer");
    masterComponent.classList.toggle("is-shift-content");
    this.clearQuery();
  }

  clearQuery() {
    this.form.resetForm();
    this.form.control.patchValue({ 'helpEmail': 3 });
  }

  onSubmitHelp() {
    this.helpService.submitHelpQuery(this.help).subscribe((response) => {
      // this.clearQuery();


      this.toggleSidebar();
      if (!CommonMethods.deviceInfo().isMobile) {
        this.pegTostr.showSuccess('Message sent successfully!', 'Success');
      }
    })
  }

}
