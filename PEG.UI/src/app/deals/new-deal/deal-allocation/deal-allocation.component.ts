import { Component, OnInit, Input, SimpleChanges, Output, QueryList, ViewChildren, OnChanges, ElementRef, AfterViewInit, AfterViewChecked } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem, copyArrayItem, CdkDragExit, CdkDrag } from '@angular/cdk/drag-drop';
import { deals } from '../../deal';
import { DealsService } from '../../deals.service';
import { expertGroup } from '../deal-experts/expertGroup';
import { PegTostrService } from '../../../core/peg-tostr.service';
import { DatePipe } from '@angular/common';
import { cloneDeep } from 'lodash'
import { CommonMethods } from '../../../shared/common/common-methods';
import { DealClient } from '../deal-clients/dealClient';
import { ExpertCategories } from '../../../shared/enums//expert-category.enum';
import { RegistrationStatus } from '../../../shared/enums/registration-status.enum';
import { CoreService } from '../../../core/core.service';
import { RoleType } from '../../../shared/enums/role-type.enum';
import { RegistrationStageEnum } from '../../../shared/enums/registration-stage.enum';

@Component({
  selector: 'app-deal-allocation',
  templateUrl: './deal-allocation.component.html',
  styleUrls: ['./deal-allocation.component.scss']
})
export class DealAllocationComponent implements OnInit, OnChanges,AfterViewChecked {
  @ViewChildren(CdkDrag) dragItems: QueryList<CdkDrag>;
  @Input()
  deal: deals;
  @Input()
  dealLabel: any;
  filteredDeal: DealClient[];
  @Input()
  isTabReadOnly: boolean;

  IsReadyForAllocation: boolean = false;
  hasExperts: boolean = false;
  dealExpertsGroups: expertGroup[];
  isFilterHidden: boolean = false;
  listClientAccess: string[];
  selectedDealClientId: number;
  isEnabled: boolean = false;
  selectedExpertGroup: any;
  duplicateStatusID: number;
  conflictedStatusID: number;
  terminatedStageID: number;
  closedLostStageID: number;
  closedDroppedStageID: number;
  closedBainTurnedDownStageID: number;
  NACategoryID: number;
  caseCode : string;

  constructor(private elRef:ElementRef,private dealService: DealsService, private coreService: CoreService, private toastr: PegTostrService, public datepipe: DatePipe) {

  }


  ngOnInit() {
    this.isEnabled = true;
    this.duplicateStatusID = RegistrationStatus.Duplicate;
    this.conflictedStatusID = RegistrationStatus.Conflicted;
    this.terminatedStageID = RegistrationStageEnum.Terminated;
    this.closedLostStageID = RegistrationStageEnum.ClosedLost;        
    this.closedDroppedStageID = RegistrationStageEnum.ClosedDropped;        
    this.closedBainTurnedDownStageID = RegistrationStageEnum.ClosedBainTurnedDown;

    this.NACategoryID = ExpertCategories.NotAvailable;
    this.isTabReadOnly = (this.coreService.loggedInUserRoleId === RoleType.PracticeAreaManagerRestricted||this.coreService.loggedInUserRoleId === RoleType.PAM ) ? true : this.isTabReadOnly;

    // removing blank client names
    if (this.deal && this.deal.clients != undefined) {

      let item = this.deal.clients.filter(element => element.client != undefined && element.client.clientName != null && element.client.clientName.trim() != '')
      if (item != undefined && item.length > 0) {
        this.dealService.isReadyForAllocation = true;
        this.IsReadyForAllocation = true
      } else {
        if (this.dealService.isReadyForAllocation) {
          this.IsReadyForAllocation = true;
        } else {
          this.IsReadyForAllocation = false;
          this.dealService.isReadyForAllocation = false;
        }
      }
    }
    else {
      if (this.dealService.isReadyForAllocation) {
        this.IsReadyForAllocation = true;
      } else {
        this.IsReadyForAllocation = false;
        this.dealService.isReadyForAllocation = false;
      }
    }
   // setting blank experts
    if (this.deal && this.deal.expertGroup != undefined) {
      this.deal.expertGroup.forEach(element => {
        element.experts = element.experts.filter(element => element != null && element != undefined );

      });
    }
    if (this.deal) {
      this.renderAllocationTab(this.deal.dealId);
    }

  }

