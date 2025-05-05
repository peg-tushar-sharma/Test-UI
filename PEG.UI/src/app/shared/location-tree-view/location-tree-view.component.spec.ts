import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GlobalService } from '../../global/global.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LocationTreeViewComponent } from './location-tree-view.component';

describe('LocationTreeViewComponent', () => {
  let component: LocationTreeViewComponent;
  let fixture: ComponentFixture<LocationTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      declarations: [ LocationTreeViewComponent ],
      providers:[GlobalService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
