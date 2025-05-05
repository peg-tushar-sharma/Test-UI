import { TestBed } from '@angular/core/testing';

import { LocationTreeViewService } from './location-tree-view.service';

describe('LocationTreeViewService', () => {
  let service: LocationTreeViewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationTreeViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
