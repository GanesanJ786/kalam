import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SUBSCRIPTION_PLANS } from '../constant';

@Component({
  selector: 'app-upgrade-prompt-dialog',
  standalone: false,
  templateUrl: './upgrade-prompt-dialog.component.html',
  styleUrls: ['./upgrade-prompt-dialog.component.scss']
})
export class UpgradePromptDialogComponent {

  resourceType: string = '';
  currentCount: number = 0;
  limit: number = 0;
  planName: string = '';
  nextPlan: any = null;

  constructor(
    public dialogRef: MatDialogRef<UpgradePromptDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.resourceType = data.resourceType || 'resource';
    this.currentCount = data.current || 0;
    this.limit = data.limit || 0;
    this.planName = data.planName || 'Free Trial';
    this.nextPlan = this.getNextPlan();
  }

  getNextPlan(): any {
    const planOrder = ['FREE_TRIAL', 'STARTER', 'BASIC', 'STANDARD', 'PRO', 'ENTERPRISE'];
    const currentPlan = SUBSCRIPTION_PLANS.find(p => p.name === this.planName);
    if (!currentPlan) return SUBSCRIPTION_PLANS[1];
    const currentIndex = planOrder.indexOf(currentPlan.id);
    if (currentIndex < planOrder.length - 1) {
      return SUBSCRIPTION_PLANS.find(p => p.id === planOrder[currentIndex + 1]);
    }
    return null;
  }

  getResourceLabel(): string {
    switch (this.resourceType) {
      case 'coach': return 'coaches';
      case 'student': return 'students';
      case 'ground': return 'grounds/facilities';
      default: return this.resourceType + 's';
    }
  }

  close() {
    this.dialogRef.close(false);
  }

  upgrade() {
    this.dialogRef.close(true);
  }
}
