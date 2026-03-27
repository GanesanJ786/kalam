/**
 * Copyright (c) 2024-2026 Kalam. All Rights Reserved.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Copyright (c) 2024-2026 Kalam. All Rights Reserved.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Copyright (c) 2024-2026 Kalam. All Rights Reserved.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { KalamService } from './kalam.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private router: Router,
    private kalamService: KalamService) { }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    if (this.kalamService.isLogoutInProgress()) {
      this.router.navigate(['/login']);
      return false;
    }

    const coachDetails = this.kalamService.getCoachData();
    if (coachDetails) {
      return true;
    }

    const hasFirebaseSession = await this.kalamService.isFirebaseSessionActive();
    if (hasFirebaseSession) {
      const restoredCoachDetails = await this.kalamService.restoreCoachDataFromFirebaseSession();
      if (restoredCoachDetails) {
        return true;
      }
    }

    this.router.navigate(['/login']);
    return false;
  }
}
