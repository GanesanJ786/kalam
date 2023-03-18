import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { KalamService } from '../kalam.service';

export interface DialogData {
  groundName: string;
  groundAddress: string;
  academyId?: string;
}

@Component({
  selector: 'app-add-ground',
  templateUrl: './add-ground.component.html',
  styleUrls: ['./add-ground.component.scss']
})
export class AddGroundComponent implements OnInit {

  addGround!: FormGroup;
  groundInfo: DialogData;

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

}
