import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../settings.service';
import { CoreService } from '../../core/core.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  public HangfireDashboadUrl: SafeResourceUrl
  isDataMasked: boolean = false;
  checkMaskAllUsers: false;
  constructor(private settings: SettingsService, private _core: CoreService, private sanitizer: DomSanitizer) {
    const token = sessionStorage.getItem('bearerToken'); // or get it from auth service
    const url = this._core.appSettings.HangfireDashboadUrl + `?access_token=${token}`;
    this.HangfireDashboadUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
    this.isDataMasked = this._core.loggedInUser.isTargetMasked;
  }

  navConfig = [{
    name: 'Hangfire Jobs',
    icon: 'pi pi-fw pi-calendar',
    url: 'hangfireJobs',
    isActive: true
  }, {
    name: 'System Configuration',
    icon: 'pi pi-fw pi-cog',
    url: 'configuration',
    isActive: false
  }]

  getActiveNav(item: string) {
    return this.navConfig.find((x: any) => x.url == item).isActive;
  }
  toggleNav(nav: any) {
    this.navConfig.map((n: any) => { n.url == nav.url ? n.isActive = true : n.isActive = false })
  }
  ngOnInit() {
  }
  onIndustryClick() {
    // this.settings.syncIndustries().subscribe(r=>{
    //   alert('success');
    // })
  }
  onTabChange(event: any) {
    console.log(event);
  }
  toggleTargetMask() {

    this.settings.updateUserTargetMasked(this.checkMaskAllUsers ? '' : this._core.loggedInUser.employeeCode, !this.isDataMasked).subscribe((res: any) => {
      this.isDataMasked = !res;
      this._core.loggedInUser.isTargetMasked = this.isDataMasked;
      location.href = location.href.split('?')[0] + '?reload=' + new Date().getTime();
    })
  }
  
}
