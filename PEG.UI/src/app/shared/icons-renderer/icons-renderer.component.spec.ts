import { HttpClient, HttpHandler } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconsRendererComponent } from './icons-renderer.component';

describe('IconsRendererComponent', () => {
  let component: IconsRendererComponent;
  let fixture: ComponentFixture<IconsRendererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconsRendererComponent ],
      providers: [HttpClient, HttpHandler]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconsRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
