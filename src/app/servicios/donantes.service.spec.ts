import { TestBed } from '@angular/core/testing';

import { DonantesService } from './donantes.service';

describe('DonantesService', () => {
  let service: DonantesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DonantesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
