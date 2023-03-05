import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { KalamService } from './kalam.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router,
    private kalamService: KalamService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    //let url: string = state.url;
    //console.log('Url:'+ url);
    const coachInfo = this.kalamService.getCoachData();
    if (Object.keys(coachInfo).length > 0) {
        // logged in so return true
        return true;
    }

    // not logged in so redirect to login page with the return url
    // return true;

    this.router.navigate(['/login']);
    return false;
  }
}
