import { User, Pages } from './security/app-user-auth';
import { CoreService } from './core/core.service';
import { CommonMethods } from './shared/common/common-methods';
import { RoleType } from './shared/enums/role-type.enum';

export class AppRoutes {
  public static defaultRoute: string = '/pending-approval';
  public static generalRoute: string = '/partner-dashboard';
  public static newOpportunityForm: string = '/opportunity';

  public static setDefaultRoute(user: User): void {
    // try {
    let deviceInfo = CommonMethods.deviceInfo();
    let pages: Pages[] = user.pages.filter(page => page.level == 1);
    let UserGeneralRole = user.securityRoles.filter(res => res.id == 7);
    let UserMBRole = user.securityRoles.filter(res => (res.id == RoleType.MultibidderManager) || (res.id == RoleType.PEGOperations) || (res.id == RoleType.PEGLeadership) || (res.id == RoleType.RiskManagement));
    if (!deviceInfo.isMobile) {
      if (UserGeneralRole != undefined && UserGeneralRole != null && UserGeneralRole.length > 0) {
        AppRoutes.defaultRoute = this.generalRoute;
      } else {
        let defaultRoute = '/' + pages[0].redirectionUrl;
        AppRoutes.defaultRoute = defaultRoute;
      }
    } else {
      if ((UserGeneralRole != undefined && UserGeneralRole != null && UserGeneralRole.length > 0) ||
        (UserMBRole != undefined && UserMBRole != null && UserMBRole.length > 0)) {
        AppRoutes.defaultRoute = this.newOpportunityForm;
      } else {
        AppRoutes.defaultRoute = this.newOpportunityForm;

      }

    }
  }

}
