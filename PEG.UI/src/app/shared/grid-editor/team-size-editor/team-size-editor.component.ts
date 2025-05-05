import { Component, ViewChild } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';

import { GlobalService } from '../../../global/global.service';
import { TeamSize } from '../../interfaces/teamSize';
import * as _ from 'lodash';
import { NgSelectComponent } from '@ng-select/ng-select';
@Component({
  selector: 'app-team-size-editor',
  templateUrl: './team-size-editor.component.html',
  styleUrls: ['./team-size-editor.component.scss']
})
export class TeamSizeEditorComponent implements AgEditorComponent {
  @ViewChild('teamsS') ela: NgSelectComponent;

  teams: TeamSize[] = [];
  params: any;
  teamSize: any[] = [];
  constructor(private _globalService: GlobalService) {

  }
  onTeamSizeChange(value) {
    let item = value;
    let IdArr: number[] = JSON.parse(JSON.stringify(this.teamSize.map(x => x.teamSizeId)))
    let max = Math.max(...IdArr);
    let currentItem: TeamSize = { sortOrder: 0, teamSize: "", teamSizeId: 0 };
    currentItem.teamSizeId = max + 1;
    currentItem.sortOrder = item.sortOrder;
    currentItem.teamSize = item.teamSize;
    this.teamSize = [...this.teamSize, currentItem].sort((a, b) => {
      return a.sortOrder - b.sortOrder;
    });

    this._globalService.getTeamSize().subscribe(res => {
      let teamData = []
      this.teams.forEach(element => {
        let item = this.teamSize.find(x => x.teamSizeId == element)
        teamData.push(JSON.parse(JSON.stringify(item)));
      });

      teamData.forEach(element => {
        let item = res.find(x => x.teamSize == element.teamSize)
        element.teamSizeId = item.teamSizeId;
      });
      this.params.data.teamSize = teamData;
    })


  }
  AddNewTeamSizeItem(element) {
    let IdArr: number[] = JSON.parse(JSON.stringify(this.teamSize.map(x => x.teamSizeId)))
    let max = Math.max(...IdArr);
    element.teamSizeId = max + 1;

    let currentItem: TeamSize = { sortOrder: 0, teamSize: "", teamSizeId: 0 };
    currentItem.teamSizeId = max + 1;
    currentItem.sortOrder = element.sortOrder;
    currentItem.teamSize = element.teamSize;
    this.teamSize = [...this.teamSize, currentItem].sort((a, b) => {
        return a.sortOrder - b.sortOrder;
    });
}
  agInit(params): void {

    this.params = params;
    this._globalService.getTeamSize().subscribe(r => {
      this.teamSize = r;

      if (this.params.data && this.params.data.teamSize) {
        this.teams = this.params.data.teamSize.map((teamSize) => {
          return teamSize.teamSizeId;
        });
      }
      function compare(fields, a, b) {
        for (let field of fields) {
          if (a[field] < b[field]) return -1;
          if (a[field] > b[field]) return 1;
        }
        return 0;
      }
  
      const orderBy = (data, ...fields) =>
        [...data].sort(compare.bind(null, fields));
  
      const partitionBy = (data, ...fields) =>
        // Will not order the data before partitioning
        data.reduce((acc, row) => {
          if (acc.length && !compare(fields, acc[acc.length - 1][0], row)) {
            acc[acc.length - 1].push(row);
          } else {
            acc.push([row]);
          }
          return acc;
        }, []);
  
      const rowNumber = (data, alias = "rownumber") =>
        Array.isArray(data[0]) // partitioned ? recur for each!
          ? data.map(row => rowNumber(row, alias))
          : data.map((row, i) => ({ ...row, [alias]: i + 1 })); // base case
  
      let result = rowNumber(partitionBy(orderBy(this.params.data.teamSize, "teamSizeId"), // fields to order by
        "teamSizeId"// fields to partition by
      ),
        "count" // The alias for the additional row-number column
      ).flat(); // Finally flatten away the partitions
      
      this.params.data.teamSize = result;
      this.params.data.teamSize.forEach((element, i) => {
        this.AddNewTeamSizeItem(element);
  
  
      });
      this.teams = this.params.data.teamSize.map(x => x.teamSizeId);
      setTimeout(() => {
        this.ela.searchInput.nativeElement.focus()
      }, 100);
    })

    
  }
  getValue(): any {
    
    return this.params.data.teamSize;
  }

  isPopup(): boolean {
    return true;
  }

  getPopupPosition(): string {
    return "under";
  }
  onClearAll(event){
    this.params.data.teamSize=[]; 
    this._globalService.getTeamSize().subscribe(r => {
      this.teamSize = r;
    })
    
  }
  onRemoveTeamSize(event) {
    this.teamSize = [...this.teamSize.filter(x => x.teamSizeId != event?.teamSizeId)]
    this._globalService.getTeamSize().subscribe(res => {
        let teamData = []
        this.teams.forEach(element => {
            let item = this.teamSize.find(x=>x.teamSizeId==element)
            teamData.push(JSON.parse(JSON.stringify(item)));
        });

        teamData.forEach(element => {
            let item = res.find(x => x.teamSize == element.teamSize)
            element.teamSizeId = item.teamSizeId;
          });
          this.params.data.teamSize = teamData;

    })
  }
}
