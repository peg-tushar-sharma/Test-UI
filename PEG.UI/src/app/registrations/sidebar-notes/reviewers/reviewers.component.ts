import { Component, OnInit, Input,OnChanges,SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-reviewers',
  templateUrl: './reviewers.component.html',
  styleUrls: ['./reviewers.component.scss']
})
export class ReviewersComponent implements OnInit, OnChanges {
  

  @Input()
  registrationId:number;

  initialValue:string =" ";

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes.registrationId.currentValue!= changes.registrationId.previousValue)
    {
      this.initialValue ="";
    }
  }


}
