import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AppFooterComponent } from './app-footer.component';
import { CoreService } from '../core/core.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';

describe('AppFooterComponent', () => {
  let component: AppFooterComponent;
  let fixture: ComponentFixture<AppFooterComponent>;
  let mockCoreService;


  beforeEach(waitForAsync(() => {
    mockCoreService = jasmine.createSpyObj("mockCoreService", ['']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule,
        HttpClientModule,
        HttpClientTestingModule],
      declarations: [AppFooterComponent],
      providers: [CoreService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]

    })
    TestBed.overrideProvider(CoreService,{useValue: mockCoreService});
    TestBed.compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
