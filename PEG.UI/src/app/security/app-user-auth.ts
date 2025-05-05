// import { AppUserClaim } from "./app-user-claim";

// export class AppUserAuth {
//   userName: string = "";
//   bearerToken: string = "";
//   isAuthenticated: boolean = false;
//   claims: AppUserClaim[] = [];
// }


// export module AppUserAuth {

  export interface SecurityRoles {
      id: number;
      name: string;
  }

  export interface Pages {
      id: number;
      name: string;
      level: number;
      redirectionUrl: string;
      isModal: boolean;
      modalTarget:string;
      isHideInNavigation:boolean;
      claims:string;
  }

  export class User {
      id: string;
      isTargetMasked: boolean;
      employeeCode: string;
      firstName: string;
      lastName: string;
      familiarName?: any;
      internetAddress?: any;
      profileImageUrl: string;
      securityRoles: SecurityRoles[];
      pages: Pages[];
      token: string;
      displayName?: any;
      role?: any;
      employeeOffice:number;
      officeAbbreviation: string;
      employeeRegion: string;
      employeeRegionId: number;
  }

// }

