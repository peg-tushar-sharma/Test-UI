// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import { ReportsComponent } from './reports.component';
// import { MockReportService } from '../../Mock/MockReportService';
// import { RouterTestingModule } from '@angular/router/testing';
// import {CurrentRegistrationReportComponent} from '../current-registration-report/current-registration-report.component';
// import {Router, Routes} from '@angular/router';
// import {ReportService} from './report.service';
// import {CoreService} from '../../core/core.service';
// import {MockCoreService} from '../../Mock/MockCoreService';

// const routes: Routes = [
//   {
//     path: '',
//   component: ReportsComponent,
//   children: [
//     {

//         path: 'currentregistration',
//         component: CurrentRegistrationReportComponent

//     },
//     {
//       path: '',
//       redirectTo: 'reports',
//       pathMatch: 'full'
//   }]
//   }]

// describe('ReportsComponent', () => {
//   let component: ReportsComponent;
//   let fixture: ComponentFixture<ReportsComponent>;

//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       declarations: [ ReportsComponent,CurrentRegistrationReportComponent ],
//       imports : [ RouterTestingModule.withRoutes(routes)],
//       providers: [
//         { provide: CoreService, useClass: MockCoreService }
//       ]
//     })
//     .overrideComponent(ReportsComponent, {
//       set: {
          
//           providers: [
//               { provide: ReportService, useClass: MockReportService }
                                                   
//           ]
//       }
//   })
//     .compileComponents();
//   }));

//   beforeEach(() => {
//     fixture = TestBed.createComponent(ReportsComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
// });
