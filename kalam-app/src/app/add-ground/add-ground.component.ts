import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { KalamService } from '../kalam.service';

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
}

@Component({
  selector: 'app-add-ground',
  templateUrl: './add-ground.component.html',
  styleUrls: ['./add-ground.component.scss']
})
export class AddGroundComponent implements OnInit {

  addGround!: FormGroup;
  groundInfo: DialogData;
  topicsForm!: FormGroup;
  notesForm!: FormGroup;
  feesForm!: FormGroup;

  constructor(
    private kalamService: KalamService,
    public dialogRef: MatDialogRef<AddGroundComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {
    this.groundInfo = {} as DialogData;
  }

  ngOnInit(): void {
    this.addGround = new FormGroup({
      groundName: new FormControl(this.groundInfo.groundName, [
        Validators.required
      ]),
      groundAddress: new FormControl(this.groundInfo.groundAddress, [
        Validators.required
      ]),
    });

    this.topicsForm =  new FormGroup({
      topics: new FormControl(this.groundInfo.topics, [
        Validators.required
      ]),
    });

    this.notesForm =  new FormGroup({
      notes: new FormControl(this.groundInfo.notes, []),
    });

    this.feesForm =  new FormGroup({
      amount: new FormControl(this.groundInfo.amount, [
        Validators.required
      ]),
    });
  }

  cancel(){
    this.dialogRef.close();
  }

  save(){
    if (this.addGround.invalid) {
      for (const control of Object.keys(this.addGround.controls)) {
        this.addGround.controls[control].markAsTouched();
      }
      return;
    }
    const coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
    let groudData = this.addGround.value;
    groudData['academyId'] = coachId;
    this.kalamService.addGroundDetails(groudData);
    this.dialogRef.close();
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
