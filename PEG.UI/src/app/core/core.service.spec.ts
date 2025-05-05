import { TestBed, waitForAsync } from '@angular/core/testing';
import { CoreService } from './core.service';
import { HttpClientModule } from '@angular/common/http';

describe('CoreService', () => {
  let coreService: CoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CoreService],
      imports: [HttpClientModule]

    }).compileComponents();
    coreService = TestBed.inject(CoreService);
    let mockCoreService;
    mockCoreService = jasmine.createSpyObj('mockCoreService', ['loadUser']);


    coreService.loadAppSettings().then((appSettings) => {

      mockCoreService.loadUser.and.returnValue({ employeeCode: 'test', role: 'test', firstName: 'test', securityRoles: [{ id: 4 }], pages: [{ name: 'test', level: 0 }, { name: 'test', level: 0 }] });
      coreService.loadUser().then((User) => {

        coreService.loggedInUser = User;



      }).catch(() => {

      });
    }).catch(() => {

    });;
  });

  // it('should create service', () => {
  //   expect(CoreService).toBeTruthy();

  //   //assert
  //   expect(coreService.loadUser).toHaveBeenCalled();
  //   expect(coreService.setRole).toHaveBeenCalled();
  //   expect(coreService.setUserPages).toHaveBeenCalled();
  //   expect(coreService.loggedInUser.employeeCode).not.toBeNull();
  //   expect(coreService.loggedInUser.role).not.toBeNull();
  //   expect(coreService.loggedInUser.firstName).not.toBeNull();
  // });

  // it('Should load AppSettingsData', waitForAsync(() => {

  //   const spySubsciber = spyOn(coreService, 'loadAppSettings').and.callThrough();

  //   let promise = coreService.loadAppSettings().then((appSettings) => {


  //     //assert
  //     expect(spySubsciber).toHaveBeenCalled();
  //     expect(appSettings.AzureInstrumentationKey).not.toBeNull();
  //     expect(appSettings.PEGApiBasePath).not.toBeNull();
  //     expect(appSettings.majorVersion).not.toBeNull();

  //   }).catch(() => {

  //   });


  // }));

  // it('Should load UserData', () => {

  //   spyOn(coreService, 'loadUser').and.callThrough();
  //   spyOn(coreService, 'setRole').and.callThrough();
  //   spyOn(coreService, 'setUserPages').and.callThrough();




  // });

});