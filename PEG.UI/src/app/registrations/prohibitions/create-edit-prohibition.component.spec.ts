import { CreateEditProhibitionComponent } from "./create-edit-prohibition.component";
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { ProhibitionService } from './prohibition.service';
import { PegTostrService } from '../../core/peg-tostr.service';
import { CUSTOM_ELEMENTS_SCHEMA, SimpleChange } from '@angular/core';
import { CoreModule } from '../../core/core.module';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpErrorHandler } from '../../error/http-error-handler.service';
import { ErrorService } from '../../error/error.service';
import { CoreService } from '../../core/core.service';
import { Prohibition } from './prohibition';
import { of, throwError } from 'rxjs';

describe('Prohibition edit and create', () => {

    let component: CreateEditProhibitionComponent;
    let fixture: ComponentFixture<CreateEditProhibitionComponent>;

    // services
    let coreService;
    let prohibitionService: ProhibitionService;
    let toastrService: PegTostrService;

    // Mock variables
    let fakeProhibition: Prohibition;
   
    beforeEach(() => {
        coreService=jasmine.createSpyObj('coreService',['editProhibition']);
        TestBed.configureTestingModule({
            declarations: [CreateEditProhibitionComponent],
            providers: [ProhibitionService, PegTostrService, HttpErrorHandler, ErrorService],
            imports: [
                CoreModule,
                SharedModule,
                HttpClientModule,
                HttpClientTestingModule
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(CreateEditProhibitionComponent);
        component = fixture.componentInstance;

        // Services Injection
        coreService.editProhibition.and.returnValue(of(fakeProhibition)); 
        coreService = fixture.debugElement.injector.get(CoreService);
        prohibitionService = fixture.debugElement.injector.get(ProhibitionService);
        toastrService = fixture.debugElement.injector.get(PegTostrService);

        setMockData();
    })

    it('should create component', () => {
        // Arrange

        // Act

        // Assert
        expect(component).toBeTruthy();
    })

    // it('should inject coreService and fetch logged in user details', () => {
    //     // Arrange

    //     // Act
    //     fixture.detectChanges();

    //     // Assert
    //     expect(component.submittedByName).toBeTruthy();
    // })

    it('should not set null value in prohibition', () => {
        // Arrange

        // Act
        fixture.detectChanges();
        component.ngOnChanges({ prohibition: new SimpleChange(null, null, false) });

        // Assert
        expect(component.prohibition).toBeTruthy();
        expect(component.prohibition).not.toBeNull();
        expect(Object.entries(component.prohibition).length).toBeGreaterThan(0);
    })

    it('should call insert new prohibition', () => {
        // Arrange
        spyOn(component, 'insertProhibition');

        // Act
        component.save();

        // Assert
        expect(component.insertProhibition).toHaveBeenCalled();
        expect(component.prohibition.sb).toBeTruthy();
    })

    it('should call update prohibition', () => {
        // Arrange
        component.prohibition = fakeProhibition;
        spyOn(component, 'updateProhibition');

        // Act
        component.save();

        // Assert
        expect(component.updateProhibition).toHaveBeenCalled();
        expect(component.prohibition.ub).toBeTruthy();
    })

    it('should save new prohibition successfully', () => {
        // Arrange
        let insertProhibitionSpy = spyOn(prohibitionService, 'insertProhibition').and.returnValue(of(fakeProhibition));
        spyOn(component, 'clearForm');

        // Act
        component.insertProhibition();

        // Assert
        expect(prohibitionService.insertProhibition).toHaveBeenCalled();

        fixture.whenStable().then(() => {
            expect(component.prohibition).toEqual(fakeProhibition);
        }).catch(()=>{

        });

        expect(component.clearForm).toHaveBeenCalled();
    })

    it('should save new prohibition with error', () => {
        // Arrange
        let insertProhibitionSpy = spyOn(prohibitionService, 'insertProhibition').and.returnValue(throwError('Some error message'));
        spyOn(toastrService, 'showError');
        spyOn(component, 'clearForm');
        
        // Act
        component.insertProhibition();

        // Assert
        expect(prohibitionService.insertProhibition).toHaveBeenCalled();
        expect(toastrService.showError).toHaveBeenCalled();
        expect(component.clearForm).toHaveBeenCalled();
    })

    it('should update prohibition successfully', () => {
        // Arrange
        spyOn(prohibitionService, 'updateProhibition').and.returnValue(of(fakeProhibition));
         spyOn(component, 'clearForm');

        // Act
        component.updateProhibition();

        // Assert
        expect(prohibitionService.updateProhibition).toHaveBeenCalled();

        fixture.whenStable().then(() => {
            expect(component.prohibition).toEqual(fakeProhibition);
        }).catch(()=>{

        });

        expect(component.clearForm).toHaveBeenCalled();
    })

    it('should update prohibition with error', () => {
        // Arrange
        let insertProhibitionSpy = spyOn(prohibitionService, 'updateProhibition').and.returnValue(throwError('Some error message'));
        spyOn(toastrService, 'showError');
        spyOn(component, 'clearForm');

        // Act
        component.updateProhibition();

        // Assert
        expect(prohibitionService.updateProhibition).toHaveBeenCalled();
        expect(toastrService.showError).toHaveBeenCalled();
        expect(component.clearForm).toHaveBeenCalled();
    })

    let setMockData = () => {
        // set Mock User
        coreService.loggedInUser = {
            displayName: null
            , employeeCode: "47081"
            , employeeOffice: 111
            , familiarName: null
            , firstName: "Manav"
            , id: '13'
            , internetAddress: null
            , lastName: "Agarwal"
            , pages: [{ id: 2, name: "Conflicts", level: 1, redirectionUrl: "conflicts",isModal:false,modalTarget:'test'  }]
            , profileImageUrl: "http://gxcdocs.local.bain.com/gxc3/files/Employee_Images/47081"
            , role: null
            , securityRoles: [{ id: 5, name: "PEG Administrator" }]
            , token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6Ik1hbmF2Iiwicm9sZSI6IlBFRyBBZG1pbmlzdHJhdG9yIiwibmJmIjoxNTYyMDYwMTYxLCJleHAiOjE1NjI2NjQ5NjEsImlhdCI6MTU2MjA2MDE2MX0.vf8kP3iyhaZfDtaV3q24qAC09IjakX-T6TkUGC2yi8s"
            , officeAbbreviation: "NDL"
            , employeeRegion: "Asia/Pacific"
            , employeeRegionId: 1

        };

        // set Mock return data
        fakeProhibition = {
            iac: true
            , id: 36
            , ln: "manav testsing "
            , lsd: new Date("2019-07-02T10:16:58.643")
            , rt: 4
            , sb: "47081"
            , sbn: "Agarwal, Manav (47081)"
            , tdn: "manav testsing "
            , ti: 4108
            , ub: null
            , ubn: null
            , nid: "P12"
        }
    }
    it('should clear form', () => {
         component.inProgress=true;
         component.clearForm();
         expect(component.inProgress).toBeFalsy();
    })
    it('should cancel', () => {
        component.inProgress=true;
        component.cancel();
        expect(component.inProgress).toBeFalsy();
   })

   it('should call before close', () => {
    component.inProgress=true;
    component.beforeClose({});
    expect(component.inProgress).toBeFalsy();
    })
})