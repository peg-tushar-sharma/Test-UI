
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeEditorComponent } from './employee-editor.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { DealsService } from '../../../deals/deals.service';
import { HttpClientModule } from '@angular/common/http';
import { Employee } from '../../interfaces/models';

describe('EmployeeEditorComponent', () => {
  let component: EmployeeEditorComponent;
  let fixture: ComponentFixture<EmployeeEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeeEditorComponent],
      imports: [NgSelectModule, FormsModule, HttpClientModule],
      providers: [DealsService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeEditorComponent);
    component = fixture.componentInstance;

    let testEmployee: Employee[] = [{
      employeeCode: "test",
      lastName: "Abdelkader",
      firstName: "Amr",
      familiarName: null,
      officeName: "Boston",
      employeeStatusCode: "A",
      searchableName: "Abdelkader, Amr (test)",
      officeAbbreviation: 'BOS',
      abbreviation:'',
      homeOfficeCode:0,
      isRingfenceEmployee: false,
      statusCode:'',
      officeClusterCode:0
    },
    {
      employeeCode: "test2",
      lastName: "Doe",
      firstName: "John",
      familiarName: null,
      officeName: "Boston",
      employeeStatusCode: "A",
      searchableName: "Doe, John (test2)",
      officeAbbreviation: 'BOS',
      abbreviation:'',
      isRingfenceEmployee: false,
      statusCode:'',
      homeOfficeCode:0,
      officeClusterCode:0
    }];

    component.typeaheadEmployeeList = testEmployee;
    component.params = testEmployee;
    component.selectedExpert = testEmployee[0].searchableName;
    component.isMultiple = false;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have employee list', () => {
    expect(component.typeaheadEmployeeList.length).toBeGreaterThan(1);
  });

  it('should have single office of employee', () => {
    expect(component.params[0].officeName).toBe('Boston');
  });

  it('should select multiple employee', () => {
    component.isMultiple = true;
    let data = [];
    let obj = { 'searchableName':'Doe, John (test2)' }
    data.push(obj);
    data[0].searchableName = '';
    component.params.data = {};
    component.onSelectionChange(data);
    fixture.detectChanges();
    expect(component.params.expertName).toEqual(undefined);
  });

  it('should initialize typeahead', () => {
    let mockdata = {
      params:{
        data:{
          isMultipleEmployee: true,
          empoloyeeCode:'test',
          expertName:'Abdelkader, Amr (test)'
        },
        colDef:{
          field:'clientHeads'
        }
      }
    }
    component.agInit(mockdata.params);
    fixture.detectChanges();
    expect(component.selectedExpert).toBe('Abdelkader, Amr (test)')
  });

  it('should have popup set to true', () => {
    expect(component.isPopup()).toBeTruthy();
  });

  it('should have return value for grid', () => {
    expect(component.getValue()).toBe('Abdelkader, Amr (test)');
  });
  
});
