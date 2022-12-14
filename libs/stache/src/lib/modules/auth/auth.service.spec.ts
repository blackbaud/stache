import { lastValueFrom } from 'rxjs';

import { StacheAuthService } from './auth.service';

describe('Auth service', () => {
  it('should indicate the user is not authenticated', async () => {
    const authService = new StacheAuthService();
    const isAuthenticated = await lastValueFrom(authService.isAuthenticated);

    expect(isAuthenticated).toBeFalse();
  });
});
