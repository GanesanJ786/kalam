import { Component, OnInit, Inject } from '@angular/core';
import { StudentDetails } from '../student-form/student-form.component';
import { KalamService } from '../kalam.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SportsList } from '../constant';
import * as _ from 'lodash';

@Component({
  selector: 'app-all-students-by-ground',
  templateUrl: './all-students-by-ground.component.html',
  styleUrls: ['./all-students-by-ground.component.scss']
})
export class AllStudentsByGroundComponent implements OnInit {

  title: string = "List of Students in ";
  students: StudentDetails[] = [];
  groundName: string | undefined;

  constructor(
    private kalamService: KalamService,
    public dialogRef: MatDialogRef<AllStudentsByGroundComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StudentDetails[],
  ) {
    this.students = [] as StudentDetails[];
  }

  ngOnInit(): void {
    this.students = _.sortBy(this.data, ["age", "gender"]);
    this.groundName = this.students[0].groundName;
  }

  cancel(){
    this.dialogRef.close();
  }

  getSportLabel(value: string) {
    return SportsList.filter(res => res.value == value)[0].label;
  }

}
