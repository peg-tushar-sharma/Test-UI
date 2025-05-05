import * as moment from 'moment';
import { CommonMethods } from '../../common/common-methods';
import { Component } from '@angular/core';
import { dealMBStatus } from '../../enums/deal-mbStatus.enum';
import { ITooltipAngularComp } from 'ag-grid-angular';
import { ITooltipParams } from 'ag-grid-community';
import { PipelineService } from '../../../pipeline/pipeline.service';
import { RegistrationStageEnum } from '../../enums/registration-stage.enum';

@Component({
  selector: 'app-conflicts-grid-tooltip',
  templateUrl: './conflicts-grid-tooltip.component.html',
  styleUrls: ['./conflicts-grid-tooltip.component.scss']
})
export class ConflictsGridTooltipComponent implements ITooltipAngularComp {

  constructor(private pipelineService: PipelineService) {
  }
  params: any;
  tooltipValue: any = undefined;
  conflictedOffice: any;
  activeOffice: any;
  priorOffice: any;
  agInit(params: ITooltipParams): void {
    this.params = params;


    if (params.data?.mbStatus?.mbStatusId == dealMBStatus.ActiveMB) {
      this.pipelineService.getRelatedTrackerClientsByRegistrationId(params.data.registrationId).subscribe((res) => {
        let data = [];
        res.forEach((element) => {
          if (element.registrationStageId != RegistrationStageEnum.ClosedBainTurnedDown && element.registrationStageId != RegistrationStageEnum.ClosedDropped && element.registrationStageId != RegistrationStageEnum.ClosedLost && element.registrationStageId != RegistrationStageEnum.Terminated) {

            if (element.isRetainer == 1) {
              element.isRetainer = "Yes";
            }
            if (element.isRetainer == 2) {
              element.isRetainer = "No";
            }
            if (element.isRetainer == 3) {
              element.isRetainer = "I Don't Know";
            }

            data.push(element)


          }
        });

        data = data.sort((a, b) => { return CommonMethods.sortConflicts(a?.registrationStageId ?? 0, a, b) });
        this.tooltipValue = data;

        var currentDate = moment().toDate();
        var pastDate = currentDate.getDate() - 365;
        currentDate.setDate(pastDate);
        let CurrentDate = moment(currentDate).format("MM/DD/YYYY");

        let activeOffice = this.tooltipValue.filter(x => x.registrationStageId == RegistrationStageEnum.WorkStarted && x.officeName != undefined && moment(x.caseEndDate).isAfter(CurrentDate) && x.clientId != params.data?.client[0]?.clientId);
        let priorOffice = this.tooltipValue.filter(x => x.registrationStageId == RegistrationStageEnum.WorkCompleted && x.officeName != undefined && moment(x.caseEndDate).isAfter(CurrentDate) && x.clientId != params.data?.client[0]?.clientId);
        this.activeOffice = Array.from(new Set(activeOffice.map((office) => office.officeName))).join(", "); // Remove duplicates  

        this.priorOffice = Array.from(new Set(priorOffice.map((office) => office.officeName))).join(", "); // Remove duplicates  


        if (res && res.length > 0) {
          this.conflictedOffice = Array.from(new Set(res.flatMap((x) =>
            x?.conflictedOffice?.map((y) => y?.office?.officeName)
          ).filter((name) => name !== undefined))).join(", ");
        } else {
          this.conflictedOffice = [];
          let conflictOfficeList = params.data?.conflictedOffice;
          this.conflictedOffice = params.data?.conflictedOffice?.map((x) => x.office.officeName).join(", "); // Remove duplicates  
        }

      });
    }
  }

  getHighlightClass(item) {

    var currentDate = moment().toDate();
    var pastDate = currentDate.getDate() - 365;
    currentDate.setDate(pastDate);
    let CurrentDate = moment(currentDate).format("MM/DD/YYYY");

    if ((item?.registrationStageId == RegistrationStageEnum.WorkCompleted || item?.registrationStageId == RegistrationStageEnum.WorkStarted)
      && (item?.caseEndDate && moment(item?.caseEndDate).isAfter(CurrentDate))
      && (item?.clientId != this.params.data?.client[0]?.clientId)) {
      return "highlight";
    }
    return "";
  }
  location: "cell"
}