  ngOnChanges() {
    if (this.deal && !this.dealService.isFromRegistration) {
      this.deal.clients?.forEach(element => {
        let currentReadButton: HTMLLinkElement = document.getElementById('currentAllocationNotesReadButton' + element.dealClientId) as HTMLLinkElement;
        if (currentReadButton && currentReadButton.innerText.trim() != 'Read more') {
          currentReadButton.innerText = 'Read more';
        }
      });
      this.renderAllocationTab(this.deal.dealId);
    }

    if (this.isFilterHidden) {
      let item = this.deal.expertGroup.filter(x => x.expertGroupName == this.selectedExpertGroup);
      if (item && item[0]) {
        this.filterExperts(item[0]);
      }
    }
  }

  filterClose() {
    this.deal.expertGroup.forEach(obj => {
      obj.filterState = 0;
      obj.experts.forEach(element => {
        element.filterState = 0;
      })
    })
    this.selectedExpertGroup = null;
  }


  filterExperts(item) {
    if (item != undefined) {
      this.deal.expertGroup.forEach(obj => {
        if (item.expertGroupId != obj.expertGroupId) {
          obj.filterState = 1
          obj.experts.forEach(element => {
            element.filterState = 1;
          })
        } else {
          obj.filterState = 0
          obj.experts.forEach(element => {
            element.filterState = 0;
          })
        }
      })
      this.selectedExpertGroup = item.expertGroupName;
    }
  }

  toggelFilter() {
    if (this.isFilterHidden) {
      this.filterClose();
      this.isFilterHidden = false
    }
    else {
      this.isFilterHidden = true;
    }
  }
  removeItemShowConfirm(item, index) {
    var ele = document.getElementById('removeItem_comittedList_' + index + '_' + item.employeeCode)
    ele.style.display = 'block';
  }
  removeItemCancelConfirm(item, index) {
    var ele = document.getElementById('removeItem_comittedList_' + index + '_' + item.employeeCode)
    if (ele) {
      ele.style.display = 'none';
    }
  }

  removeItem(client, column, currentExpert, index) {
    //hide confirmation popup
    this.removeItemCancelConfirm(currentExpert, index)
    this.deal.clients.forEach((element) => {
      if (client.dealClientId === element.dealClientId) {
        if (column == 'Committed') {
          let index = element.committed.indexOf(currentExpert, 0);
          if (index > -1) {

            this.deal.clientAllocations = this.deal.clientAllocations.filter(c => c.allocationType != 1 && c.dealClientId != element.dealClientId && c.employeeCode != currentExpert.employeeCode)
            let clients = this.deal.clients.filter(c => c.dealClientId == element.dealClientId);
            clients.forEach(element => {
              element.committed = element.committed.filter(c => c.employeeCode != currentExpert.employeeCode);
            })

          }
        } else if (column == 'HeardFrom') {
          let index = element.heardFrom.indexOf(currentExpert, 0);
          if (index > -1) {

            this.deal.clientAllocations = this.deal.clientAllocations.filter(c => c.allocationType != 2 && c.dealClientId != element.dealClientId && c.employeeCode != currentExpert.employeeCode)
            let clients = this.deal.clients.filter(c => c.dealClientId == element.dealClientId);
            clients.forEach(element => {
              element.heardFrom = element.heardFrom.filter(c => c.employeeCode != currentExpert.employeeCode);
            })

          }
        }
        else if (column == 'NextCall') {
          let index = element.nextCall.indexOf(currentExpert, 0);
          if (index != undefined && index > -1) {

            this.deal.clientAllocations = this.deal.clientAllocations.filter(c => c.allocationType != 3 && c.dealClientId != element.dealClientId && c.employeeCode != currentExpert.employeeCode)
            let clients = this.deal.clients.filter(c => c.dealClientId == element.dealClientId);
            clients.forEach(element => {
              element.nextCall = element.nextCall.filter(c => c.employeeCode != currentExpert.employeeCode);
            })

          }
        }
        // resert active state if it was true
        if (column == 'Committed' && currentExpert.isAllocationActive) {
          this.setActiveExpertGrid(currentExpert, false);
          this.setActiveExpert(currentExpert, false);

        }
      }


    });
    this.setValidations();
  }

