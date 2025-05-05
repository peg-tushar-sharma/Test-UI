import { WorkToStart } from './../../registrations/new-registration/workToStart';
import * as moment from 'moment';
import { isEqualWith, isNull } from 'lodash'
import { join } from 'path';
import { Employee } from '../interfaces/Employee';
import { RegistrationStageEnum } from '../enums/registration-stage.enum';
import { RegistrationStatus } from '../enums/registration-status.enum';
import { dealMBStatus } from '../enums/deal-mbStatus.enum';
import { DatePipe } from '@angular/common';
import { FormatTimeZone } from '../formatTimeZone.pipe';
import { CoreService } from '../../core/core.service';
import { RoleType } from '../enums/role-type.enum';
import { Region } from '../enums/region';
import { SortType } from '../enums/sortType.enum';
import { Likelihood } from '../../pipeline/pipeline';
import * as _ from 'lodash';
import { FilterType } from '../enums/FilterType';
import { PipelineAuditLog } from '../../pipeline/pipelineAuditLog';
import { AuditLog } from '../AuditLog/AuditLog';
import { OpportunityTypeDetails } from '../../shared/opportunity-type-details/opportunity-type-details';

export interface DifferingProperty {
  property: string;
  oldValue: any;
  newValue: any;
  type: any;
  auditLogSource: any;
}
export class CommonMethods {
  static _formatTimeZone: FormatTimeZone;
  static durationRegex = '(^(\\d{1,2})\\.\\d$)|(^\\d{0,2}$)';
  public static deleteCookie(name) {
    document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
  public static generateOpportunityTypeDetailsLabel(OpportunityTypeDetails: OpportunityTypeDetails): string {
    let label = '';
    if (OpportunityTypeDetails.isNextPhase) {
      label += 'Phase ' + OpportunityTypeDetails.nextPhaseValue.sort((a, b) => a.value - b.value).map(x => x.value).join(',');
    }
    if (OpportunityTypeDetails.isAdditionalTeam) {
      label += ' Team ' + OpportunityTypeDetails.additionalTeamValue.sort((a, b) => a.value - b.value).map(x => x.value).join(',');
    }
    if (OpportunityTypeDetails.isRestart) {
      label += ' Restart';
    }
    if (OpportunityTypeDetails.isContinuation) {
      label += ' Continuation';
    }
    return label.trim();
  }
  public static setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  }
  public static getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  public static tagsGetter(params: any) {
    let value = '';

    if (!!params.data.imb) {
      if (value) {
        value += ' ';
      }
      value += 'MB';
    }
    if (!!params.data.isb) {
      if (value) {
        value += ' ';
      }
      value += 'SB';
    }
    if (!!params.data.isSeller) {
      if (value) {
        value += ' ';
      }
      value += 'Seller';
    }

    if (params.data.wts == 1) {
      if (value) {
        value += ' ';
      }
      value += 'Urgent';
    }

    if (params.data.wti == 2 && !!params.data.pte && !!params.data.iomp) {
      if (value) {
        value += ' ';
      }
      value += 'HF';
    }

    if (params.data.wti == 3 && !!params.data.ptd && !!params.data.iomp) {
      if (value) {
        value += ' ';
      }
      value += 'PTD';
    }

    return value;
  }
  public static deviceInfo() {
    var deviceInfo = {
      isMobile: false,
      isDesktop: false,
      screenHeight: window.screen.height,
      screenWidth: window.screen.width,
      availableHeight: window.screen.availHeight,
      availableWidth: window.screen.availWidth
    }

    // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
      deviceInfo.isMobile = true;
    } else {
      deviceInfo.isDesktop = true;
    }

