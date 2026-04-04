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
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs/operators';
import { KalamService } from '../kalam.service';
import { SubscriptionService } from '../subscription.service';
import { UpgradePromptDialogComponent } from '../upgrade-prompt-dialog/upgrade-prompt-dialog.component';
import { getSportIcon, getSportLabel } from '../constant';

@Component({
    selector: 'app-new-coach-approve',
    templateUrl: './new-coach-approve.component.html',
    styleUrls: ['./new-coach-approve.component.scss'],
    standalone: false
})
export class NewCoachApproveComponent implements OnInit {

  coaches: any = [];
  title: string = "Coach Approval Queue";
  getSportIcon = getSportIcon;
  getSportLabel = getSportLabel;

  constructor(private router: Router, private kalamService: KalamService,
    private subscriptionService: SubscriptionService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar) {
    
   }

  ngOnInit(): void {
    this.getCoachData();
  }

  approve(coach: any) {
    const academyId = this.kalamService.getAcademyId();
    this.subscriptionService.checkLimit(academyId, 'coach').pipe(take(1)).subscribe(result => {
      if (!result.allowed) {
        this.dialog.open(UpgradePromptDialogComponent, {
          data: { resourceType: 'coach', current: result.current, limit: result.limit, planName: result.planName }
        }).afterClosed().subscribe(upgrade => {
          if (upgrade) this.router.navigate(['/subscription']);
        });
        return;
      }
      coach.approved = true;
      this.kalamService.approvedCoach(coach);
      setTimeout(() => {
        this.getCoachData();
      }, 500);
    });
  }

  reject(coach: any) {
    this.kalamService.deleteCoach(coach);
    setTimeout(() => {
      this.getCoachData();
    }, 500);
  }

  gotoHome() {
    this.router.navigate([`/home`]);
  }

  getCoachData() {
    this.coaches = this.kalamService.getNewCoachesList();
  }

}
