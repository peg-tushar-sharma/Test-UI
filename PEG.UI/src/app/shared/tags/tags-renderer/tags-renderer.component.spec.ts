import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TagsRendererComponent } from './tags-renderer.component';
import { CustomTagsComponent } from '../custom-tags/custom-tags.component';

describe('TagsRendererComponent', () => {
  let component: TagsRendererComponent;
  let fixture: ComponentFixture<TagsRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsRendererComponent,CustomTagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
