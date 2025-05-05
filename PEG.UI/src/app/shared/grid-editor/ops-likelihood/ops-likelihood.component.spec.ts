import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { GlobalService } from '../../../global/global.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { OpsLikelihoodComponent } from './ops-likelihood.component';


describe('OpsLikelihoodComponent', () => {
  let fixture: ComponentFixture<OpsLikelihoodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OpsLikelihoodComponent ],
      imports: [HttpClientTestingModule, NgSelectModule],
      providers: [GlobalService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OpsLikelihoodComponent);
    fixture.detectChanges();
  });
  
});
