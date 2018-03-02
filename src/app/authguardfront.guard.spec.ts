import { TestBed, async, inject } from '@angular/core/testing';

import { AuthguardfrontGuard } from './authguardfront.guard';

describe('AuthguardfrontGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthguardfrontGuard]
    });
  });

  it('should ...', inject([AuthguardfrontGuard], (guard: AuthguardfrontGuard) => {
    expect(guard).toBeTruthy();
  }));
});
