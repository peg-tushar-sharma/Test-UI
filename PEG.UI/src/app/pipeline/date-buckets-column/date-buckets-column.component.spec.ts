import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GlobalService } from '../../global/global.service';
import { PegTostrService } from '../../core/peg-tostr.service';
import { DealsService } from '../../deals/deals.service';
import { PipelineService } from '../pipeline.service';
import { BsModalService } from 'ngx-bootstrap/modal';
import { DateBucketsColumnComponent } from './date-buckets-column.component';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('DateBucketsColumnComponent', () => {
    let component: DateBucketsColumnComponent;
    let fixture: ComponentFixture<DateBucketsColumnComponent>;
    let mockPegTostrService;
    let mockGlobalService;
    let mockBsModalService;

    beforeEach(async () => {
        mockPegTostrService = jasmine.createSpyObj('mockPegTostrService', ['showSuccess', 'showError', 'showWarning']);
        mockGlobalService = jasmine.createSpyObj('mockGlobalService', ['mapBucketGroup', 'getOpportunityStage', 'getOffice']);
        mockBsModalService = jasmine.createSpyObj('mockBsModalService', ['']);

        await TestBed.configureTestingModule({
            declarations: [DateBucketsColumnComponent],
            imports: [HttpClientTestingModule],
            providers: [DealsService, PipelineService, PegTostrService]
        })
            .compileComponents();
        TestBed.overrideProvider(PegTostrService, { useValue: mockPegTostrService });
        TestBed.overrideProvider(BsModalService, { useValue: mockBsModalService });
        TestBed.overrideProvider(GlobalService, { useValue: mockGlobalService });
    });

    beforeEach(() => {
        let office = [{
            officeAbbr: "ABC",
            officeCluster: "Cluster Test",
            officeCode: "123",
            officeName: "Test",
        }]
        mockGlobalService.mapBucketGroup.and.returnValue(of(['']));
        mockGlobalService.getOpportunityStage.and.returnValue(of(['']));
        mockGlobalService.getOffice.and.returnValue(of(office));
        fixture = TestBed.createComponent(DateBucketsColumnComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

