
import { TestBed } from '@angular/core/testing';
import { CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { authGuard } from './auth-guard';
import { Auth } from '../services/auth';
import { Router } from '@angular/router';

describe('authGuard', () => {
  let authMock: jasmine.SpyObj<Auth>;
  let routerMock: jasmine.SpyObj<Router>;

  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  beforeEach(() => {
    authMock = jasmine.createSpyObj<Auth>('Auth', ['getToken', 'getRole']);
    routerMock = jasmine.createSpyObj<Router>('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: Auth, useValue: authMock },
        { provide: Router, useValue: routerMock },
      ],
    });
  });

  function getRoute(): ActivatedRouteSnapshot {
    return new ActivatedRouteSnapshot();
  }
  function getState(): RouterStateSnapshot {
    return { url: '', root: getRoute() } as RouterStateSnapshot;
  }

  it('should allow access if token exists and role is Admin', () => {
    authMock.getToken.and.returnValue('token');
    authMock.getRole.and.returnValue('Admin');
    expect(executeGuard(getRoute(), getState())).toBeTrue();
    expect(routerMock.navigate).not.toHaveBeenCalled();
  });

  it('should redirect to /login if no token', () => {
    authMock.getToken.and.returnValue(null);
    expect(executeGuard(getRoute(), getState())).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should redirect to /home if role is not Admin', () => {
    authMock.getToken.and.returnValue('token');
    authMock.getRole.and.returnValue('User');
    expect(executeGuard(getRoute(), getState())).toBeFalse();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/home']);
  });
});
