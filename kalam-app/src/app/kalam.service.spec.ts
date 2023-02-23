import { TestBed } from '@angular/core/testing';

import { KalamService } from './kalam.service';

describe('KalamService', () => {
  let service: KalamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KalamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
