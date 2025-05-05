import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NgSelectModule } from '@ng-select/ng-select';
import { GlobalService } from '../../../global/global.service';

import { ClientCommitmentComponent } from './client-commitment.component';

describe('ClientCommitmentComponent', () => {
  let component: ClientCommitmentComponent;
  let fixture: ComponentFixture<ClientCommitmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientCommitmentComponent ],
      imports: [HttpClientTestingModule, NgSelectModule],
      providers: [GlobalService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientCommitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