    return deviceInfo;
  }

  public static convertDatetoUTC(dateValue: Date) {
    if (dateValue != undefined && dateValue != null) {
      var initialDate = dateValue
      var t = new Date(); // for now
      initialDate.setHours(t.getHours());
      initialDate.setMinutes(t.getMinutes());
      initialDate.setSeconds(t.getSeconds());

      var utcObject = initialDate.toUTCString();
      let convertedTime = new Date(initialDate)

      var Dateutc = convertedTime.getTime() + (convertedTime.getTimezoneOffset() * 60000);  //This converts to UTC 00:00
      var utc = new Date(Dateutc);

      //formatting date to offset
      var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      var dd;
      if (utc.getDate() < 10) {
        dd = '0' + utc.getDate().toString();
      } else {
        dd = utc.getDate();
      }
      let formatted_date = dd + "-" + (months[utc.getMonth()]) + "-" + utc.getFullYear()
      return { utc: utcObject, formattedDate: formatted_date };
    } else {
      return null;
    }
  }
  static converToLocal(value, includeTime: boolean = false) {
    let currentTime = new Date(value);
    if (includeTime) {
      return currentTime.getFullYear() + '-' + this.addZero(currentTime.getMonth() + 1) + '-' + this.addZero(currentTime.getDate()) + 'T' + this.addZero(currentTime.getHours()) + ':' + this.addZero(currentTime.getMinutes()) + 'Z'
    }
    return currentTime.getFullYear() + '-' + this.addZero(currentTime.getMonth() + 1) + '-' + this.addZero(currentTime.getDate()) + 'T00:00:00Z'
  }

  static getDateLabel(currentTime) {

    return this.addZero(currentTime.getDate()) + '-' + this.getMonthLabel(currentTime.getMonth()) + '-' + currentTime.getFullYear();

  }
  static copyToClipboard(str) {
    function listener(e) {
      e.clipboardData.setData("text/html", str);
      e.clipboardData.setData("text/plain", str);
      e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
  }
  static getMonthLabel(i) {
    var month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";
    var m = month[i];
    return m;
  }

  static addZero(value) {
    let dd;
    if (value < 10) {
      dd = '0' + value.toString();
    } else {
      dd = value
    }
    return dd;
  }

  public static encodeData(data) {
    return data;
  }

  public static decodeData(data) {
    if (data != undefined) {
      return data;
    }
  }

  public static addCurrentTimeToDate(date: Date): Date {
    let tp: any = null;
    if (date != null && date != undefined) {
      tp = moment(date).add(new Date().getHours(), 'hour').add(new Date().getMinutes(), 'minute')
      return tp._d;
    }
    return tp;

  }
  public static getGUID() {
    return (`${1e7}-${1e3}-${4e3}-${8e3}-${1e11}`).replace(/[018]/g, c =>
      (<any>c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> <any>c / 4).toString(16)
    );
  }
  public static isDateWithinLastYear(dateString) {
    const givenDate = new Date(dateString);
    const currentDate = new Date();
    const oneYearAgo = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
    return givenDate >= oneYearAgo && givenDate <= new Date();
  }
  public static getLikelihoodValue(likelihood: Likelihood) {
    if (likelihood != undefined && likelihood.likelihoodId > 0) {
      switch (likelihood.value) {
        case 49:
          return 0;
        default:
          return likelihood.value;
      }
    } else {
      return undefined;
    }

  }
  public static sortDealCllients(stageId, a, b): number {
    let futureDate = moment().add(100, 'year').valueOf()
    switch (stageId) {
      case 4:
      case 5:
        if (a.registrationStage?.registrationStageId == b.registrationStage?.registrationStageId) {
          let result = (((a.caseInfo?.caseStartDate) ? new Date(a.caseInfo?.caseStartDate).getTime() : futureDate) > ((b.caseInfo?.caseStartDate) ? new Date(b.caseInfo?.caseStartDate).getTime() : futureDate)) ? 1 : (((a.caseInfo?.caseStartDate) ? new Date(a.caseInfo?.caseStartDate).getTime() : futureDate) < ((b.caseInfo?.caseStartDate) ? new Date(b.caseInfo?.caseStartDate).getTime() : futureDate) ? -1 : 0);

          if ((((a.caseInfo?.caseStartDate) ? new Date(a.caseInfo?.caseStartDate).getTime() : futureDate)) == ((b.caseInfo?.caseStartDate) ? new Date(b.caseInfo?.caseStartDate).getTime() : futureDate)) {
            let secondSort = (((a.priority) ? a.priority.sortOrder : 100) > ((b.priority) ? b.priority.sortOrder : 100)) ? 1 : (((a.priority) ? a.priority.sortOrder : 100) < ((b.priority) ? b.priority.sortOrder : 100) ? -1 : 0);

            if (result != 0) {
              if (secondSort != 0) {
                result = result * secondSort
              }
            }
            else {
              if (secondSort != 0) {
                result = secondSort;
              }
            }
          }
          if (result == 0 &&
            (secondSort == 0 || !secondSort)) {

            if (a.client?.clientName) {
              result = a.client?.clientName.localeCompare(b.client?.clientName)
            }

            if (a.caseInfo?.caseEndDate == b.caseInfo?.caseEndDate &&
              a.client?.clientId == b?.client?.clientId) {
              result = a?.opportunityTypeId != 3 > 0 && b?.opportunityTypeId == 3 ? -1 :
                a?.opportunityTypeId == 3 && b?.opportunityTypeId != 3 ? 1 : 0;
            }
          }

          return result;
        }
        break;



      case 2:

        if (a.registrationStage?.registrationStageId == b.registrationStage?.registrationStageId) {
          let result = (((a.commitmentDate) ? new Date(a.commitmentDate).getTime() : futureDate) > ((b.commitmentDate) ? new Date(b.commitmentDate).getTime() : futureDate)) ? 1 : (((a.commitmentDate) ? new Date(a.commitmentDate).getTime() : futureDate) < ((b.commitmentDate) ? new Date(b.commitmentDate).getTime() : futureDate) ? -1 : 0);

          if ((((a.commitmentDate) ? new Date(a.commitmentDate).getTime() : futureDate)) == ((b.commitmentDate) ? new Date(b.commitmentDate).getTime() : futureDate)) {
            let secondSort = (((a.priority) ? a.priority.sortOrder : 100) > ((b.priority) ? b.priority.sortOrder : 100)) ? 1 : (((a.priority) ? a.priority.sortOrder : 100) < ((b.priority) ? b.priority.sortOrder : 100) ? -1 : 0);

            if (result != 0) {
              if (secondSort != 0) {
                result = result * secondSort
              }
            }
            else {
              if (secondSort != 0) {
                result = secondSort;
              }
            }
          }

          return result;
        }

        break;
      case 1:
        if (a.registrationStage?.registrationStageId == b.registrationStage?.registrationStageId) {
          var result = (((a.priority) ? a.priority.sortOrder : 100) > ((b.priority) ? b.priority.sortOrder : 100)) ? 1 : (((a.priority) ? a.priority.sortOrder : 100) < ((b.priority) ? b.priority.sortOrder : 100) ? -1 : 0);
          if (((a.priority) ? a.priority.sortOrder : 100) == ((b.priority) ? b.priority.sortOrder : 100)) {
            var secondSort = ((((a.registrationSubmissionDate) ? new Date(a.registrationSubmissionDate).getTime() : futureDate) > ((b.registrationSubmissionDate) ? new Date(b.registrationSubmissionDate).getTime() : futureDate)) ? 1 : (((a.registrationSubmissionDate) ? new Date(a.registrationSubmissionDate).getTime() : futureDate) < ((b.registrationSubmissionDate) ? new Date(b.registrationSubmissionDate).getTime() : futureDate) ? -1 : 0));

            if (result != 0) {
              if (secondSort != 0) {
                result = result * secondSort
              }
            }
            else {
              if (secondSort != 0) {
                result = secondSort;
              }
            }
          }
          return result;
        }
        break;
      case 3:
        break;
      default:
        break;
    }
  }
  public static sortCllients(stageId, a, b): number {
    let futureDate = moment().add(100, 'year').valueOf()
    switch (stageId) {
      case 4:
      case 5:
        if (a.stage?.registrationStageId == b.stage?.registrationStageId) {
          let result = (((a.caseStartDate) ? new Date(a.caseStartDate).getTime() : futureDate) > ((b.caseStartDate) ? new Date(b.caseStartDate).getTime() : futureDate)) ? 1 : (((a.caseStartDate) ? new Date(a.caseStartDate).getTime() : futureDate) < ((b.caseStartDate) ? new Date(b.caseStartDate).getTime() : futureDate) ? -1 : 0);

          if ((((a.caseStartDate) ? new Date(a.caseStartDate).getTime() : futureDate)) == ((b.caseStartDate) ? new Date(b.caseStartDate).getTime() : futureDate)) {
            let secondSort = (((a.priority) ? a.priority.sortOrder : 100) > ((b.priority) ? b.priority.sortOrder : 100)) ? 1 : (((a.priority) ? a.priority.sortOrder : 100) < ((b.priority) ? b.priority.sortOrder : 100) ? -1 : 0);

            if (result != 0) {
              if (secondSort != 0) {
                result = result * secondSort
              }
            }
            else {
              if (secondSort != 0) {
                result = secondSort;
              }
            }
          }

          return result;
        }
        break;



      case 2:

        if (a.stage?.registrationStageId == b.stage?.registrationStageId) {
          let result = (((a.commitmentDate) ? new Date(a.commitmentDate).getTime() : futureDate) > ((b.commitmentDate) ? new Date(b.commitmentDate).getTime() : futureDate)) ? 1 : (((a.commitmentDate) ? new Date(a.commitmentDate).getTime() : futureDate) < ((b.commitmentDate) ? new Date(b.commitmentDate).getTime() : futureDate) ? -1 : 0);

          if ((((a.commitmentDate) ? new Date(a.commitmentDate).getTime() : futureDate)) == ((b.commitmentDate) ? new Date(b.commitmentDate).getTime() : futureDate)) {
            let secondSort = (((a.priority) ? a.priority.sortOrder : 100) > ((b.priority) ? b.priority.sortOrder : 100)) ? 1 : (((a.priority) ? a.priority.sortOrder : 100) < ((b.priority) ? b.priority.sortOrder : 100) ? -1 : 0);

            if (result != 0) {
              if (secondSort != 0) {
                result = result * secondSort
              }
            }
            else {
              if (secondSort != 0) {
                result = secondSort;
              }
            }
          }

          return result;
        }

        break;
      case 1:
        if (a.stage?.registrationStageId == b.stage?.registrationStageId) {
          var result = (((a.priority) ? a.priority.sortOrder : 100) > ((b.priority) ? b.priority.sortOrder : 100)) ? 1 : (((a.priority) ? a.priority.sortOrder : 100) < ((b.priority) ? b.priority.sortOrder : 100) ? -1 : 0);
          if (((a.priority) ? a.priority.sortOrder : 100) == ((b.priority) ? b.priority.sortOrder : 100)) {
            var secondSort = ((((a.registrationSubmissionDate) ? new Date(a.registrationSubmissionDate).getTime() : futureDate) > ((b.registrationSubmissionDate) ? new Date(b.registrationSubmissionDate).getTime() : futureDate)) ? 1 : (((a.registrationSubmissionDate) ? new Date(a.registrationSubmissionDate).getTime() : futureDate) < ((b.registrationSubmissionDate) ? new Date(b.registrationSubmissionDate).getTime() : futureDate) ? -1 : 0));

            if (result != 0) {
              if (secondSort != 0) {
                result = result * secondSort
              }
            }
            else {
              if (secondSort != 0) {
                result = secondSort;
              }
            }
          }
          return result;
        }
        break;
      case 3:
        break;
      default:
        break;
    }
  }
  public static compareObject(object1, object2): boolean {
    return !isEqualWith(object1, object2, this.customizer);
  }

  public static customizer(objValue, othValue) {
    if ((isNull(objValue) || objValue === '') && (isNull(othValue) || othValue === '')) return true;

    else if ((!objValue || (objValue.constructor.name == 'Object' && Object.keys(objValue).length == 0)) &&
      (!othValue || (othValue.constructor.name == 'Object' && Object.keys(othValue).length == 0))) return true;

    else if ((!objValue || (objValue.constructor.name == 'Array' && objValue.length == 0)) &&
      (!othValue || (othValue.constructor.name == 'Array' && othValue.length == 0))) return true;

    else if (objValue && othValue && (objValue.constructor.name == 'Date' || othValue.constructor.name == 'Date')) {
      if (new Date(objValue).toDateString() === new Date(othValue).toDateString())
        return true;
    }

  }

  public static getEmployeeName(employee) {
    if (employee) {
      if (employee.hasOwnProperty('searchableName') && employee.searchableName) {
        return employee.searchableName;
      } else {
        return ((employee.lastName) ? employee.lastName + ", " : '') +
          ((employee.familiarName) ? employee.familiarName : employee.firstName) +
          " (" + (employee.officeAbbreviation) + ")"
      }
    }
  }

  public static getEmployeeNameWithoutAbbr(employee) {
    if (employee) {
      if (employee.hasOwnProperty('searchableName') && employee.searchableName) {
        return employee.searchableName;
      } else {
        return ((employee.lastName) ? employee.lastName + ", " : '') +
          ((employee.familiarName) ? employee.familiarName : employee.firstName)

      }
    }
  }
  public static getEmployeeNames(employees, splitChar) {
    var employeeNames = [];
    if (employees) {
      employees.forEach(employee => {
        if (employee && employee.employeeCode)
          employeeNames.push(((employee.lastName) ? employee.lastName + ", " : '') +
            ((employee.familiarName) ? employee.familiarName : employee.firstName) +
            " (" + (employee.officeAbbreviation) + ")");
      });
      return employeeNames.join(splitChar)
    }
  }


  public static getEmployeeNamesWithWithoutSearchName(employees, splitChar) {
    var employeeNames = [];
    if (employees) {

      employees.forEach(employee => {
        if (employee.hasOwnProperty('searchableName') && employee.searchableName) {
          employeeNames.push(employee.searchableName);
        }

        else if (employee && employee.employeeCode)
          employeeNames.push(((employee.lastName) ? employee.lastName + ", " : '') +
            ((employee.familiarName) ? employee.familiarName : employee.firstName) +
            " (" + (employee.officeAbbreviation) + ")");
      });
      return employeeNames.join(splitChar)
    }
  }


  public static assignSearchableName(employees) {
    if (employees) {
      employees.forEach(employee => {
        if (employee && employee.employeeCode)
          employee.searchableName = ((employee.lastName) ? employee.lastName + ", " : '') +
            ((employee.familiarName) ? employee.familiarName : employee.firstName) +
            ((employee.officeAbbreviation) ? " (" + (employee.officeAbbreviation) + ")" : "");
      });
    }
    return employees;
  }

  public static getEmployeeNameList(employees): string[] {
    var employeeNames = [];
    if (employees) {
      employees.forEach(employee => {
        if (employee && employee.employeeCode && employee.employeeCode != '') {
          employeeNames.push(((employee.lastName) ? employee.lastName + ", " : '') +
            ((employee.familiarName) ? employee.familiarName : employee.firstName) +
            " (" + (employee.officeAbbreviation) + ")");
        }
      });
      return employeeNames
    }
  }

  public static getLoggedInEmployee(loggedInUser) {
    let currentLoggedInEmployee: Employee = {
      firstName: loggedInUser.firstName,
      lastName: loggedInUser.lastName,
      familiarName: loggedInUser.familiarName,
      employeeCode: loggedInUser.employeeCode,
      searchableName: '',
      officeName: '',
      homeOfficeCode: loggedInUser.employeeOffice,
      officeAbbreviation: loggedInUser.officeAbbreviation,
      abbreviation: '',
      isRingfenceEmployee: false,
      statusCode: '',
      regionId: loggedInUser.employeeRegionId,
      officeClusterCode: 0

    }
    return currentLoggedInEmployee;
  }

  public static encryptData(data) {
    return btoa(unescape(encodeURIComponent(data)));
  }

  public static decryptData(data) {
    return decodeURIComponent(escape(window.atob(data)));
  }

  public static pipelineAuditLog(field: any, pipelineData: any, newData: any, oldCellValue: any, columnDefs: any) {

    let updatedValue: any;
    let fieldName = field.charAt(0).toUpperCase() + field.substr(1);
    if (fieldName && !["SVP Comments", "OVP Comments"].includes(fieldName)) {
      fieldName = fieldName.match(/[A-Z][a-z]+/g).join(" ");
    }
    if (field == "isOVPHelp" || field == "isSVPHelp" || field == "isMBPartner" || field == "comments" || field == "targetDescription") {
      fieldName = columnDefs.find((colDef) => colDef.field == field).headerName;
    }
    let pipelineAuditLog: PipelineAuditLog = new PipelineAuditLog();
    pipelineAuditLog.auditSource = "Pipeline";
    pipelineAuditLog.logType = "Manual"
    switch (field) {
      case "duration":
      case "discount":
      case "processInfo":
      case "comments":
        updatedValue = newData[field];
        pipelineAuditLog.oldValue = oldCellValue;
        break;
      case "opsLikelihood":
        updatedValue = newData?.opsLikelihood?.opsLikelihoodName;
        pipelineAuditLog.oldValue = oldCellValue ? oldCellValue.opsLikelihoodName : "";
        break;
      case "requiredLanguage":
        if (newData && newData.requiredLanguage && newData.requiredLanguage.length > 0) {
          updatedValue = newData.requiredLanguage.join();
        }
        break;
      case "oppStage":
        updatedValue = newData?.opportunityStage?.opportunityStageName;
        pipelineAuditLog.oldValue = oldCellValue;
        break;

      case "customPriority":
        if (newData.customPriority && newData.customPriority.length > 0) {
          updatedValue = newData?.customPriority[0]?.priorityName;
        }
        pipelineAuditLog.oldValue = oldCellValue ? oldCellValue[0]?.priorityName : "";

        break;

      case "deleteOpp":
        field = "deleteOpp";
        updatedValue = "This opportunity has been deleted"
        break;
    }
    pipelineAuditLog.fieldName = fieldName;
    pipelineAuditLog.newValue = updatedValue;
    pipelineAuditLog.pipelineId = newData.pipelineId;

    return pipelineAuditLog;
  }

  public static registartionAuditLog(field: any, pipelineData: any, newData: any, oldCellValue: any, columnDefs: any) {
    let auditLog: AuditLog = new AuditLog();
    auditLog.auditSource = "Pipeline";
    auditLog.logType = "Manual"
    let updatedValue: any;
    let fieldName = field.charAt(0).toUpperCase() + field.substr(1);
    if (fieldName && !["SVP Comments", "OVP Comments"].includes(fieldName)) {
      fieldName = fieldName.match(/[A-Z][a-z]+/g).join(" ");
    }
    if (field == "isOVPHelp" || field == "isSVPHelp" || field == "isMBPartner" || field == "comments" || field == "targetDescription") {
      fieldName = columnDefs.find((colDef) => colDef.field == field).headerName;
    }
    switch (field) {

      case "clientName":
        fieldName = "Client";
        auditLog.oldValue = oldCellValue;
        updatedValue = newData.client ? newData.client[0].clientName : "";

        break;

      case "industries":
        fieldName = "Industry";
        auditLog.oldValue = oldCellValue ? oldCellValue[0]?.industryName : "";
        updatedValue = newData.industries ? newData.industries[0]?.industryName : "";

        break;

      case "targetName":
        fieldName = "Target";
        auditLog.oldValue = oldCellValue;
        updatedValue = newData.target ? newData.target.targetName : "";

        break;

      case "caseCode":
        fieldName = "Case Code";
        auditLog.oldValue = oldCellValue ? oldCellValue.caseCode : "";
        updatedValue = newData.case ? newData.case.caseCode : "";
        break;

      case "othersInvolved":
        fieldName = "Others Involved";
        auditLog.oldValue = oldCellValue ? CommonMethods.getEmployeeNameList(oldCellValue).join(",") : "";
        updatedValue = newData.othersInvolved ? CommonMethods.getEmployeeNameList(newData.othersInvolved).join(",") : "";

        break;
      case "SVP Comments":
        auditLog.oldValue = oldCellValue?.comments ?? "";
        updatedValue = newData?.svp?.comments ?? "";
        break;
      case "OVP Comments":
        auditLog.oldValue = oldCellValue?.comments ?? "";
        updatedValue = newData?.operatingPartner?.comments ?? "";
        break;
      case "targetDescription":
        auditLog.oldValue = oldCellValue;
        updatedValue = newData[field];
        break;
      case "targetUnknown":
      case "latestStartDate":
        auditLog.oldValue = oldCellValue
        updatedValue = newData[field];
        break;

      case "expectedProjectName":
      case "teamComments":
        auditLog.oldValue = oldCellValue
        updatedValue = newData[field];
        break;

      case "expectedStart":
        auditLog.oldValue = oldCellValue.expectedStartDate;
        updatedValue = newData?.expectedStart?.expectedStartDate;
        break;
      case "note":
        auditLog.oldValue = oldCellValue.expectedStartDateNote;
        updatedValue = newData?.expectedStart?.expectedStartDateNote;
        break;
      case "teamSize":
        if (newData && newData.teamSize && newData.teamSize.length > 0) {
          updatedValue = newData.teamSize.map((team) => team.teamSize);
          updatedValue = updatedValue.join();
        }
        if (oldCellValue && oldCellValue.length > 0) {
          auditLog.oldValue = oldCellValue ? oldCellValue.map((team) => team.teamSize).join() : "";
        }
        break;
      case "svp":
      case "operatingPartner":
        if (newData[field] && newData[field].partners?.length > 0) {
          updatedValue = newData[field].partners.map((emp) => CommonMethods.getEmployeeName(emp));
          updatedValue = updatedValue.join();
        }
        if (oldCellValue && oldCellValue.partners.length > 0) {
          auditLog.oldValue = CommonMethods.getEmployeeNameList(oldCellValue.partners).join(",");

        }
        break;
      case "sellingPartner":
      case "requestedSM":
        if (newData[field] && newData[field].length > 0) {
          updatedValue = newData[field].map((emp) => CommonMethods.getEmployeeName(emp));
          updatedValue = updatedValue.join();
        }
        if (oldCellValue && oldCellValue.length > 0) {
          auditLog.oldValue = CommonMethods.getEmployeeNameList(oldCellValue).join(",");
        }
        break;

      case "likelihood":
        auditLog.oldValue = oldCellValue ? oldCellValue.label : "";
        updatedValue = newData?.likelihood.label;
        break;

      case "stageStatus":
        fieldName = "Stage";
        auditLog.oldValue = oldCellValue ? oldCellValue.stageTypeName : "";
        updatedValue = newData.registrationStage ? newData.registrationStage.stageTypeName : "";
        break;

      case "clientCommitment":
        updatedValue = newData?.clientCommitment?.clientCommitmentName;
        auditLog.oldValue = oldCellValue?.clientCommitmentName;
        break;
      case "sector":

        auditLog.oldValue = oldCellValue?.sector?.map((i) => i.industryName).join(",");
        updatedValue = newData?.sector?.map((s) => s.industryName).join(",");
        break;

      case "workPhase":
        updatedValue =
          "Is Continuation - " +
          newData?.workPhase.isContinuation +
          ", Is Next - " +
          newData?.workPhase.isNext +
          ", Is RestartPhase - " +
          newData?.workPhase.isRestartPhase +
          ", Related Case Code - " +
          newData?.workPhase.relatedCaseCode;
        if (oldCellValue) {
          auditLog.oldValue =
            "Is Continuation - " +
            oldCellValue?.isContinuation +
            ", Is Next - " +
            oldCellValue?.isNext +
            ", Is RestartPhase - " +
            oldCellValue?.isRestartPhase +
            ", Related Case Code - " +
            oldCellValue?.relatedCaseCode;


        }
        break;
      case "location":
        updatedValue =
          "Allocated - " +
          newData?.location?.allocated.map((s) => s.office?.officeAbbr) +
          ", Conflicted - " +
          newData?.location?.conflicted.map((s) => s.office?.officeAbbr) +
          ", Preferred - " +
          newData?.location?.preferred.map((s) => s.office?.officeAbbr);

        if (oldCellValue) {
          auditLog.oldValue =
            "Allocated - " +
            oldCellValue?.allocated.map((s) => s.office?.officeAbbr) +
            ", Conflicted - " +
            oldCellValue?.conflicted.map((s) => s.office?.officeAbbr) +
            ", Preferred - " +
            oldCellValue?.preferred.map((s) => s.office?.officeAbbr);

        }
        break;

      case "conflictedOffice":
        updatedValue = newData?.conflictedOffice?.map((of) => of.officeName).join(', ');
        break;
      case "allocatedOffice":
        updatedValue = newData?.allocatedOffice?.map((of) => of.officeName).join(', ');
        break;
      case "officeToBeStaffed":
        updatedValue = newData?.officeToBeStaffed?.map((of) => of.officeName).join(', ');
        auditLog.oldValue = oldCellValue ? oldCellValue?.map((of) => of.officeName).join(', ') : "";
        break;

      case "caseComplexity":
        updatedValue = newData.caseComplexity?.map((s) => s.caseComplexityName).join();
        auditLog.oldValue = oldCellValue?.map((s) => s.caseComplexityName).join();
        break;

      case "additionalServicesName":
        field = "Additional Services";
        updatedValue = newData.additionalServices?.map((s) => s?.additionalServicesName).join();
        auditLog.oldValue = oldCellValue?.map((s) => s?.additionalServicesName).join();
        break;



      case "clientType":
        updatedValue =
          "Is Corporate - " +
          newData?.clientType.isCorporate +
          ", Is Growth Equirt - " +
          newData?.clientType.isGrowthEquity +
          ", Is Hedge Fund Client - " +
          newData?.clientType.isHedgeFundClient +
          ", Is Infra - " +
          newData?.clientType.isInfra +
          ", Is Private Equiry - " +
          newData?.clientType.isPrivateEquity +
          ", Is Special Purpose Acquisition Company - " +
          newData?.clientType.isSpecialPurposeAcquisitionCompany;
        if (oldCellValue) {
          auditLog.oldValue =
            "Is Corporate - " +
            oldCellValue?.isCorporate +
            ", Is Growth Equirt - " +
            oldCellValue?.isGrowthEquity +
            ", Is Hedge Fund Client - " +
            oldCellValue?.isHedgeFundClient +
            ", Is Infra - " +
            oldCellValue?.isInfra +
            ", Is Private Equiry - " +
            oldCellValue?.isPrivateEquity +
            ", Is Special Purpose Acquisition Company - " +
            oldCellValue?.isSpecialPurposeAcquisitionCompany;
        }
        break;
      case "isRetainer":
      case "isMBPartner":

        updatedValue = newData[field] != 0 ? CommonMethods.getAnswerObject()[newData[field] - 1].name : "";
        auditLog.oldValue = oldCellValue != 0 ? CommonMethods.getAnswerObject()[oldCellValue - 1].name : "";
        break;
      case "isOVPHelp":
      case "isSVPHelp":
        updatedValue = newData[field] ? "Yes" : "No";
        auditLog.oldValue = oldCellValue ? "Yes" : "No";
        break;
    }
    auditLog.fieldName = fieldName;
    auditLog.newValue = updatedValue;
    auditLog.registrationId = newData.registrationId;
    auditLog.submissionDate = undefined;
    auditLog.submissionDate = undefined;
    return auditLog;
  }
  public static getOfficeCluster(caseOfficeCode, bainOffices) {
    let office = bainOffices.filter(x => x.officeCode == caseOfficeCode);
    if (office && office[0]) {
      return office[0].officeCluster;
    }
    return '';
  }
  public static isRegistrationArchived(registrationStageId, registrationStatusId, statusUpdateDate): boolean {
    let eighteenMonthOld = undefined
    let invaliddate = moment('0001-01-01T00:00:00Z').valueOf();
    let parseddate = moment(statusUpdateDate).valueOf();
    if (parseddate != invaliddate) {
      eighteenMonthOld = moment(statusUpdateDate).subtract(18, 'months');
    }
    if (registrationStageId == RegistrationStageEnum.Terminated ||
      registrationStageId == RegistrationStageEnum.ClosedLost ||
      registrationStageId == RegistrationStageEnum.ClosedDropped ||
      registrationStageId == RegistrationStageEnum.ClosedBainTurnedDown ||
      registrationStatusId == RegistrationStatus.Terminated ||
      registrationStatusId == RegistrationStatus.Duplicate ||
      (eighteenMonthOld != undefined && moment(statusUpdateDate) < eighteenMonthOld)
    ) {
      return true;
    } else {
      return false;
    }
  }
  public static getDelimiter(element) {
    return (element.delimiter != null && element.delimiter != undefined ? " " + element.delimiter + " " : ' - ');
  }
  public static getCustomPriority(data) {
    let printPriority = '';
    let clientPriority = data?.client && data?.client[0] && data?.client[0]?.clientPriorityName != null ? data.client[0].clientPriorityName : "";
    if (data?.customPriority && data?.customPriority?.length > 0) {

      let customClientPriority = data?.customPriority[0] ? data?.customPriority[0]?.priorityName : "";
      let showStar = "";
      if (customClientPriority != "" && clientPriority != customClientPriority) {
        showStar = "*";
      }
      printPriority = customClientPriority + showStar;
    } else {
      printPriority = clientPriority;
    }
    return printPriority;
  }
  public static getOpportunityName(pipelineData, oppNameFields) {

    let oppNameList = []
    oppNameFields.forEach(element => {
      
      if (element.field == "clientName") {
        let clients = pipelineData.client?.map(r => { if (r.clientName && r.clientName != '') { return r.clientName } })
        if (clients) {
          oppNameList.push(clients?.join(',') + this.getDelimiter(element))
        }
      } else if (element.field == 'requestedSM') {
        if (pipelineData.requestedSM) {
          let partnerList = CommonMethods.getEmployeeNameList(pipelineData.requestedSM)
          if (partnerList && partnerList.length > 0) {
            oppNameList.push(partnerList.join(',') + this.getDelimiter(element));
          }
        }
      }
      else if (element.field == "opportunityTypeDetails") {
        let oppTypeDetails = CommonMethods.generateOpportunityTypeDetailsLabel(pipelineData.opportunityTypeDetails)
        if (oppTypeDetails) {
          oppNameList.push(oppTypeDetails + this.getDelimiter(element))
        }
      }
      else if (element.field == 'clientInformalName') {
        if (pipelineData.clientInformalName && pipelineData.clientInformalName != '') {
          oppNameList.push(pipelineData.clientInformalName + this.getDelimiter(element));
        }
      }
      else if (element.field == "sector") {
        if (pipelineData.sector) {
          let values = [];
          pipelineData.sector.forEach(element => {
            if (element.industryId > 0) {
              values.push(element.industryName)
            }
          });
          if (values && values.length > 0) {
            oppNameList.push(values.join(',') + this.getDelimiter(element));
          }
        }
      }
      else if (element.field == "customPriority" && pipelineData.client && pipelineData.client.length > 0) {
        let printPriority = this.getCustomPriority(pipelineData);
        if (printPriority && printPriority != "") {
          oppNameList.push(printPriority + this.getDelimiter(element));
        }
      } else if (element.field == "hasRegistration") {
        if (pipelineData.poId != "" && pipelineData.poId?.length < 36) {
          oppNameList.push(pipelineData.poId + this.getDelimiter(element));
        }
      }
      else if (element.field == "industries") {
        let industries = pipelineData.industries?.map(r => { if (r.abbreviation && r.abbreviation != '') { return r.abbreviation } })
        if (industries && industries.length > 0) {
          oppNameList.push(industries?.join(',') + this.getDelimiter(element))
        }
      }
      else if (element.field == "targetName") {
        if (pipelineData.target?.targetName && pipelineData.target?.targetName != '') {
          let targetName = pipelineData.target?.targetName;
          oppNameList.push(targetName + this.getDelimiter(element));
        }
      }
      else if (element.field == "targetDescription") {
        if (pipelineData?.targetDescription && pipelineData.targetDescription != '') {
          let targetDescription = pipelineData.targetDescription;
          oppNameList.push(targetDescription + this.getDelimiter(element));
        }
      }
      else if (element.field == "targetUnknown") {
        if (pipelineData?.targetUnknown && pipelineData.targetUnknown != '') {
          let targetUnknown = pipelineData.targetUnknown;
          oppNameList.push(targetUnknown + this.getDelimiter(element));
        }
      }

      else if (element.field == "mbStatus") {
        let mbStatus = ''
        if (pipelineData.mbStatus) {
          if (pipelineData.mbStatus.mbStatusId == dealMBStatus.SingleRegistration) {
            mbStatus = 'N'
          } else if (pipelineData.mbStatus.mbStatusId == dealMBStatus.ActiveMB || pipelineData.mbStatus.mbStatusId == dealMBStatus.PotentialMB) {
            mbStatus = 'Y'
          }
        }
        oppNameList.push(mbStatus + this.getDelimiter(element));
      }
      else if (element.field == "expectedStart") {
        if (pipelineData.expectedStart) {
          let expectedStart = '';
          if (pipelineData.expectedStart?.expectedStartDate) {
            this._formatTimeZone = new FormatTimeZone();
            let dateparsed = this._formatTimeZone.transform(pipelineData.expectedStart?.expectedStartDate, true);
            expectedStart = moment(dateparsed).format('DD-MMM-YYYY');
          }
          oppNameList.push(expectedStart + this.getDelimiter(element));
        }
      }
      else if (element.field == 'latestStartDate') {
        let latestStartDate = ''
        if (pipelineData.latestStartDate) {
          this._formatTimeZone = new FormatTimeZone();
          let dateparsed = this._formatTimeZone.transform(pipelineData.latestStartDate, true);
          latestStartDate = moment(dateparsed).format('DD-MMM-YYYY');
          oppNameList.push(latestStartDate + this.getDelimiter(element));
        }
      }
      else if (element.field == "teamSize") {
        if (pipelineData.teamSize) {
          let values = [];
          pipelineData.teamSize.forEach(element => {
            if (element.teamSizeId > 0) {
              values.push(element.teamSize)
            }
          });
          if (values && values.length > 0) {
            oppNameList.push(values.join(',') + this.getDelimiter(element));
          }
        }
      }
      else if (element.field == "duration") {
        if (pipelineData.duration) {
          oppNameList.push(pipelineData.duration + this.getDelimiter(element));
        }
      }
      else if (element.field == "sellingPartner") {
        if (pipelineData.sellingPartner) {
          let partnerList = CommonMethods.getEmployeeNameList(pipelineData.sellingPartner)
          if (partnerList && partnerList.length > 0) {
            oppNameList.push(partnerList.join(',') + this.getDelimiter(element));
          }
        }
      }
      else if (element.field == "operatingPartner") {
        if (pipelineData.operatingPartner) {
          let partnerList = CommonMethods.getEmployeeNameList(pipelineData.operatingPartner)
          if (partnerList && partnerList.length > 0) {
            oppNameList.push(partnerList.join(',') + this.getDelimiter(element));
          }
        }
      }
      else if (element.field == "othersInvolved") {
        if (pipelineData.othersInvolved) {
          let partnerList = CommonMethods.getEmployeeNameList(pipelineData.othersInvolved)
          if (partnerList && partnerList.length > 0) {
            oppNameList.push(partnerList.join(',') + this.getDelimiter(element));
          }
        }
      }
      else if (element.field == "manager") {
        if (pipelineData.manager) {
          let partnerList = CommonMethods.getEmployeeNameList(pipelineData.manager)
          if (partnerList && partnerList.length > 0) {
            oppNameList.push(partnerList.join(',') + this.getDelimiter(element));
          }
        }
      }
      else if (element.field == "likelihood") {
        if (pipelineData.likelihood.likelihoodId) {
          let renderedLikelihoodValue = "";
          if (pipelineData.likelihood.label != null) {
            renderedLikelihoodValue = pipelineData.likelihood.label + '%'
          }
          oppNameList.push(renderedLikelihoodValue + this.getDelimiter(element));
        }
      }
      else if (element.field == "location") {
        if (pipelineData.location && pipelineData.location.preferred) {
          let preferredList = [];
          pipelineData.location.preferred.map((office) => {
            preferredList.push(office.office.officeAbbr);
          });
          if (preferredList && preferredList.length > 0) {
            oppNameList.push(preferredList.join(', ') + this.getDelimiter(element));
          }

        }
      }
      else {
        if (element.field != "customPriority") {
          oppNameList.push(pipelineData[element.field]);
        }
      }
    });
    let result = oppNameList.filter(r => r != "" && r != undefined && r != null).join('')
    return this.removeSpecialChar(result);
  }

  public static assignPipelineDataToBucketMapping(pipelineBucketMapping, rowData, oppNameFields) {
    pipelineBucketMapping.forEach((mappingData) => {
      let pipelineData;
      if (mappingData?.registrationId && mappingData?.registrationId > 0) {
        pipelineData = rowData.find((x) => x.registrationId == mappingData.registrationId);
        if (pipelineData) {
          pipelineData.oppName = pipelineData
            ? CommonMethods.getOpportunityName(pipelineData, oppNameFields)
            : "";
        }
      }

      if (pipelineData) {
        mappingData.pipeline = pipelineData;
      }
    });

    return pipelineBucketMapping
  }

  public static removeSpecialChar(str) {
    if (str) {
      str = str.trim();
      if (str != null && str.length > 0 && (str.charAt(str.length - 1) == '-' || str.charAt(str.length - 1) == '/')) {
        str = str.substring(0, str.length - 1);
      }
      return str;
    }
  }


  public static getWeekStart(date: Date, format: string = 'DD-MMM-YYYY') {
    if (date) {
      let weekStartDate = moment.utc(date).startOf('week');

      // Push Sunday week starts to Monday
      if (weekStartDate.weekday() == 0) {
        weekStartDate = weekStartDate.add(1, "days");
      }
      return weekStartDate.format(format);
    }
  }
  public static compareCaseCodeObjectManually(oldObject: any, newObject: any, userRegion: any) {
       const differingProperties: DifferingProperty[] = [];
    

    //Resource Details
if (_.xorBy(oldObject.ovp, newObject.ovp, 'employeeCode').length > 0)
  {
      differingProperties.push({ property: 'OVP', oldValue: oldObject.ovp, newValue: newObject.ovp, type: 'registration', auditLogSource: 'caseCodeForm' });
  }
  if (_.xorBy(oldObject.svp, newObject.svp, 'employeeCode').length > 0)
  {
      differingProperties.push({ property: 'SVP', oldValue: oldObject.svp, newValue: newObject.svp, type: 'registration', auditLogSource: 'caseCodeForm' });
  }
  if (oldObject.manager?.employeeCode != newObject.manager?.employeeCode) {
    differingProperties.push({ property: 'CaseManager', oldValue: oldObject.manager, newValue: newObject.manager, type: 'caseCodeForm', auditLogSource: 'caseCodeForm' });
  }

  if (_.xorBy(oldObject.coreAdvisor, newObject.coreAdvisor, 'employeeCode').length > 0)
    {
        differingProperties.push({ property: 'CoreAdvisor', oldValue: oldObject.coreAdvisor, newValue: newObject.coreAdvisor, type: 'caseCodeForm', auditLogSource: 'caseCodeForm' });
    }
    if (_.xorBy(oldObject.lightAdvisor, newObject.lightAdvisor, 'employeeCode').length > 0)
      {
          differingProperties.push({ property: 'LightAdvisor', oldValue: oldObject.lightAdvisor, newValue: newObject.lightAdvisor, type: 'caseCodeForm', auditLogSource: 'caseCodeForm' });
      }
      
      if (_.xorBy(oldObject.qtr, newObject.qtr, 'employeeCode').length > 0)
        {
            differingProperties.push({ property: 'QTR Back Partner', oldValue: oldObject.qtr, newValue: newObject.qtr, type: 'caseCodeForm', auditLogSource: 'caseCodeForm' });
        }

  if (_.xorBy(oldObject.sellingPartners, newObject.sellingPartners, 'employeeCode').length > 0)
  {
      differingProperties.push({ property: 'Selling Partner', oldValue: oldObject.sellingPartners, newValue: newObject.sellingPartners, type: 'registration', auditLogSource: 'caseCodeForm' });
  }
  if (_.xorBy(oldObject.highBainExpert, newObject.highBainExpert, 'employeeCode').length > 0)
    {
        differingProperties.push({ property: 'Bain Expert High ', oldValue: oldObject.highBainExpert, newValue: newObject.highBainExpert, type: 'caseCodeForm', auditLogSource: 'caseCodeForm' });
    }
    if (_.xorBy(oldObject.lightBainExpert, newObject.lightBainExpert, 'employeeCode').length > 0)
      {
          differingProperties.push({ property: 'Bain Expert Light', oldValue: oldObject.lightBainExpert, newValue: newObject.lightBainExpert, type: 'caseCodeForm', auditLogSource: 'caseCodeForm' });
      }
  
  

  //Case Details
  if (oldObject.capability?.capabilityId != newObject.capability?.capabilityId)
    {
        differingProperties.push({ property: 'Capability', oldValue: oldObject.capability?.capabilityName, newValue: newObject.capability?.capabilityName, type: 'caseCodeForm', auditLogSource: 'caseCodeForm' });
    }
    if (oldObject.fundType?.fundTypeId != newObject.fundType?.fundTypeId)
      {
          differingProperties.push({ property: 'FundType', oldValue: oldObject.fundType?.fundTypeId, newValue: newObject.fundType?.fundTypeId, type: 'caseCodeForm', auditLogSource: 'caseCodeForm' });
      }
    if (oldObject.duration != newObject.duration) {
      differingProperties.push({ property: 'Duration', oldValue: oldObject.duration, newValue: newObject.duration, type: 'pipeline', auditLogSource: 'caseCodeForm' });
    }
    if (moment(oldObject.expectedStartDate).format('DD-MMM-YYYY') != moment(newObject.expectedStartDate).format('DD-MMM-YYYY')) {
      differingProperties.push({ property: 'Expected Start', oldValue: moment(oldObject.expectedStartDate).format('DD-MMM-YYYY'), newValue: moment(newObject.expectedStartDate).format('DD-MMM-YYYY'), type: 'registration', auditLogSource: 'caseCodeForm' });
    }

    if (oldObject.expectedProjectName != newObject.expectedProjectName) {
      differingProperties.push({ property: 'Expected Project Name', oldValue: oldObject.expectedProjectName, newValue: newObject.expectedProjectName, type: 'registration', auditLogSource: 'caseCodeForm' });
    }
    
    if (!this.deepEqual(oldObject.opportunityTypeDetails,newObject.opportunityTypeDetails))
      {
          differingProperties.push({ property: 'Opportunity Type Details', oldValue: oldObject?.opportunityTypeDetails, newValue: newObject?.opportunityTypeDetails, type: 'registration', auditLogSource: 'caseCodeForm' });
      }

    if (oldObject.revenueCurrency?.pegCurrencyId != newObject.revenueCurrency?.pegCurrencyId) {
      differingProperties.push({ property: 'Currency', oldValue: oldObject.revenueCurrency?.currencyCode, newValue: newObject.revenueCurrency?.currencyCode, type: 'pipeline', auditLogSource: 'caseCodeForm' });
    }
    if (oldObject.ratePricedAt != newObject.ratePricedAt) {
      differingProperties.push({ property: 'RatePricedAt', oldValue: oldObject.ratePricedAt, newValue: newObject.ratePricedAt, type: 'caseCodeForm', auditLogSource: 'caseCodeForm' });
    }
    let isdifferent = this.compaireTeamSize(oldObject?.teamSize, newObject?.teamSize)
    if (isdifferent == true) {
      differingProperties.push({ property: 'Team Size', oldValue: oldObject.teamSize, newValue: newObject.teamSize, type: 'registration', auditLogSource: 'caseCodeForm' });
    }
    
    if (oldObject?.weeklyRackRateId != newObject?.weeklyRackRateId) {
      differingProperties.push({ property: 'WeeklyRackRate', oldValue: oldObject.weeklyRackRateId, newValue: newObject.weeklyRackRateId, type: 'caseCodeForm', auditLogSource: 'caseCodeForm' });
    }
  if (oldObject.teamComments != newObject.teamComments)
  {
      differingProperties.push({ property: 'Team Comments', oldValue: oldObject.teamComments, newValue: newObject.teamComments, type: 'registration', auditLogSource: 'caseCodeForm' });
  }
  
  if (oldObject.isDiscounted != newObject.isDiscounted) {
    differingProperties.push({ property: 'IsDiscounted', oldValue: oldObject.isDiscounted, newValue: newObject.isDiscounted, type: 'caseCodeForm', auditLogSource: 'caseCodeForm' });
  }
  if (oldObject.discountNotes != newObject.discountNotes) {
    differingProperties.push({ property: 'DiscountNotes', oldValue: oldObject.discountNotes, newValue: newObject.discountNotes, type: 'caseCodeForm', auditLogSource: 'caseCodeForm' });
  }
  if (oldObject.financeNotes != newObject.financeNotes) {
    differingProperties.push({ property: 'FinanceNotes', oldValue: oldObject.financeNotes, newValue: newObject.financeNotes, type: 'caseCodeForm', auditLogSource: 'caseCodeForm' });
  }
//Billing Details
if (oldObject.billingPartner?.employeeCode != newObject.billingPartner?.employeeCode) {
  differingProperties.push({ property: 'BillingPartner', oldValue: oldObject.billingPartner, newValue: newObject.billingPartner, type: 'caseCodeForm', auditLogSource: 'caseCodeForm' });
}
  if (oldObject.billingOffice?.officeCode != newObject.billingOffice?.officeCode) {
    differingProperties.push({ property: 'BillingOffice', oldValue: oldObject.billingOffice, newValue: newObject.billingOffice, type: 'caseCodeForm', auditLogSource: 'caseCodeForm' });
  }
  if (oldObject.billingContact != newObject.billingContact) {
    differingProperties.push({ property: 'BillingContact', oldValue: oldObject.billingContact, newValue: newObject.billingContact, type: 'caseCodeForm', auditLogSource: 'caseCodeForm' });
  }
  if (oldObject.billingEmail != newObject.billingEmail) {
    differingProperties.push({ property: 'BillingEmail', oldValue: oldObject.billingEmail, newValue: newObject.billingEmail, type: 'caseCodeForm', auditLogSource: 'caseCodeForm' });
  }
 
return differingProperties;
  }
  public static compareObjectManually(oldObject: any, newObject: any, userRegion: any) {
    const differingProperties: DifferingProperty[] = [];

    if ((newObject.opportunityDetails.isPipelineInfoRequested == true && newObject.opportunityDetails.isPipelineEdit == true) || (newObject.opportunityDetails.isExpertInfoRequested == true && newObject.opportunityDetails.isExpertEdit == true)) {
      //Checking expert
      if (oldObject?.opportunityDetails?.isExpertInfoRequested && newObject?.opportunityDetails?.isExpertInfoRequested) {
        if (oldObject.experts && oldObject.experts.expertCall != newObject.experts.expertCall) {
          differingProperties.push({ property: 'expertCall', oldValue: oldObject.experts.expertCall, newValue: newObject.experts.expertCall, type: 'expert', auditLogSource: 'registartion' });
        }
        if (oldObject.experts && oldObject.experts.expertTeamNotes != newObject.experts.expertTeamNotes) {
          differingProperties.push({ property: 'expertTeamNotes', oldValue: oldObject.experts.expertTeamNotes, newValue: newObject.experts.expertTeamNotes, type: 'expert', auditLogSource: 'registartion' });
        }


        if (oldObject.experts && oldObject.experts.typesOfExpertise != newObject.experts.typesOfExpertise) {
          differingProperties.push({ property: 'typesOfExpertise', oldValue: oldObject.experts.typesOfExpertise, newValue: newObject.experts.typesOfExpertise, type: 'expert', auditLogSource: 'registartion' });
        }
        if (oldObject.experts && oldObject.experts.identifyExperts != JSON.parse(newObject.experts.identifyExperts)) {
          differingProperties.push({ property: 'identifyExperts', oldValue: oldObject.experts.identifyExperts, newValue: JSON.parse(newObject.experts.identifyExperts), type: 'expert', auditLogSource: 'registartion' });
        }

        if (oldObject.experts && oldObject.experts.scheduledFields.expertCallDate != newObject.experts.scheduledFields?.expertCallDate) {
          differingProperties.push({ property: 'expertCallDate', oldValue: oldObject.experts.scheduledFields.expertCallDate, newValue: newObject.experts.scheduledFields.expertCallDate, type: 'expert', auditLogSource: 'registartion' });
        }
        if (oldObject.experts && _.xorBy(oldObject.experts.preferredExpertsForCase, newObject.experts.preferredExpertsForCase, 'employeeCode').length > 0) {
          differingProperties.push({ property: 'preferredExpertsForCase', oldValue: oldObject.experts.preferredExpertsForCase, newValue: newObject.experts.preferredExpertsForCase, type: 'expert', auditLogSource: 'registartion' });
        }

        if (oldObject.experts && _.xorBy(oldObject.experts.scheduledFields.expertsOnCall, newObject.experts.scheduledFields.expertsOnCall, 'employeeCode').length > 0) {
          differingProperties.push({ property: 'expertsOnCall', oldValue: oldObject.experts.scheduledFields.expertsOnCall, newValue: newObject.experts.scheduledFields.expertsOnCall, type: 'expert', auditLogSource: 'registartion' });
        }

      }



      // Check Pipeline 
      if (oldObject?.opportunityDetails?.isPipelineInfoRequested && newObject?.opportunityDetails?.isPipelineInfoRequested) {

        if (_.xorBy(oldObject.pipeline.ovp, newObject.pipeline.OVP, 'employeeCode').length > 0) {
          differingProperties.push({ property: 'OVP', oldValue: oldObject.pipeline.ovp, newValue: newObject.pipeline.OVP, type: 'pipeline', auditLogSource: 'pipeline' });
        }
        if (_.xorBy(oldObject.pipeline.svp, newObject.pipeline.SVP, 'employeeCode').length > 0) {
          differingProperties.push({ property: 'SVP', oldValue: oldObject.pipeline.svp, newValue: newObject.pipeline.SVP, type: 'pipeline', auditLogSource: 'pipeline' });
        }
        if (_.xorBy(oldObject.pipeline.sellingPartners, newObject.pipeline.sellingPartners, 'employeeCode').length > 0) {
          differingProperties.push({ property: 'Selling Partner', oldValue: oldObject.pipeline.sellingPartners, newValue: newObject.pipeline.sellingPartners, type: 'pipeline', auditLogSource: 'pipeline' });
        }
        if (_.xorBy(oldObject.pipeline.requestedSM, newObject.pipeline.requestedSM, 'employeeCode').length > 0) {
          differingProperties.push({ property: 'Requested Senior Manager', oldValue: oldObject.pipeline.requestedSM, newValue: newObject.pipeline.requestedSM, type: 'pipeline', auditLogSource: 'registartion' });
        }

        if (oldObject.pipeline.isLikelyOVP != newObject.pipeline.isLikelyOVP) {
          differingProperties.push({ property: 'OVP Help', oldValue: oldObject.pipeline.isLikelyOVP, newValue: newObject.pipeline.isLikelyOVP, type: 'pipeline', auditLogSource: 'pipeline' });
        }
        if (oldObject.pipeline.isLikelySVP != newObject.pipeline.isLikelySVP) {
          differingProperties.push({ property: 'SVP Help', oldValue: oldObject.pipeline.isLikelySVP, newValue: newObject.pipeline.isLikelySVP, type: 'pipeline', auditLogSource: 'pipeline' });
        }
        //Office To Be Staffed  field are not allowed to add/edit for america region's user, 
        //so for avoiding unnecessary erorr not creating  change log for this filed. 
        if (userRegion != Region.Americas && _.xorBy(oldObject.pipeline.officeToBeStaffed, newObject.pipeline.officeToBeStaffed, 'officeCode').length > 0) {
          differingProperties.push({ property: 'Office To Be Staffed', oldValue: oldObject.pipeline.officeToBeStaffed, newValue: newObject.pipeline.officeToBeStaffed, type: 'pipeline', auditLogSource: 'pipeline' });
        }

        if (oldObject.pipeline.totalRevenue != newObject.pipeline.totalRevenue) {
          differingProperties.push({ property: 'Estimated Total Revenue', oldValue: oldObject.pipeline?.totalRevenue, newValue: newObject.pipeline?.totalRevenue, type: 'pipeline', auditLogSource: 'pipeline' });
        }
        if (oldObject.pipeline?.revenueCurrency?.pegCurrencyId != newObject.pipeline?.revenueCurrency?.pegCurrencyId) {
          differingProperties.push({ property: 'Currency', oldValue: oldObject.pipeline?.revenueCurrency?.currencyCode, newValue: newObject.pipeline?.revenueCurrency?.currencyCode, type: 'pipeline', auditLogSource: 'pipeline' });
        }
        if (oldObject.pipeline.isRetainer != JSON.parse(newObject.pipeline.isRetainer)) {
          differingProperties.push({ property: 'IsRetainer', oldValue: oldObject.pipeline.isRetainer, newValue: JSON.parse(newObject.pipeline.isRetainer), type: 'pipeline', auditLogSource: 'pipeline' });
        }
        if (oldObject.pipeline.isMultibidderPartner != JSON.parse(newObject.pipeline.isMultibidderPartner)) {
          differingProperties.push({ property: 'IsMultibidderPartner', oldValue: oldObject.pipeline.isMultibidderPartner, newValue: JSON.parse(newObject.pipeline.isMultibidderPartner), type: 'pipeline', auditLogSource: 'pipeline' });
        }


        if (moment(oldObject.pipeline.expectedStartDate).format('DD-MMM-YYYY') != moment(newObject.pipeline.expectedStartDate).format('DD-MMM-YYYY')) {
          differingProperties.push({ property: 'Expected Start', oldValue: moment(oldObject.pipeline.expectedStartDate).format('DD-MMM-YYYY'), newValue: moment(newObject.pipeline.expectedStartDate).format('DD-MMM-YYYY'), type: 'pipeline', auditLogSource: 'pipeline' });
        }
        if (moment(oldObject.pipeline.latestStartDate).format('DD-MMM-YYYY') != moment(newObject.pipeline.latestStartDate).format('DD-MMM-YYYY')) {
          differingProperties.push({ property: 'Latest Start Date', oldValue: oldObject.pipeline.latestStartDate != null ? moment(oldObject.pipeline.latestStartDate).format('DD-MMM-YYYY') : null, newValue: newObject.pipeline.latestStartDate != null ? moment(newObject.pipeline.latestStartDate).format('DD-MMM-YYYY') : null, type: 'pipeline', auditLogSource: 'pipeline' });
        }
        let isdifferent = this.compaireTeamSize(oldObject?.pipeline?.teamSize, newObject?.pipeline?.teamSize)
        if (isdifferent == true) {
          differingProperties.push({ property: 'Team Size', oldValue: oldObject.pipeline.teamSize, newValue: newObject.pipeline.teamSize, type: 'pipeline', auditLogSource: 'pipeline' });

        }

        if (oldObject.pipeline.duration != newObject.pipeline.duration) {
          differingProperties.push({ property: 'Duration', oldValue: oldObject.pipeline.duration, newValue: newObject.pipeline.duration, type: 'pipeline', auditLogSource: 'pipeline' });
        }
        if (oldObject.pipeline.teamComments != newObject.pipeline.teamComments) {
          differingProperties.push({ property: 'Team Comments', oldValue: oldObject.pipeline.teamComments, newValue: newObject.pipeline.teamComments, type: 'pipeline', auditLogSource: 'pipeline' });
        }


        if (oldObject.pipeline?.clientCommitment?.clientCommitmentId != newObject.pipeline?.clientCommitment?.clientCommitmentId) {
          differingProperties.push({ property: 'Client Commitment', oldValue: oldObject.pipeline.clientCommitment, newValue: newObject.pipeline.clientCommitment, type: 'pipeline', auditLogSource: 'pipeline' });
        }
        if (oldObject.pipeline.likelihood?.value != newObject.pipeline.likelihood?.value) {
          differingProperties.push({ property: 'Likelihood', oldValue: oldObject.pipeline.likelihood, newValue: newObject.pipeline.likelihood, type: 'pipeline', auditLogSource: 'pipeline' });
        }
        if (oldObject.pipeline.likelihood?.value != newObject.pipeline.likelihood?.value) {
          differingProperties.push({ property: 'Likelihood', oldValue: oldObject.pipeline.likelihood, newValue: newObject.pipeline.likelihood, type: 'pipeline', auditLogSource: 'pipeline' });
        }
        if (oldObject.pipeline.expectedProjectName != newObject.pipeline.expectedProjectName) {
          differingProperties.push({ property: 'Expected Project Name', oldValue: oldObject.pipeline.expectedProjectName, newValue: newObject.pipeline.expectedProjectName, type: 'pipeline', auditLogSource: 'pipeline' });
        }
        let requiredLanguageDiffernce1 = newObject.pipeline.requiredLanguage.filter((element) => !oldObject.pipeline.requiredLanguage.includes(element));
        let requiredLanguageDiffernce2 = oldObject.pipeline.requiredLanguage.filter((element) => !newObject.pipeline.requiredLanguage.includes(element));

        if (requiredLanguageDiffernce1.length > 0 || requiredLanguageDiffernce2.length > 0) {
          differingProperties.push({ property: 'Required Language', oldValue: oldObject.pipeline.requiredLanguage, newValue: newObject.pipeline.requiredLanguage, type: 'pipeline', auditLogSource: 'pipeline' });

        }
        if (oldObject.pipeline.processInfo != newObject.pipeline.processInfo) {
          differingProperties.push({ property: 'Process Info', oldValue: oldObject.pipeline.processInfo, newValue: newObject.pipeline.processInfo, type: 'expert', auditLogSource: 'pipeline' });
          differingProperties.push({ property: 'Process Info', oldValue: oldObject.pipeline.processInfo, newValue: newObject.pipeline.processInfo, type: 'pipeline', auditLogSource: 'pipeline' });
        }

        if (_.xorBy(oldObject.pipeline.caseComplexity, newObject.pipeline.caseComplexity, 'caseComplexityId').length > 0) {
          differingProperties.push({ property: 'Case Complexity', oldValue: oldObject.pipeline.caseComplexity, newValue: newObject.pipeline.caseComplexity, type: 'pipeline', auditLogSource: 'pipeline' });
        }

      }
    }


    //Adding Bid Date Out of Pipeline because used in Expert and Pipeline Email
    if (moment(oldObject.opportunityDetails?.bidDate).format('DD-MMM-YYYY') != moment(newObject.pipeline?.bidDate).format('DD-MMM-YYYY')) {
      differingProperties.push({
        property: 'Bid Date', oldValue: oldObject.pipeline.bidDate != null ? moment(oldObject.pipeline?.bidDate).format('DD-MMM-YYYY') : null,
        newValue: newObject.pipeline?.bidDate != null ? moment(newObject.pipeline?.bidDate).format('DD-MMM-YYYY') : null, type: 'expert', auditLogSource: 'pipeline'
      });

      differingProperties.push({
        property: 'Bid Date', oldValue: oldObject.pipeline.bidDate != null ? moment(oldObject.pipeline?.bidDate).format('DD-MMM-YYYY') : null,
        newValue: newObject.pipeline?.bidDate != null ? moment(newObject.pipeline?.bidDate).format('DD-MMM-YYYY') : null, type: 'pipeline', auditLogSource: 'pipeline'
      });
    }

    //Checking expected start date
    // if (key === 'expectedStartDate') {
    //   if (moment(oldObject).format('DD-MMM-YYYY') !== moment(newObject[key]).format('DD-MMM-YYYY')) {
    //     return true;
    //   }
    // }

    // if (moment(obj1).format('DD-MMM-YYYY') !== moment(obj2[key]).format('DD-MMM-YYYY')) {
    //   return true;
    // }
    return differingProperties;

  }

  public static deepEqual(obj1, obj2) {
    // If both are the same reference or are both null/undefined, return true
    if (obj1 === obj2) return true;

    // If either of them is not an object, they are not equal
    if (typeof obj1 !== "object" || obj1 === null || typeof obj2 !== "object" || obj2 === null) {
        return false;
    }

    // Get keys of both objects
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    // If the number of keys is different, the objects are not equal
    if (keys1.length !== keys2.length) return false;

    // Check each key and its value
    for (let key of keys1) {
        // If key doesn't exist in obj2, return false
        if (!keys2.includes(key)) return false;

        // Recursively check deep equality for nested objects or arrays
        if (!this.deepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
}
  public static compaireTeamSize(oldObject, newObject) {
    let isDifferent = false;
    if (oldObject?.length != newObject?.length) {
      isDifferent = true;
    }
    else {
      oldObject?.forEach(oldelement => {

       
        var oldObjData = oldObject?.filter(x => x.teamSize == oldelement.teamSize)
        var newObjData = newObject?.filter(x => x.teamSize == oldelement.teamSize)
        if (oldObjData?.length != newObjData?.length) {
          isDifferent = true;
        }
      });
    }
    return isDifferent;
  }
  public static getAnswerObject() {
    return [
      { value: 1, name: 'Yes' },
      { value: 2, name: 'No' },
      { value: 3, name: 'I don’t know' },
    ];
  }
  public static isAuthorizedToAccessPipelineAndExpert(coreService: CoreService): boolean {
    let allowedOffices = coreService.appSettings.allowedOffices.split(',');
    let loggedinUserOffice = coreService.loggedInUser.employeeOffice.toString();
    if (allowedOffices.includes(loggedinUserOffice)) {
      return true;
    } else {
      return false;
    }
  }
  public static isAuthorizedOffice(coreService: CoreService): boolean {
    // In case of admin all the section will be allowed
    if (coreService.loggedInUser.securityRoles[0].id == RoleType.PEGAdministrator) {
      return true;
    }
    let allowedOffices = coreService.appSettings.allowedOffices.split(',');
    let restrictedOffices = coreService.appSettings.restrictedOffices.split(',');
    let loggedinUserOffice = coreService.loggedInUser.employeeOffice.toString();
    let loggedinRegionId = coreService.loggedInUser.employeeRegionId;
    if (loggedinRegionId == Region.EMEA) {
      if (allowedOffices.includes(loggedinUserOffice)) {
        return true;
      } else {
        return false;
      }
    } else if (loggedinRegionId == Region.APAC) {
      return false;
    } else if (loggedinRegionId == Region.Americas) {
      return true;
    }
    return true;
  }

  public static isAuthorizedToEditStage(coreService: CoreService): boolean {
    return coreService.loggedInUserRoleId === RoleType.MultibidderManager || coreService.loggedInUserRoleId === RoleType.PEGAdministrator || coreService.loggedInUserRoleId === RoleType.PAM || coreService.loggedInUserRoleId === RoleType.TSGSupport
      || coreService.loggedInUserRoleId === RoleType.PEGOperations || coreService.loggedInUserRoleId === RoleType.PEGLeadership || coreService.loggedInUserRoleId === RoleType.PracticeAreaManagerRestricted;
  }

  public static sortArrayObjectByField(arrayObj: any[], fieldName, sortType) {
    if (arrayObj?.length > 0) {
      switch (sortType) {
        case SortType.Asc:
          arrayObj.sort((a, b) => (a[fieldName] < b[fieldName] ? -1 : 1));
          break;
        case SortType.Desc:
          arrayObj.sort((a, b) => (a[fieldName] > b[fieldName] ? -1 : 1));
          break;
        default: break;
      }
    }
  }

  public static filterTypeOfWork(workTypes) {
    return workTypes.filter(wt => wt.workTypeId < 8);
  }

  public static sortConflicts(stageId, a, b): number {
    let futureDate = moment().subtract(100, 'year').valueOf()
    let aSortOrder = a?.sortOrder ?? 5; //sortOrder 5 for blanks
    switch (stageId) {
      case 4:
      case 5: {
        if (a.registrationStageId == b?.registrationStageId) {
          let result = (((a?.caseEndDate) ? new Date(a?.caseEndDate).getTime() : futureDate) > ((b?.caseEndDate) ?
            new Date(b?.caseEndDate).getTime() : futureDate)) ? -1 : (((a?.caseEndDate) ? new Date(a?.caseEndDate).getTime() :
              futureDate) < ((b?.caseEndDate) ? new Date(b?.caseEndDate).getTime() : futureDate) ? 1 : 0);
          return result;
        }
      }
      default: {
        let result = aSortOrder > b?.sortOrder ? 1 : aSortOrder < b?.sortOrder ? -1 : 0;
        return result;
      }
    }
  }

  public static getStageBasedOnCase(caseData) {
    // To update the registration stage
    // When a new case code is added (Excluding weekends)- 
    //    update stage to work started (If the end date is future)
    //    update the stage to work completed (If the end date is past)

    if (caseData && caseData?.caseEndDate && caseData?.caseEndDate != '') {
      let stage = moment(caseData?.caseEndDate).add(1, 'days').startOf('day') <= moment(new Date()) ?
        {
          "registrationStageId": Number(RegistrationStageEnum.WorkCompleted),
          "stageTypeName": "Work Completed"
        } :
        {
          "registrationStageId": Number(RegistrationStageEnum.WorkStarted),
          "stageTypeName": "Work Started"
        }
      return stage;
    }
  }

  // Write a function to convert a string to title case
  public static toTitleCaseWithSpace(str) {
    if (str && str != '') {
      let pascalCaseWithSpaces = '';
      let previousCharWasCapital = false;

      for (let i = 0; i < str.length; i++) {
        const char = str[i];

        if (char === char.toUpperCase()) {
          if (i !== 0 && !previousCharWasCapital) {
            pascalCaseWithSpaces += ' ';
          }
          pascalCaseWithSpaces += char;
          previousCharWasCapital = true;
        } else {
          pascalCaseWithSpaces += char.toLowerCase();
          previousCharWasCapital = false;
        }
      }
      if (pascalCaseWithSpaces && pascalCaseWithSpaces != '') {
        pascalCaseWithSpaces = pascalCaseWithSpaces.charAt(0).toUpperCase() + pascalCaseWithSpaces.slice(1);
        return pascalCaseWithSpaces.trim();
      }
      return '';
    }
  }
  public static validateDurationInfo(durationValue) {
    let isValid = false;
    let durationRegex = new RegExp(this.durationRegex);
    if (durationValue != null && durationValue != undefined) {
      if (durationRegex.test(durationValue)) {
        isValid = true;
      }
    }
    return isValid;
  }
  public static ValidateKeysForDuration(event) {
    let durationValidKeys = '\\d|\\.';
    if (event) {
      let currentDurationValue = event?.target?.value as string;
      let newFormedValue = "";
      let insertedIndex = event?.target?.selectionStart
      if (insertedIndex == currentDurationValue?.length) {
        newFormedValue = currentDurationValue + event.key;
      }
      else {
        newFormedValue = currentDurationValue.substring(0, insertedIndex) +
          event.key + currentDurationValue.substring(insertedIndex)
      }

      if (!new RegExp(durationValidKeys).test(event.key) ||
        (currentDurationValue.includes('.') && !new RegExp(this.durationRegex).test(newFormedValue)) ||
        (!currentDurationValue.includes('.') && event.key != '.'
          && !new RegExp('^\\d{0,2}$').test(currentDurationValue + event.key))) {
        event.preventDefault();
      }
    }
  }

  public static ValidateKeysForAllocation(event) {
    let numberValidKeys = '\\d|\\.';
    if (event) {
      let currentNumberValue = event?.target?.value as string;
      let newFormedValue = "";
      let insertedIndex = event?.target?.selectionStart
      if (insertedIndex == currentNumberValue?.length) {
        newFormedValue = currentNumberValue + event.key;
      }
      else {
        newFormedValue = currentNumberValue.substring(0, insertedIndex) +
          event.key + currentNumberValue.substring(insertedIndex)
      }

      if (!new RegExp(numberValidKeys).test(event.key) ||
        (currentNumberValue.includes('.') && !new RegExp(this.durationRegex).test(newFormedValue)) ||
        (!currentNumberValue.includes('.') && event.key != '.'
          && !new RegExp('^\\d{0,3}$').test(currentNumberValue + event.key))) {
        event.preventDefault();
      }
    }
  }



  // Returns true or false if a provided opportunity passes a given opportunity stage filter
  public static PassesPipelineFilter(filter, data) {
    let status = false;
    if (filter == FilterType.ActiveUpcomingNewOpportunities || filter == FilterType.ActivePipeline) {
      var ourDate = new Date();
      //Change it so that it is 7 days in the past.
      var pastDate = ourDate.getDate() - 7;
      ourDate.setDate(pastDate);
      let startDate = moment(ourDate).format("YYYY-MM-DD");
      let splitFields = data.case?.caseStartDate?.split('T');

      if ((data.registrationStage?.registrationStageId != RegistrationStageEnum.ClosedDropped
        && data.registrationStage?.registrationStageId != RegistrationStageEnum.Terminated
        && data.registrationStage?.registrationStageId != RegistrationStageEnum.ClosedLost
        && data.registrationStage?.registrationStageId != RegistrationStageEnum.ClosedBainTurnedDown
      )
        &&
        ((data.opsLikelihood?.opsLikelihoodId != null && data.opsLikelihood?.opsLikelihoodId > 0 && data.case == null)
          || data.opsLikelihood?.opsLikelihoodId == null
          || data.pipelineId == 0
          || (data.opsLikelihood?.opsLikelihoodId != null
            && (splitFields && splitFields.length > 1 && moment(splitFields[0]).isAfter(startDate))
          ))


      ) {
        // This is an active opportunity
        if (filter == FilterType.ActivePipeline) {
          status = true;
        } else if (filter == FilterType.ActiveUpcomingNewOpportunities) {
          //PBI PEG-9539: Change for including past week and next 2 weeks
          let expStartDateValue = (data.expectedStart && data.expectedStart?.expectedStartDate) ? moment(data.expectedStart?.expectedStartDate.split('T')[0]) : undefined;

          var weekStart = moment().clone().startOf('isoWeek').weekday(0).subtract('1', 'week');
          var weekEnd = moment().clone().endOf('isoWeek').weekday(-1).add('2', 'week');

          if ((expStartDateValue != undefined && (moment.utc(expStartDateValue) >= weekStart.utc()) && (moment.utc(expStartDateValue) <= weekEnd.utc()))) {
            status = true;
          }
        }
      }
    }
    else if (filter == FilterType.ClosedOpportunities) {
      if (data.registrationStage?.registrationStageId == RegistrationStageEnum.ClosedDropped
        || data.registrationStage?.registrationStageId == RegistrationStageEnum.Terminated
        || data.registrationStage?.registrationStageId == RegistrationStageEnum.ClosedLost
        || data.registrationStage?.registrationStageId == RegistrationStageEnum.ClosedBainTurnedDown
      ) {
        status = true;

      }
    }
    else if (filter == FilterType.WonOpportunities) {
      if ((data.registrationStage?.registrationStageId != RegistrationStageEnum.ClosedDropped
        && data.registrationStage?.registrationStageId != RegistrationStageEnum.Terminated
        && data.registrationStage?.registrationStageId != RegistrationStageEnum.ClosedLost
        && data.registrationStage?.registrationStageId != RegistrationStageEnum.ClosedBainTurnedDown)
        && data.case != null
      ) {
        status = true;
      }
    }

    return status;
  }
  public static getAlertIconClass(status) {
    let totalDays: number = 0;
    status.forEach(item => {

      var a = moment(item.startDate);
      var b = moment(item.endDate);
      let diff = b.diff(a, 'days')
      totalDays += diff + 1;
    });

    if (totalDays > 0 && totalDays <= 2) {
      return 'alert-grey';
    } else if (totalDays > 2) {
      return 'alert-red';
    }
    return totalDays;
  }
  public static GenerateEmployeeAlertTooltipArray(empAlertStatus) {

    let messages = [];
    empAlertStatus.forEach(element => {
      let alertType = "Vacation";

      if (element?.commitmentTypeName?.indexOf("LOA") > -1) {
        alertType = "LOA";
      }

      if (element?.commitmentTypeName?.indexOf("Training") > -1) {
        alertType = "Training";
      }

      let message = {
        alertType: alertType,
        startDate: moment.utc(element.startDate).format("DD-MMM-YYYY"),
        endDate: moment.utc(element.endDate).format("DD-MMM-YYYY")
      }

      messages.push(message);
    });

    return messages;
  }
  public static createChangeLogForStaffingOpportunity(oldObject: any, newObject: any) {
      const differingProperties: DifferingProperty[] = [];

      if (_.xorBy(oldObject.ovp, newObject.ovp, "employeeCode").length > 0) {
          differingProperties.push({
              property: "OVP",
              oldValue: oldObject.ovp,
              newValue: newObject.ovp,
              type: "pipeline",
              auditLogSource: "staffing-creation"
          });
      }
      if (_.xorBy(oldObject.svp, newObject.svp, "employeeCode").length > 0) {
          differingProperties.push({
              property: "SVP",
              oldValue: oldObject.svp,
              newValue: newObject.svp,
              type: "pipeline",
              auditLogSource: "staffing-creation"
          });
      }
      if (_.xorBy(oldObject.sellingPartner, newObject.sellingPartner, "employeeCode").length > 0) {
          differingProperties.push({
              property: "Selling Partner",
              oldValue: oldObject.sellingPartner,
              newValue: newObject.sellingPartner,
              type: "pipeline",
              auditLogSource: "staffing-creation"
          });
      }
      if (_.xorBy(oldObject.officeToBeStaffed, newObject.officeToBeStaffed, "officeCode").length > 0) {
          differingProperties.push({
              property: "Office To Be Staffed",
              oldValue: oldObject.officeToBeStaffed,
              newValue: newObject.officeToBeStaffed,
              type: "pipeline",
              auditLogSource: "staffing-creation"
          });
      }

      if (
          moment(oldObject.expectedStart).format("DD-MMM-YYYY") !=
          moment(newObject.expectedStartDate).format("DD-MMM-YYYY")
      ) {
          differingProperties.push({
              property: "Expected Start",
              oldValue: moment(oldObject.expectedStartDate).format("DD-MMM-YYYY"),
              newValue: moment(newObject.expectedStartDate).format("DD-MMM-YYYY"),
              type: "pipeline",
              auditLogSource: "staffing-creation"
          });
      }
      let isdifferent = this.compaireTeamSize(oldObject?.teamSize, newObject?.teamSize);
      if (isdifferent == true) {
          differingProperties.push({
              property: "Team Size",
              oldValue: oldObject.teamSize,
              newValue: newObject.teamSize,
              type: "pipeline",
              auditLogSource: "staffing-creation"
          });
      }

      if (oldObject.duration != newObject.duration) {
          differingProperties.push({
              property: "Duration",
              oldValue: oldObject.duration,
              newValue: newObject.duration,
              type: "pipeline",
              auditLogSource: "staffing-creation"
          });
      }
      if (oldObject.likelihood?.value != newObject.likelihood?.value) {
          differingProperties.push({
              property: "Likelihood",
              oldValue: oldObject.likelihood,
              newValue: newObject.likelihood,
              type: "pipeline",
              auditLogSource: "staffing-creation"
          });
      }

      if (oldObject.projectName != newObject.projectName) {
          differingProperties.push({
              property: "projectName",
              oldValue: oldObject.projectName,
              newValue: newObject.projectName,
              type: "pipeline",
              auditLogSource: "staffing-creation"
          });
      }
      let oldOppTypeLabel = oldObject.opportunityTypeDetails ?  this.generateOpportunityTypeDetailsLabel(oldObject.opportunityTypeDetails) : "";
      let newOppTypeLabel = newObject.opportunityTypeDetails ? this.generateOpportunityTypeDetailsLabel(newObject.opportunityTypeDetails)  : "";
      if (oldOppTypeLabel != newOppTypeLabel ) {
        differingProperties.push({
            property: "opportunityTypeDetails",
            oldValue: oldOppTypeLabel,
            newValue: newOppTypeLabel,
            type: "pipeline",
            auditLogSource: "staffing-creation"
        });
    }
      return differingProperties;
    }

    public static parseDurationDecimal(duration: string, precision: number): number {
      // You should implement a way to parse the duration string into a number
      // depending on the format of the string. For example, you can use parseFloat or custom logic.
      return parseFloat(duration).toFixed(precision) as unknown as number;
  }
  
  public static getEndDate(expectedStartDate: string, duration: string): string {
    const parsedTotalDuration = this.parseDurationDecimal(duration, 2);
    
    let calculateDuration = Math.floor(parsedTotalDuration) * 7;
    const decimalPart = Math.round((parsedTotalDuration - Math.floor(parsedTotalDuration)) * 100) / 100;

    if (decimalPart >= 0.0 && decimalPart <= 0.1) {
        calculateDuration += 0;
    } else if (decimalPart >= 0.2 && decimalPart <= 0.3) {
        calculateDuration += 1;
    } else if (decimalPart >= 0.4 && decimalPart <= 0.5) {
        calculateDuration += 2;
    } else if (decimalPart >= 0.6 && decimalPart <= 0.7) {
        calculateDuration += 3;
    } else if (decimalPart >= 0.8 && decimalPart <= 0.9) {
        calculateDuration += 4;
    }

    // Parse the start date in the local timezone, then convert it to UTC
    let endDateTime = moment(expectedStartDate);   
   
    // Calculate the new date by adding the total duration in days (UTC)
    endDateTime.add(calculateDuration, 'days');

    // If end date is a Saturday, Sunday, or Monday, adjust to the nearest Friday
    const dayOfWeek = endDateTime.day(); // This will give the day of the week (0-6) based on UTC
    if (dayOfWeek === 6) { // Saturday
        endDateTime.subtract(1, 'days');
    } else if (dayOfWeek === 0) { // Sunday
        endDateTime.subtract(2, 'days');
    } else if (dayOfWeek === 1) { // Monday
        endDateTime.subtract(3, 'days');
    } else { // Other days (Tuesday to Friday)
        endDateTime.subtract(1, 'days');
    }

    // Format the result date as 'yyyy-MM-dd' in UTC
    const year = endDateTime.year();
    const month = (endDateTime.month() + 1).toString().padStart(2, '0');
    const day = endDateTime.date().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}  

  }

