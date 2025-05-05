import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentionPartnersComponent } from './mention-partners.component';

describe('MentionPartnersComponent', () => {
  let component: MentionPartnersComponent;
  let fixture: ComponentFixture<MentionPartnersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentionPartnersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentionPartnersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