  drop(event: CdkDragDrop<string[]>,rowIndex:number) {

    if(!event.item.data["expertName"])
     {
        this.toastr.showWarning(
            "The blank expert can not be moved",
            "Alert"
        );
        return false;
     }
   
    if (!(event.previousContainer.id.indexOf('comittedList') > -1) && event.container.id.indexOf('comittedList') > -1) {
      var MovedToComittedRestricted;
      this.deal.clients.forEach(element => {
        let item = element.committed.some(obj => obj.employeeCode === event.item.data['employeeCode'] && obj.isAllocationActive)
        if (item) {
          MovedToComittedRestricted = true;
        }
      });
      if (MovedToComittedRestricted) {
        return false;
      }
    }
   // var itemRow = Number(event.container.id.substr(event.container.id.length - 1));
    if (this.filteredDeal[rowIndex].registrationStatus != null) {
      if ((this.filteredDeal[rowIndex].registrationStatus?.registrationStatusId == RegistrationStatus.Conflicted
        || this.filteredDeal[rowIndex].registrationStatus?.registrationStatusId == RegistrationStatus.Duplicate
      
      
        
        )
        
      ){
        return false;
      }
    }

    if (this.filteredDeal[rowIndex].stage != null) 
    {
        if( this.filteredDeal[rowIndex].stage?.registrationStageId == RegistrationStageEnum.Terminated)
        {
          return false;
        }
    }

    let doExist = event.container.data.some(obj => obj['employeeCode'] === event.item.data['employeeCode'])
    if (doExist) {
      return false;
    }

    if (event.container.id.indexOf('expertGroupList') > -1 && event.previousContainer.id.indexOf('expertGroupList') > -1) {
      // Restrict draging if items are moved in Expert list
      return false
    }
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      if (event.previousContainer.id.indexOf('expertGroupList') < 0) {
        // if items are moved between client then drag the item
        return false;

      } else {
        // if items are moved  from expert to client then copy the item


        //checking data if dragged from
        event.item.data.expertPoolColor = this.setExpertPoolColor(event.item.data.employeeCode);

        let tempExpertData = JSON.parse(JSON.stringify(event.item.data));
        if (event.container.id.indexOf('comittedList') > -1) {
          tempExpertData.isAllocationActive = true;
          this.setActiveExpert(tempExpertData, true);
        }
        event.container.data.push(JSON.parse(JSON.stringify(tempExpertData)));
        if (event.container.id.indexOf('comittedList') > -1) {
          this.setActiveExpertGrid(tempExpertData, true)
        }
      }

      this.deal.clientAllocations = [];
      this.setValidations();

    }
  }

  sortBy(prop,group) {
    
    this.dealService.dealBackup?.expertGroup?.map(x => x.experts.sort((a, b) => { 
      
    
      return a.sortOrder - b.sortOrder
    
    
    }));    
    return prop.sort((a, b) => { 
      
      if(a.sortOrder == b.sortOrder)
      {        

        return a.expertName?.charCodeAt(0)- b.expertName?.charCodeAt(0);
      }

        return a.sortOrder - b.sortOrder });
  }

  sortByPoolColor(prop) {
    return prop.sort((a, b) => { return a.expertPoolColor[0]?.sortOrder - b.expertPoolColor[0]?.sortOrder });
  }
  
  renderAllocationTab(dealId: number) {
    this.dealExpertsGroups = this.deal.expertGroup;
    this.dealExpertsGroups?.forEach(currGroup => {
      currGroup.experts.forEach(currExp => {
        currExp['expertPoolColor'] = this.setExpertPoolColor(currExp.employeeCode)
      })
    })

    this.deal.clients = this.deal.clients?.sort((a, b) => { return a.clientOrder - b.clientOrder });
    let clients = this.deal.clients?.sort((a, b) => {
      return CommonMethods.sortCllients((a.stage) ? a.stage.registrationStageId : 0, a, b);
    })

    this.deal.clients = clients?.sort((a, b) => { return a.clientOrder - b.clientOrder });




    let allocatedExpertList = []
    if (this.deal.clientAllocations != undefined && this.deal.clientAllocations.length > 0) {
      this.deal.clientAllocations.forEach(element => {
        this.deal.expertGroup.forEach(currExpertGroup => {
          currExpertGroup.experts.forEach(currExpert => {
            if (currExpert.employeeCode == element.employeeCode) {
              allocatedExpertList.push(currExpert);
            }
          });
        });
      })
    }
    this.deal.clients?.forEach(element => {
      element.committed = element.committed == undefined ? [] : element.committed;
      element.heardFrom = element.heardFrom == undefined ? [] : element.heardFrom;
      element.nextCall = element.nextCall == undefined ? [] : element.nextCall;
      let showFullText = false;
      let currentReadButton: HTMLLinkElement = document.getElementById('currentAllocationNotesReadButton' + element.dealClientId) as HTMLLinkElement;
      if (currentReadButton && currentReadButton.innerText.trim() != 'Read more') {
        showFullText = true;
      }
      element.allocationNoteFormatted = this.dealService.formateAllocationNote(element.allocationNote, showFullText);
      let allocatedClient = this.deal.clientAllocations.filter(obj => obj.dealClientId === element.dealClientId);
      if (allocatedClient != undefined && allocatedClient.length > 0) {
        allocatedClient.forEach(currExperts => {
          let item = new Object();
          if (currExperts.allocationType == 1) {
            item = allocatedExpertList.find(item => item.employeeCode === currExperts.employeeCode)
            if (!element.committed.some(obj => obj.employeeCode === currExperts.employeeCode) && item != undefined) {
              element.committed.push(JSON.parse(JSON.stringify(item)));
            }
          }
          else if (currExperts.allocationType == 2) {
            item = allocatedExpertList.find(item => item.employeeCode === currExperts.employeeCode)
            if (!element.heardFrom.some(obj => obj.employeeCode === currExperts.employeeCode) && item != undefined) {
              element.heardFrom.push(JSON.parse(JSON.stringify(item)));
            }
          }
          else if (currExperts.allocationType == 3) {
            item = allocatedExpertList.find(item => item.employeeCode === currExperts.employeeCode)
            if (!element.nextCall.some(obj => obj.employeeCode === currExperts.employeeCode) && item != undefined) {
              element.nextCall.push(JSON.parse(JSON.stringify(item)));
            }
          }
        });

      }
      this.setAllocationDescription(element);
    });
    this.listClientAccess = [];

    for (var i = 0; i < this.deal.clients?.length; i++) {
      this.listClientAccess.push('comittedList' + i)
      this.listClientAccess.push('heardFromList' + i)
      this.listClientAccess.push('nextCallList' + i)
    }
    for (var i = 0; i < this.deal.expertGroup?.length; i++) {
      this.listClientAccess.push('expertGroupList' + i)
    }
    this.setExpertPoolColorToClient();
    this.setValidations();

    if (this.deal.clients?.length > 0) {
      this.IsReadyForAllocation = true;
    }
  }


  setAllocationDescription(client: DealClient) {
    let details = [];
    if (client.caseCode) {
    let caseCode  = '<a class="resourceAllocationCaseCode" >'+ client.caseCode + "</a>";
      details.push(caseCode);
    }

    if (client.caseName) {
      details.push(client.caseName);
    }

     if(client.caseOffice && client.caseOffice.officeName){
       details.push(client.caseOffice.officeName);
     }
   
    if(client.caseStartDate && client.caseEndDate){
      details.push(this.datepipe.transform(client.caseStartDate, 'dd-MMM-yyyy')+' - '+this.datepipe.transform(client.caseEndDate, 'dd-MMM-yyyy'));
    }

    if (client.projectLead && client.projectLead.employeeCode) {
      let leadName = client.projectLead.lastName + ', ' + (client.projectLead.familiarName ? client.projectLead.familiarName : client.projectLead.firstName) + ' (' + client.projectLead.officeAbbreviation + ')';
      details.push(leadName);
    }

    if (client.clientHeads && client.clientHeads.length > 0) {
      let clientHeads = '<b>CH: </b>';
      client.clientHeads.forEach(element => {
        clientHeads += element.lastName + ', ' + (element.familiarName ? element.familiarName : element.firstName) + ' (' + element.officeAbbreviation + '); ';
      })
      details.push(clientHeads.substr(0, clientHeads.length - 2));
    }

    if (client.workType && client.workType.workTypeName) {
      details.push(client.workType.workTypeName);
    }

    if (client.stageTypeName) {
      details.push(client.stageTypeName);
    }

    if (client.registrationStatus && client.registrationStatus?.statusTypeName != "" ) {
      details.push(client.registrationStatus.statusTypeName);
    }

    if(client.registrationSubmissionDate){
      details.push('Reg Date: ' + this.datepipe.transform(client.registrationSubmissionDate, 'dd-MMM-yyyy'));
    }

    client.allocationDescription = details.join(' | ');

  }

  setExpertPoolColorToClient() {
    this.deal.clients?.forEach(currClient => {
      currClient.committed.forEach(CurrCommitedExpert => {
        CurrCommitedExpert.expertPoolColor = [];
        CurrCommitedExpert.expertPoolColor = this.setExpertPoolColor(CurrCommitedExpert.employeeCode);
      });
      currClient.heardFrom.forEach(CurrheardFromExpert => {
        CurrheardFromExpert.expertPoolColor = [];
        CurrheardFromExpert.expertPoolColor = this.setExpertPoolColor(CurrheardFromExpert.employeeCode);
      });
      currClient.nextCall.forEach(CurrNextCallExpert => {
        CurrNextCallExpert.expertPoolColor = [];
        CurrNextCallExpert.expertPoolColor = this.setExpertPoolColor(CurrNextCallExpert.employeeCode);
      });
    })
  }
  getAllocatedExpertList() {
    let AllocatedExperts: any[] = [];

    this.deal.expertGroup?.forEach(objExpertGroup => {

      objExpertGroup.experts.forEach(ObjExperts => {

        this.deal.clients.forEach(ObjClient => {

          let CommittedItem = ObjClient.committed.find(objClientsComitted => objClientsComitted.employeeCode == ObjExperts.employeeCode);
          if (CommittedItem != undefined) {
            AllocatedExperts.push({ allocationType: 1, dealClientId: ObjClient.dealClientId, expert: CommittedItem });
          }
          let HeardFromItem = ObjClient.heardFrom.find(objClientsHeardFrom => objClientsHeardFrom.employeeCode == ObjExperts.employeeCode);
          if (HeardFromItem != undefined) {
            AllocatedExperts.push({ allocationType: 2, dealClientId: ObjClient.dealClientId, expert: HeardFromItem });
          }
          let NextCallItem = ObjClient.nextCall.find(objClientNextCall => objClientNextCall.employeeCode == ObjExperts.employeeCode);
          if (NextCallItem != undefined) {
            AllocatedExperts.push({ allocationType: 3, dealClientId: ObjClient.dealClientId, expert: NextCallItem });
          }

        })
      });
    });
    return AllocatedExperts;
  }

  setValidations() {

    let AllocatedExperts = this.getAllocatedExpertList();

    //Setting the validation
    this.deal.expertGroup?.forEach(objExpertGroup => {
      objExpertGroup.experts.forEach(ObjExperts => {
        ObjExperts.expertState = 0;
        ObjExperts.isAllocationActive = false;
        var InCommitted = AllocatedExperts.some(obj => (obj.expert.employeeCode == ObjExperts.employeeCode && obj.allocationType == 1))
        let isActiveExpert = AllocatedExperts.some(obj => (obj.expert.employeeCode == ObjExperts.employeeCode && obj.allocationType == 1 && obj.expert.isAllocationActive))

        if (ObjExperts.categoryId == ExpertCategories.NotAvailable) {
          ObjExperts.expertState = 1;
        }
        if (InCommitted) {
          ObjExperts.expertState = 2;
        }
        if (isActiveExpert) {
          ObjExperts.isAllocationActive = true;
        }
      })
    });

    // reset client experts
    this.deal.clients?.forEach(obj => {

      obj.heardFrom.forEach(heardFromExpert => {
        heardFromExpert.expertState = 0
      });
      obj.nextCall.forEach(nextCallExpert => {
        nextCallExpert.expertState = 0
      });

    })

    // setting client expert
    let CommittedExperts = AllocatedExperts.filter(obj => obj.allocationType == 1);
    if (CommittedExperts != undefined && CommittedExperts.length > 0) {
      CommittedExperts.forEach(item => {
        this.deal.clients.forEach(obj => {
          if (obj.dealClientId != item.dealClientId) {
            obj.heardFrom.forEach(heardFromExpert => {
              if (item.expert.employeeCode == heardFromExpert.employeeCode && item.expert.isAllocationActive) {
                heardFromExpert.expertState = 2;
              }
            });
            obj.nextCall.forEach(nextCallExpert => {
              if (item.expert.employeeCode == nextCallExpert.employeeCode && item.expert.isAllocationActive) {
                nextCallExpert.expertState = 2
              }
            });

          }
        })
      });
    }
  }

  allocationActiveConfirm(item, index) {
    var ele = document.getElementById('aa_comittedList_' + index + '_' + item.employeeCode)
    ele.style.display = 'block';
  }

  cancelAllocationActiveConfirm(item, index) {
    var ele = document.getElementById('aa_comittedList_' + index + '_' + item.employeeCode)
    ele.style.display = 'none';
  }

  selectAllocationNote(dealClientId) {
    var openPopup = document.getElementById('AllocationNotes')
    openPopup.click();
    this.selectedDealClientId = dealClientId;
  }

  selectAllocationInformation(event) {        
    this.caseCode = event.target.innerText;
    this.dealService.updateResource.next(event.target.innerText);
    var openPopup = document.getElementById('resourceAllocation');
    openPopup.click();
  }


  toggleExpertNotes(client, event) {

    var extraExpertiesNotes = document.getElementById('extraExpertiesNotes' + client.dealClientId);
    var currentReadButton: HTMLLinkElement = document.getElementById('currentReadButton' + client.dealClientId) as HTMLLinkElement

    if (extraExpertiesNotes.getAttribute('style').replace(' ', '').trim().indexOf('display:none') > -1) {
      extraExpertiesNotes.setAttribute('style', 'display:inline')
      currentReadButton.innerText = 'Read less'
    }
    else {
      extraExpertiesNotes.setAttribute('style', 'display:none')
      currentReadButton.innerText = 'Read more'

    }
  }
  toggleAllocationNotes(client) {
    var currentReadButton: HTMLLinkElement = document.getElementById('currentAllocationNotesReadButton' + client.dealClientId) as HTMLLinkElement
    if (currentReadButton.innerText.trim() == 'Read more') {
      client.allocationNoteFormatted = this.dealService.formateAllocationNote(client.allocationNote, true);
      currentReadButton.innerText = ' Read less'
    }
    else {
      client.allocationNoteFormatted = this.dealService.formateAllocationNote(client.allocationNote, false);
      currentReadButton.innerText = ' Read more'
    }
  }
  uniqueClients() {

 
    let dealclients = this.deal.clients?.filter(element => element.client != undefined && element.client.clientName != null && element.client.clientName.trim() != '')
    //dealclients = dealclients?.sort((a, b) => { return a.registrationStatus?.sortOrder -b.registrationStatus?.sortOrder });
    dealclients = dealclients?.sort((a, b) => { return a?.registrationStatus?.sortOrder - b.registrationStatus?.sortOrder });
    dealclients = dealclients?.sort((a, b) => { return a.clientOrder - b.clientOrder });

    let clients = dealclients?.sort((a, b) => {
          return CommonMethods.sortCllients((a.stage) ? a?.stage?.registrationStageId : 0, a, b);
    })

   dealclients = clients?.sort((a, b) => { return a.clientOrder - b.clientOrder });
 
    if (dealclients) {

      dealclients = this.sortDuplicateAndConflictedRecords(dealclients, RegistrationStatus.Conflicted);// sort Conflicted
   
      dealclients = this.sortDuplicateAndConflictedRecords(dealclients, RegistrationStatus.Duplicate); //sortDuplicate
    
    }
    this.filteredDeal = dealclients;
    return dealclients;

  }


  sortDuplicateAndConflictedRecords(data: any, order: any) {
    let filterData=[];
    for(let i=0;i<data.length;i++)
    {
      if (data[i].registrationStatus != null && (data[i].registrationStatus.registrationStatusId == order)) {
        if(order==RegistrationStatus.Conflicted)
        { 
          if(data[i].stage?.registrationStageId != RegistrationStageEnum.Terminated)
          {
            var removed= data.splice(data.indexOf(data[i]), 1);
            filterData.push(removed[0]);        
            i--;
          }
          
        }
        if(order==RegistrationStatus.Duplicate)
        {
          var removed= data.splice(data.indexOf(data[i]), 1);
          filterData.push(removed[0]);        
          i--;
        }
       }
    }   
    if(filterData)
    {
      filterData.forEach(item=>{
        data.push(item);
      })
    }    
    return data;
  }
  getPriorityname(priorityname) {
    return priorityname == '' ? '' : '(' + priorityname + ')';
  }
  toggleAllocationActiveState(expert, index) {


    if (!this.checkActiveExpert(expert)) {
      let expectedState = !expert.isAllocationActive;
      expert.isAllocationActive = expectedState

      this.setActiveExpert(expert, expectedState);
      this.setActiveExpertGrid(expert, expectedState);

      this.setValidations();
    } else {
      this.toastr.showWarning("An Active record for " + expert.expertName + " already Exists", "Already Exists")
    }
    this.cancelAllocationActiveConfirm(expert, index);
  }

  setActiveExpertGrid(item, isActive) {
    // set status to active if clicked
    this.deal.clients.forEach(obj => {

      obj.heardFrom.forEach(heardFromExpert => {
        if (item.employeeCode == heardFromExpert.employeeCode) {
          heardFromExpert.isAllocationActive = isActive;
        }
      });
      obj.nextCall.forEach(nextCallExpert => {
        if (item.employeeCode == nextCallExpert.employeeCode) {
          nextCallExpert.isAllocationActive = isActive;
        }
      });
    })
  }

  checkActiveExpert(item): boolean {
    let existRecords = [];
    this.deal.clients.forEach(obj => {
      let t = obj.committed.filter(committedExpert => item.employeeCode == committedExpert.employeeCode && committedExpert.isAllocationActive);
      existRecords = existRecords.concat(t);

    })
    if (item.isAllocationActive) {
      existRecords = existRecords.filter(e => e.employeeCode != item.employeeCode && e.isAllocationActive != true)
    }
    if (existRecords != undefined && existRecords.length > 0) {
      return true
    }
    else {
      return false;
    }
  }
  setActiveExpert(RefExpert, IsActive) {
    if (this.deal && this.deal.expertGroup != undefined) {
      this.deal.expertGroup.forEach(expertGroupElement => {
        expertGroupElement.experts.forEach(expertElement => {
          if (expertElement.employeeCode == RefExpert.employeeCode) {
            expertElement.isAllocationActive = IsActive
          }
        });


      });
    }
  }

  setExpertPoolColor(currExpertCode) {
    let poolDetails = [];
    this.deal.expertGroup.forEach(gp => {
      gp.experts.forEach(expert => {
        if (expert.employeeCode == currExpertCode) {
          poolDetails.push({
            expertPoolColor: gp.expertPoolColor,
            expertGroupId: gp.expertGroupId,
            poolExpertNotes: expert.note,
            poolGroupName: gp.expertGroupName,
            categoryId: expert.categoryId,
            categoryName: expert.categoryName,
            sortOrder: expert.sortOrder
          })
        }
      })
    })
    return poolDetails
  }

  isNoteAvailable(item) {
    let isAvailable = false;
    if (item && item.expertPoolColor) {
      item.expertPoolColor.forEach(element => {
        if (element.poolExpertNotes != null && element.poolExpertNotes != undefined && element.poolExpertNotes != '') {
          isAvailable = true;
          return isAvailable;
        }
      });
    }
    return isAvailable;
  }  

  ngAfterViewChecked(): void {
    this.addCaseCodeEvent();
  }

  addCaseCodeEvent() {
    let element = document.getElementsByClassName('resourceAllocationCaseCode');
    for (let i = 0; i < element.length; i++) {
      const caseSpan = element[i] as HTMLElement;
      if (caseSpan.getAttribute('listener') !== 'true') {
        caseSpan.addEventListener('click', this.selectAllocationInformation.bind(this));
        caseSpan.style.cursor = "pointer";
        caseSpan.setAttribute('listener', 'true');
      }
    }
  }

  hasNACategory(item) {
    if (item.expertPoolColor) {
      return item.expertPoolColor.some(r => r.categoryId == ExpertCategories.NotAvailable)
    }
  }

}
