import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetCellRendererComponent } from './target-cell-renderer.component';

describe('TargetCellRendererComponent', () => {
  let component: TargetCellRendererComponent;
  let fixture: ComponentFixture<TargetCellRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetCellRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TargetCellRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
