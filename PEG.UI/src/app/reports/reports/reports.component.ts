import { Component,  OnInit } from '@angular/core';
import { ReportService } from './report.service';
import { CoreService } from '../../core/core.service';
import { RegistrationFrequency } from '../../shared/interfaces/registrationFrequency.interface';
import { Router } from '@angular/router';
declare var tableau: any;

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
  providers: [ReportService]
})
export class ReportsComponent implements OnInit {

  // now declare an instance var
  tableauViz: any
  constructor() {
  }
  ngOnInit() {
    var placeholderDiv = document.getElementById('vizContainer');
    var url = 'https://tableau.bain.com/t/PEGAnalytics/views/RegistrationAnalytics/RegistrationsYTD?:showAppBanner=true&:display_count=n&:showVizHome=n&:origin=viz_share_link&:toolbar=top';
    var options = {
      hideTabs: false,
      showAppBanner:false,
      width: '100VW',
      height: '93VH',
      toolbar:'top',
      onFirstInteractive: function() {
        // The viz is now ready and can be safely used.
      }
    };
    this.tableauViz = new tableau.Viz(placeholderDiv, url, options);    
  }

}
