import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Impersonate } from './impersonate';

@Component({
  selector: 'app-impersonate',
  templateUrl: './impersonate.component.html',
  styleUrls: ['./impersonate.component.scss']
})
export class ImpersonateComponent implements OnInit {
  model = new Impersonate('');
  @Output()
  impersonateClickEmitter: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onSubmit() {
    this.impersonateClickEmitter.emit(this.model.employeeCode);
  }
}
