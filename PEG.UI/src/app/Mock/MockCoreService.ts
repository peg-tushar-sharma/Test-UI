import { AppSettings } from '../shared/interfaces/appSettings.interface';
import { User } from '../security/app-user-auth';

export class MockCoreService {

    appSettings: AppSettings = {
        PEGApiBasePath: "https://localhost:44303/",
        PEGGatewayApiBasePath:"https://localhost:44376/",
        IdExcelDownload: 12,
        AzureInstrumentationKey: "TEST",
        cacheAgeInMilliseconds: "86400000",
        clearLocalStorage: true,
        majorVersion: "0",
        environment: "",
        InactiveSessionTimeInmiliSec: 0,
        PEGAuthApiBasePath: "",
        isPartnerAllowed:true,
        allowedOffices: '',
        restrictedOffices:'',
        PEGSignalRBasePath: '',
        staffingBasePath: ''
       
    };

    loggedInUser: User = {
        id: "Test",
        employeeCode: "Test",
        firstName: "Test",
        lastName: "Test",
        familiarName: "Test",
        internetAddress: "Test",
        profileImageUrl: "Test",
        securityRoles: [{ id: 1, name: "test" }, { id: 2, name: "test" }, { id: 3, name: "test" }],
        pages: [{ id: 1, name: "test", level: 1, redirectionUrl: "test", isModal: true, modalTarget: "", claims: "", isHideInNavigation: false }, { id: 2, name: "test", level: 2, redirectionUrl: "currentregistration", isModal: true, modalTarget: "", claims: "", isHideInNavigation: false }],
        token: "Test",
        displayName: "Test",
        role: "Test",
        employeeOffice: 110,
        officeAbbreviation: "",
        employeeRegion: "",
        employeeRegionId:0
    }

    public loadAppSettings() {
        return this.appSettings;
    }
    public loadUser() {
        return this.loggedInUser;
    }
}
