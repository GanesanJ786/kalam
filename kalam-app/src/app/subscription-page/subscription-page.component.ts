import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { KalamService } from '../kalam.service';
import { SubscriptionService, AcademySubscription } from '../subscription.service';
import { SUBSCRIPTION_PLANS, SubscriptionPlan, PlanId } from '../constant';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-subscription-page',
  standalone: false,
  templateUrl: './subscription-page.component.html',
  styleUrls: ['./subscription-page.component.scss']
})
export class SubscriptionPageComponent implements OnInit {

  plans = SUBSCRIPTION_PLANS.filter(p => p.id !== 'FREE_TRIAL');
  currentSubscription: AcademySubscription | null = null;
  currentPlanId: PlanId = 'FREE_TRIAL';
  billingCycle: 'MONTHLY' | 'ANNUAL' = 'MONTHLY';
  academyId: string = '';
  usage = { coachCount: 0, studentCount: 0, groundCount: 0 };
  loading = true;

  constructor(
    private kalamService: KalamService,
    private subscriptionService: SubscriptionService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.academyId = this.kalamService.getAcademyId();

    this.subscriptionService.getSubscription(this.academyId).pipe(take(1)).subscribe(sub => {
      this.currentSubscription = sub;
      this.currentPlanId = sub?.planId || 'FREE_TRIAL';
      this.billingCycle = sub?.billingCycle || 'MONTHLY';
    });

    this.subscriptionService.getUsage(this.academyId).pipe(take(1)).subscribe(usage => {
      this.usage = usage;
      this.loading = false;
    });
  }

  getPrice(plan: SubscriptionPlan): number {
    return this.billingCycle === 'ANNUAL' ? Math.round(plan.annualPrice / 12) : plan.monthlyPrice;
  }

  getTotalPrice(plan: SubscriptionPlan): number {
    return this.billingCycle === 'ANNUAL' ? plan.annualPrice : plan.monthlyPrice;
  }

  getSavings(plan: SubscriptionPlan): number {
    return (plan.monthlyPrice * 12) - plan.annualPrice;
  }

  isCurrentPlan(plan: SubscriptionPlan): boolean {
    return plan.id === this.currentPlanId;
  }

  isDowngrade(plan: SubscriptionPlan): boolean {
    const planOrder: PlanId[] = ['FREE_TRIAL', 'STARTER', 'BASIC', 'STANDARD', 'PRO', 'ENTERPRISE'];
    return planOrder.indexOf(plan.id) < planOrder.indexOf(this.currentPlanId);
  }

  canSelect(plan: SubscriptionPlan): boolean {
    return !this.isCurrentPlan(plan) && !this.isDowngrade(plan);
  }

  selectPlan(plan: SubscriptionPlan) {
    if (!this.canSelect(plan)) return;

    this.subscriptionService.updatePlan(this.academyId, plan.id, this.billingCycle)
      .pipe(take(1)).subscribe(() => {
        this.currentPlanId = plan.id;
        this._snackBar.open(`Upgraded to ${plan.name} plan!`, '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 3000,
        });
      });
  }

  getStatusLabel(): string {
    if (!this.currentSubscription) return 'No Plan';
    switch (this.currentSubscription.status) {
      case 'TRIAL': return 'Free Trial';
      case 'ACTIVE': return 'Active';
      case 'PAST_DUE': return 'Past Due';
      case 'CANCELLED': return 'Cancelled';
      case 'EXPIRED': return 'Expired';
      default: return this.currentSubscription.status;
    }
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}
