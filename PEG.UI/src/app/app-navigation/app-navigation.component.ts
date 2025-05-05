import { Component, Input, OnInit } from '@angular/core';
import { CoreService } from '../core/core.service';
import { AppRoutes } from '../app-routes';
import { Router } from '@angular/router';
import { Observable, filter, fromEvent } from 'rxjs';
import { SwUpdate, VersionReadyEvent } from '@angular/service-worker';
import { environment } from '../../environments/environment.prod';
import { CommonMethods } from '../shared/common/common-methods';
import { AppInsightWrapper } from '../applicationInsight/appInsightWrapper';
import { PagesTypes } from '../shared/enums/page-type.enum';
import { Pages } from '../security/app-user-auth';
import { RegistrationService } from '../registrations/registrations/registration.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './app-navigation.component.html',
  styleUrls: ['./app-navigation.component.scss']
})
export class AppNavigationComponent implements OnInit {
  deviceInfo: any;
isTargetMasked:boolean;
  isStaffingUser:boolean=false;

  onlineEvent: Observable<Event>;
  offlineEvent: Observable<Event>;
  isOffline: boolean = false;
  networkStatus: string = '';
  statusInfo: string = '';
  statusIcon: string = '';
  statusInfoTitle: string = '';
  statusClass: string = '';
  mobileStatusClass: string = '';


  UserImagePath = '';
  isImpersonated = false;
  environment: string = '';
  currentUser:string='';
  tabPages: Pages[];
  hasImpersonation = false;
  UserRole = '';
  createAccess: any
  
