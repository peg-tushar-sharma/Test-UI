import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalComponent } from './modal.component';
import { By } from '@angular/platform-browser';

describe('ModalComponent', () => {
  let component: ModalComponent;
  let fixture: ComponentFixture<ModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should contain modal-header', () => {

    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.modal-header')).length).toEqual(1);

  });

  it('should contain modal-body', () => {

    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.modal-body')).length).toEqual(1);

  });


  it('should contain modal-footer', () => {

    fixture.detectChanges();
    expect(fixture.debugElement.queryAll(By.css('.modal-footer')).length).toEqual(1);

  });


});
