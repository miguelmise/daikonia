import { TestBed } from '@angular/core/testing';

import { BeneficiadosService } from './beneficiados.service';

describe('BeneficiadosService', () => {
  let service: BeneficiadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeneficiadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
