export interface AppSettings {
    PEGApiBasePath: string;
    PEGAuthApiBasePath: string;
    PEGGatewayApiBasePath: string
    IdExcelDownload: number;
    AzureInstrumentationKey: string;
    cacheAgeInMilliseconds: string;
    clearLocalStorage: boolean;
    majorVersion: string;
    InactiveSessionTimeInmiliSec: number;
    environment: string;
    isPartnerAllowed: boolean; // needs to be removed once form is release for all partners
    allowedOffices: string;
    restrictedOffices: string;
    PEGSignalRBasePath: string;
    staffingBasePath: string;
    cortexTargetOrigin: string;
    expertPartnerAccessOfficeCodes: string;
    PEGMobileAuthApiBasePath: string;
    HangfireDashboadUrl: string;
    PipelineFridayDefaultColumnValue: [];
    AzureAppInsightsConnectionString: string;
    replaceUserEmployeeCode:ReplaceEmployeeCode[];
    settings: {
        clientId: string,
        tenantId: string,
        authority: string,
        redirectUri: string,
        postLogoutRedirectUri: string,
        graphAPIResourceUri: string
        graphAPIResourceScopes: [],
        testUserEmail: string,
        testUserEmployeeId: string

    }

}

export interface ReplaceEmployeeCode {
    ADEmployeeCode: string;
    workdayEmployeeCode: string;
}
