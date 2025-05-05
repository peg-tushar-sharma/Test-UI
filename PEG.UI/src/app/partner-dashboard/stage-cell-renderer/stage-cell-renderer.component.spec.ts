import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StageCellRendererComponent } from './stage-cell-renderer.component';

describe('StageCellRendererComponent', () => {
  let component: StageCellRendererComponent;
  let fixture: ComponentFixture<StageCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StageCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StageCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
