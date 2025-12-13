import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.token;

  // const tempToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI4ZTAzMjI4Yy0yYjY4LTRhYzAtODIyYS02NjEzNDFjMDk4MWQiLCJlbWFpbCI6ImFkbWluQGNhcm5lc3QuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiQWRtaW4iLCJqdGkiOiIzYWFmN2MyNi03YmI5LTRhY2UtYmVhZi03NTExM2NiYzMwYTQiLCJleHAiOjE3NjU4NTA5ODcsImlzcyI6IkNhck5lc3RBUEkiLCJhdWQiOiJDYXJOZXN0Q2xpZW50In0.NzuIW8nm-tYHF3zanf4XNl1OPkhasyRNNXA-W-WMoQU';

  // const token = tempToken;

  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  return next(req);
};

