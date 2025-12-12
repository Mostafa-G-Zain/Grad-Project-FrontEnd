import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { roleGuardGuard } from './role-guard';

describe('roleGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => roleGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
