import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaskRendererComponent } from './mask-renderer.component';

describe('MaskRendererComponent', () => {
  let component: MaskRendererComponent;
  let fixture: ComponentFixture<MaskRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaskRendererComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaskRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
