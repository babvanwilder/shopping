import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { IsConnectedGuard } from './is-connected.guard';

@Injectable({
  providedIn: 'root'
})
export class IsNotConnectedGuard implements CanActivate {
  constructor(
    private isConnectedGuard: IsConnectedGuard
  ) { }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    return !this.isConnectedGuard.canActivate(next, state);
  }

}
