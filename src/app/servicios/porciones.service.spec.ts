import { TestBed } from '@angular/core/testing';

import { PorcionesService } from './porciones.service';

describe('PorcionesService', () => {
  let service: PorcionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PorcionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
