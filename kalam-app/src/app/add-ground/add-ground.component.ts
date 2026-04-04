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
import { Component, OnInit, Inject } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA as MAT_DIALOG_DATA, MatDialogRef as MatDialogRef} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { KalamService } from '../kalam.service';
import { SubscriptionService } from '../subscription.service';
import { UpgradePromptDialogComponent } from '../upgrade-prompt-dialog/upgrade-prompt-dialog.component';

export interface DialogData {
  dialogType?: string;
  groundName?: string;
  groundAddress?: string;
  academyId?: string;
  coachView?: any;
  topics?: string;
  notes?: string;
  amount?: string;
  loginAddress?: string;
  logoutAddress?: string;
  loginCoords?: { lat: number; lng: number };
  logoutCoords?: { lat: number; lng: number };
}

@Component({
    selector: 'app-add-ground',
    templateUrl: './add-ground.component.html',
    styleUrls: ['./add-ground.component.scss'],
    standalone: false
})
export class AddGroundComponent implements OnInit {

  addGround!: UntypedFormGroup;
  groundInfo: DialogData;
  topicsForm!: UntypedFormGroup;
  notesForm!: UntypedFormGroup;
  feesForm!: UntypedFormGroup;
  leaveForm!: UntypedFormGroup;

  constructor(
    private kalamService: KalamService,
    public dialogRef: MatDialogRef<AddGroundComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private subscriptionService: SubscriptionService,
    private dialog: MatDialog,
    private router: Router,
  ) {
    this.groundInfo = {} as DialogData;
  }

  ngOnInit(): void {
    this.addGround = new UntypedFormGroup({
      groundName: new UntypedFormControl(this.groundInfo.groundName, [
        Validators.required
      ]),
      groundAddress: new UntypedFormControl(this.groundInfo.groundAddress, [
        Validators.required
      ]),
    });

    this.topicsForm =  new UntypedFormGroup({
      topics: new UntypedFormControl(this.groundInfo.topics, [
        Validators.required
      ]),
    });

    this.notesForm =  new UntypedFormGroup({
      notes: new UntypedFormControl(this.groundInfo.notes, []),
    });

    this.feesForm =  new UntypedFormGroup({
      amount: new UntypedFormControl(this.groundInfo.amount, [
        Validators.required
      ]),
    });

    this.leaveForm = new UntypedFormGroup({
      dateOfLeave: new UntypedFormControl(this.groundInfo.amount, [
        Validators.required
      ]),
      reasonOfLeave: new UntypedFormControl(this.groundInfo.amount, [
        Validators.required
      ]),
    });
  }

  openInGoogleMaps(type: string): void {
    const coords = type === 'login' ? this.data.loginCoords : this.data.logoutCoords;
    if (coords) {
      window.open(`https://www.google.com/maps?q=${coords.lat},${coords.lng}`, '_blank');
    }
  }

  cancel(){
    this.dialogRef.close();
  }

  applyLeave() {
    if (this.leaveForm.invalid) {
      for (const control of Object.keys(this.leaveForm.controls)) {
        this.leaveForm.controls[control].markAsTouched();
      }
      return;
    }
    this.dialogRef.close({data:this.leaveForm.value});
  }

  save(){
    if (this.addGround.invalid) {
      for (const control of Object.keys(this.addGround.controls)) {
        this.addGround.controls[control].markAsTouched();
      }
      return;
    }
    const coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
    const academyId = this.kalamService.getAcademyId();
    this.subscriptionService.checkLimit(academyId, 'ground').pipe(take(1)).subscribe(result => {
      if (!result.allowed) {
        this.dialogRef.close();
        this.dialog.open(UpgradePromptDialogComponent, {
          data: { resourceType: 'ground', current: result.current, limit: result.limit, planName: result.planName }
        }).afterClosed().subscribe(upgrade => {
          if (upgrade) this.router.navigate(['/subscription']);
        });
        return;
      }
      let groudData = this.addGround.value;
      groudData['academyId'] = coachId;
      this.kalamService.addGroundDetails(groudData);
      this.dialogRef.close();
    });
  }

  saveTopics() {
    if (this.topicsForm.invalid) {
      for (const control of Object.keys(this.topicsForm.controls)) {
        this.topicsForm.controls[control].markAsTouched();
      }
      return;
    }
    this.dialogRef.close({data:this.topicsForm.value});
  }

  saveNotes() {
    if (this.notesForm.invalid) {
      for (const control of Object.keys(this.notesForm.controls)) {
        this.notesForm.controls[control].markAsTouched();
      }
      return;
    }
    this.dialogRef.close({data:this.notesForm.value});
  }

  payment() {
    if (this.feesForm.invalid) {
      for (const control of Object.keys(this.feesForm.controls)) {
        this.feesForm.controls[control].markAsTouched();
      }
      return;
    }
    this.dialogRef.close({data:this.feesForm.value});
  }

  cancelNotes(){
    this.dialogRef.close({data:{notes: null}});
  }

  cancelPayment(){
    this.dialogRef.close({data:{amount: null}});
  }

}
