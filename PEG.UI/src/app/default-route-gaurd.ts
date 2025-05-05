import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AppRoutes } from './app-routes';

@Injectable({
  providedIn: 'root'
})
export class DefaultRouteGaurd implements CanActivate {

  /**
   *
   */
  constructor(private router: Router) {

  }

    canActivate(): boolean {
        // this.router.navigate([AppRoutes.defaultRoute]);
        return false;
    }
}