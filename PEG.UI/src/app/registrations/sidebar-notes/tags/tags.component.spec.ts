import { async, ComponentFixture, TestBed } from '@angular/core/testing'; 

import { TagsComponent } from './tags.component';

describe('TagsComponent', () => {
  let component: TagsComponent;
  let fixture: ComponentFixture<TagsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TagsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TagsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should click once', () => {
  
    fixture.nativeElement.querySelector('#tab-content-tags > div > div:nth-child(1) > div').click();
    fixture.detectChanges();    
    expect(fixture.nativeElement.querySelector('#tab-content-tags > div > div:nth-child(1) > div').classList).toContain('on');
  });
});
