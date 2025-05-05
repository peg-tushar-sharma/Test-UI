import { Component } from '@angular/core';
import { AgEditorComponent } from 'ag-grid-angular';
import { GlobalService } from '../../../global/global.service';
import { TeamSize } from '../../interfaces/teamSize';
@Component({
  selector: 'app-team-cell',
  templateUrl: './team-editor.component.html',
  styleUrls: ['./team-editor.component.scss']
})
export class TeamEditorComponent implements AgEditorComponent {
  teams: TeamSize[] = [];
  params: any;
  teamSize: any[] = [];
  constructor(private _globalService: GlobalService) {

  }

  agInit(params): void {
    this.params = params;
    this.teams = params.data.team;
    this._globalService.getTeamSize().subscribe(r => {
      this.teamSize = r;
    })

    if (params.value == undefined || params.value?.length == 0) {
      this.addNewTemplate();
    }
  }
  getValue(): any {
    let filteredData = []
    this.teams.forEach(r => {
      if (!((r.teamSizeId == 0 || r.teamSizeId == null))) {
        filteredData.push(r);
      }
    });
    this.params.data.team = filteredData
    //  this.teams.filter(r=>  );
    return this.params.data.team;
  }

  createBlankTemplate() {
    let teams: TeamSize = { teamSizeId: 0, teamSize: "",sortOrder:0 };
    return teams;
  }
  addNewTemplate() {
    let newTeamTemplate = this.createBlankTemplate();
    this.teams.push(newTeamTemplate);
  }
  isPopup(): boolean {
    return true;
  }
  getPopupPosition(): string {
    return "under";
  }
  onSelectionChange(event, team) {
    let val = event;
    team.teamSize=val.teamSize;
  }
  removeTemplate(team) {
    this.teams.splice(this.teams.indexOf(team), 1);
    if(this.teams.length==0){
     this.addNewTemplate();
    }
  }
}