import { TestBed } from '@angular/core/testing';

import { ConceptoCobroService } from './concepto-cobro.service';

describe('ConceptoCobroService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConceptoCobroService = TestBed.get(ConceptoCobroService);
    expect(service).toBeTruthy();
  });
});
