import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConflictGalleryComponent } from './conflict-gallery.component';

describe('ConflictGalleryComponent', () => {
  let component: ConflictGalleryComponent;
  let fixture: ComponentFixture<ConflictGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConflictGalleryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConflictGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
