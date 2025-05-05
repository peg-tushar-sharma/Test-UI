import { Component, OnInit, Input } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';
import { LocationOfDeal } from '../../../../shared/interfaces/LocationOfDeal';
import { deals } from '../../../deal';
import { GlobalService } from '../../../../global/global.service';

@Component({
  selector: 'app-deal-info',
  templateUrl: './deal-info.component.html',
  styleUrls: ['./deal-info.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]
})
export class DealInfoComponent implements OnInit {
  locationOfDeal: LocationOfDeal[] = [];
  dealRegions: any[];
  isClearOnLocation: boolean = false;
  @Input()
  deal: deals

  @Input()
  dealLabel: any;

  @Input()
  isTabReadOnly: boolean;

  constructor(public globalService: GlobalService) { }

  ngOnInit() {
    this.globalService.getLocationofDeals().subscribe(items => {
      this.locationOfDeal = items;
    })
    this.getRegions();
  }

  getRegions() {
    this.globalService.getRegions().subscribe(items => {
      this.dealRegions = items;
      
    })
  }


  onLocationChange(event) {
    if (event != undefined) {
      if (event.locationName.toString().trim() == '') {
        this.isClearOnLocation = false;
      } else {
        this.isClearOnLocation = true;
      }
    }
  }

}
