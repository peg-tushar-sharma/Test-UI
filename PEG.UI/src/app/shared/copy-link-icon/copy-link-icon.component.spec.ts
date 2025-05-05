import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CopyLinkIconComponent } from './copy-link-icon.component';

describe('CopyLinkIconComponent', () => {
  let component: CopyLinkIconComponent;
  let fixture: ComponentFixture<CopyLinkIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyLinkIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyLinkIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
