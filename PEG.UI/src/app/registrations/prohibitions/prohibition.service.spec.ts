import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { mockDashBoardRegistrations } from '../../Mock/MockDashBoardService';
import { Prohibition } from './prohibition';

import { ProhibitionService } from './prohibition.service';

describe('ProhibitionService', () => {
  let service: ProhibitionService;  
  let injector: TestBed;
  let httpMock: HttpTestingController;
  let mockProhibition:Prohibition={
    iac: true
    , id: 36
    , ln: "manav testsing "
    , lsd: new Date("2019-07-02T10:16:58.643")
    , rt: 4
    , sb: "47081"
    , sbn: "Agarwal, Manav (47081)"
    , tdn: "manav testsing "
    , ti: 4108
    , ub: null
    , ubn: null
    , nid: "P12"
};
  beforeEach(() => {
      TestBed.configureTestingModule({
          imports: [ HttpClientTestingModule ],
          providers: [ ProhibitionService ]
      })

      injector = getTestBed();
      service = injector.inject(ProhibitionService);
      httpMock = injector.inject(HttpTestingController);
  });

  it('should be created', () => {
    const service: ProhibitionService = TestBed.inject(ProhibitionService);
    expect(service).toBeTruthy();
  });

  

  it('should insert  insertProhibition', () => {
     
    service.insertProhibition(mockProhibition).subscribe((res)=>{
        expect(res).toEqual(mockProhibition);
    })
  });

  it('should update  updateProhibition', () => {
     
    service.updateProhibition(mockProhibition).subscribe((res)=>{
        expect(res).toEqual(mockProhibition);
    })
  });


});