  constructor(private _registrationService: RegistrationService, private appInsightWrapper: AppInsightWrapper,private coreService: CoreService, public router: Router, private swUpdate: SwUpdate) {
    const packageJson = require('../../../package.json');
    // this.majorVersion = packageJson.version;
    environment.version=packageJson.version;

   }
   trackAppInsights() {
    try {
      let empCode = this.coreService.loggedInUser.employeeCode;
      this.appInsightWrapper.logPageView(`home page load for emp : ${empCode}`);
      setTimeout(() => {
        this.appInsightWrapper.logEvent(`initial first page load for emp : ${empCode}`); 
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  }
  ngOnInit(): void {
    this.UserImagePath = "./../assets/img/defaultUser.png"

    this.trackAppInsights();
    this.deviceInfo = CommonMethods.deviceInfo();
    this.isImpersonated = this.coreService.isImpersonated;
    this.environment = this.coreService.appSettings.environment;
    // checking if role is staffing
    if (location.pathname.includes('staffing')) {    
      this.isStaffingUser = true;
    } else {
      this.isStaffingUser = false;

    }
    let currentUserData =JSON.parse(JSON.stringify(this.coreService.loggedInUser));
    this.isTargetMasked = currentUserData.isTargetMasked;
    this.tabPages = currentUserData.pages.filter(page => page.level == 1 && page.redirectionUrl);
    this.currentUser = currentUserData.lastName + ', '
      + ((currentUserData.familiarName != null) ? currentUserData.familiarName : currentUserData.firstName) +' ('+currentUserData?.officeAbbreviation+')';

    let imageUrl = currentUserData.profileImageUrl;
    this.checkIfJPGImageExists(imageUrl, '.jpg');
    let roles = '';
    this.hasImpersonation = this.pageExists('Impersonation',currentUserData);
    currentUserData.securityRoles.forEach((value) => {
      if (roles === '') {
        roles = value.name;
      } else {
        roles += ', ' + value.name;
      }
    });
    this.UserRole = roles;
    this.createAccess = currentUserData.pages.filter(x => x.level === 2 && (x.id === PagesTypes.SearchNewRegistration ||
      x.id === PagesTypes.RegistrationNewRegistration || x.id === PagesTypes.NewMBTracker || x.id === PagesTypes.DealTracker2));

    // Setting new Opportunity in create button
    let oppPage = currentUserData.pages.find(x => x.id === PagesTypes.NewOpportunity);
    if (oppPage != undefined && oppPage != null) {
      this.createAccess.push(oppPage);
    }
    
    this.onlineEvent = fromEvent(window, 'online');
    this.offlineEvent = fromEvent(window, 'offline');

    this.offlineEvent.subscribe(e => {
      this.isOffline = true;
      this.networkStatus = 'offline';
      this.mobileStatusClass = 'offline-bar';
      this.statusInfoTitle = 'No internet connection!'
      this.statusInfo = 'You are out of network. Please reconnect and refresh the page.';
      this.statusClass = 'alert-offline';
      this.statusIcon = 'fa-times-circle fa  fa-2x mr-3'
    })

    this.onlineEvent.subscribe(e => {
      this.statusClass = 'alert-offline';
      this.networkStatus = 'online';
      this.statusInfoTitle = 'Internet Connection Found!'
      this.mobileStatusClass = 'online-bar';
      this.statusIcon = 'fa-check-circle fa  fa-2x mr-3'
      this.statusInfo = 'We are back online. You will lose all the unsaved changes. Please refresh the page to continue.';
      this.checkForNewVersion();
    })
  }
  checkForNewVersion() {
    if (this.swUpdate.isEnabled) {
      this.swUpdate.versionUpdates
        .pipe(filter((evt): evt is VersionReadyEvent => evt.type === 'VERSION_READY'))
        .subscribe(() => {
          this.coreService.newUpdates.next(true);
        });
      this.swUpdate.checkForUpdate();
    }
  }
  
  checkIfJPGImageExists(url, ext) {
    const img = new Image();
    img.src = url + ext;
    if (img.complete) {
      this.UserImagePath = url + ext
    } else {
      img.onload = () => {
        this.UserImagePath = url + ext
      };
      img.onerror = () => {
        this.checkIfJPEGImageExists(url, ".jpeg");
        return;

      };
    }
  }
  disableMenuItem() {
    this.createAccess.forEach(element => {
      if (window.location.pathname.includes(element.redirectionUrl.replace('0', ''))) {
        element.isDisabled = true
      }
      else {
        element.isDisabled = false
      }

    });


  }
  checkIfJPEGImageExists(url, ext) {
    const img = new Image();
    img.src = url + ext;
    if (img.complete) {
      this.UserImagePath = url + ext
    } else {
      img.onload = () => {
        this.UserImagePath = url + ext
      };

      img.onerror = () => {
        this.UserImagePath = "./../assets/img/defaultUser.png"
        return;

      };
    }
  }
  addProhibition(event) {
    if (event == '#prohibition-form') {
      document.getElementById('closeProhibition').click();
    }
  }
  toggleSidebar() {
    var sidebar = document.getElementById("helpSidebar");
    sidebar.classList.toggle("is-shift-sidebar");

    var masterComponent = document.getElementById("masterContainer");
    masterComponent.classList.toggle("is-shift-content");
   }


  pageExists(pageName,currentUserData) {
    return currentUserData.pages.some((page) => {
      return page.name === pageName;
    });
  }
  getSubmittedByName() {
    let user = this.coreService.loggedInUser;
    if (user && Object.entries(user).length > 0) {
      return user.lastName + ', ' + (user.familiarName != null ? user.familiarName : user.firstName) + ' (' + user.officeAbbreviation + ')';
      //this.submittedByEcode = user.employeeCode;
    }
  }
  refresh(): void {
    window.location.replace(window.location.origin);
    // window.location.reload();       
  }

  getImpersonateUserInfo(employeeCode: string) {
    this.coreService.impersonateUser(employeeCode).then(user => {
      setTimeout(() => {
        AppRoutes.setDefaultRoute(user);
        if (user) {
          this.ngOnInit();
          // this.router.navigate([routeString]);
        } else {
          alert('Invalid user for PEG');
        }
      }, 1000);
    });
  }
}
