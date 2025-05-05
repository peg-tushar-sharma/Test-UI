import { Component, OnInit,Input, Output,EventEmitter, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-redbook-available',
  templateUrl: './redbook-available.component.html',
  styleUrls: ['./redbook-available.component.scss']
})
export class RedbookAvailableComponent implements OnInit {

  constructor() { }

  @Input() redbookAvailable:number;

  @Input() containerName: string;

  //containerName: any;
  
  @Output() redbookChange = new EventEmitter<any>();

  ngOnInit(): void {
  
  }

  ngOnChanges(change:SimpleChanges)
  {
  
  }

  redbookClick(value: number) {
   this.redbookChange.emit(value)
    
  }

 
}
