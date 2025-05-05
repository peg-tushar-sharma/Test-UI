import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { AppSession } from '../shared/class/appSession';
import { DealList, deals, taggedPeople } from './deal';

import { DealsService } from './deals.service';
import { expertGroup } from './new-deal/deal-experts/expertGroup';

describe('DealsService', () => {
    let service: DealsService;
    let injector: TestBed;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [DealsService]
        })

        injector = getTestBed();
        service = injector.inject(DealsService);
        httpMock = injector.inject(HttpTestingController);
    });

    it('should be created', () => {
        const service: DealsService = TestBed.inject(DealsService);
        expect(service).toBeTruthy();
    });

    it('should delete app session', () => {
        var appSession: AppSession = new AppSession();
        appSession.appSessionId = 0;
        appSession.pageId = 18;
        appSession.pageReferenceId = 1;

        let employee = { employeeCode: '20002' };
        appSession.employee = employee;
        service.deleteAppSession(appSession).subscribe((res) => {
            expect(res).toEqual(true);
        })
    });

    it('should get deal tagged people by id', () => {
        let dummyTaggedPeople = {
            data: [
                {
                    dealPeopleTagId: 0, dealId: 0, EmployeeCode: '2002', FirstName: 'test', LastName: 'test',
                    FamiliarName: '', EmployeeStatusCode: 'A', office_name: 'test', OfficeAbbreviation: 'test', positionTitle: 'test', pegRole: '6', pegRoleName: 'TSG Support'
                }
            ]
        }
        service.getDealTaggedPeopleById(undefined).subscribe((res) => {
            expect(res).toEqual(dummyTaggedPeople);
        })
    });

    it('should get deals', () => {
        let dummyDeals: DealList[] = [
            {
                dealId: 1, targetName: 'test', notes: 'test', submittedBy: '2002', lastUpdated: new Date(),
                lastUpdatedBy: '20002', industryDN: '2499', industries: 'Technology & Cloud Services',
                regions: ['EMEA'], region: 'EMEA', dealStatusId:0,dealStatusName: 'Active', clients: 'Test', dealStatus: {
                    dealStatusId: 1, dealStatusName: 'Potential MB'
                }, submissionDate: new Date(), noOfClients: '1', dealRegion: 'EMEA',sessionId:1,lockedBy:'Test'
            }
        ]
        service.getDeals('2,1').subscribe((res) => {
            expect(res).toEqual(dummyDeals);
        })
    });

    it('should convert to deal', () => {
        let dummyDeal = new deals();
        service.convertToDeal(dummyDeal).subscribe((res) => {
            expect(res).toHaveBeenCalled();
        })
    });

    it('should save tagged people', () => {
        let dummytaggedPeople = new taggedPeople();
        service.saveTaggedPeople(dummytaggedPeople).subscribe((res) => {
            expect(res).toHaveBeenCalled();
        })
    });

    it('should get expert group', () => {
        service.getExpertGroup(1).subscribe((res) => {
            expect(res).toHaveBeenCalled();
        })
    });

    it('should save expert group', () => {
        let dummyExperGroup = new expertGroup();
        service.saveExpertGroup(dummyExperGroup).subscribe((res) => {
            expect(res).toHaveBeenCalled();
        })
    });

    it('should get clients by id', () => {
        service.getClientHeadsByClientName(1).subscribe((res) => {
            expect(res).toHaveBeenCalled();
        })
    });

    it('should get deal by id', () => {
        service.getDealById(1, 0).subscribe((res) => {
            expect(res).toHaveBeenCalled();
        })
    });

    it('should get deal by name', () => {
        let dummyDeals: DealList[] = [
            {
                dealId: 1, targetName: 'test', notes: 'test', submittedBy: '2002', lastUpdated: new Date(),
                lastUpdatedBy: '20002', industryDN: '2499', industries: 'Technology & Cloud Services',
                regions: ['EMEA'], region: 'EMEA', dealStatusId:0,dealStatusName: 'Active', clients: 'Test', dealStatus: {
                    dealStatusId: 1, dealStatusName: 'Potential MB'
                }, submissionDate: new Date(), noOfClients: '1', dealRegion: 'EMEA',sessionId:1,lockedBy:'Test'
            }
        ]
        
        service.getDealsByName('test').subscribe((res) => {
            expect(res).toEqual(dummyDeals);
        })
    });

    it('should add new registration to tracker', () => {
        service.addRegistrationsToTracker(1, 1).subscribe((res) => {
            expect(res).toHaveBeenCalled();
        })
    });

    it('should create new tracker from copy', () => {
        let dummyDeal = new deals();
        service.createNewTrackerFromCopy(dummyDeal).subscribe((res) => {
            expect(res).toHaveBeenCalled();
        })
    });

    it('should get Deal tracker report', () => {
        service.getMBTrackerReport('test',1).subscribe((res) => {
            expect(res).toHaveBeenCalled();
        })
    });

   

});
