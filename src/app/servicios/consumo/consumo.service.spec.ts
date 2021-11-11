import { TestBed } from '@angular/core/testing';

import { ConsumoService } from './consumo.service';

describe('ConsumoService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConsumoService = TestBed.get(ConsumoService);
    expect(service).toBeTruthy();
  });
});
