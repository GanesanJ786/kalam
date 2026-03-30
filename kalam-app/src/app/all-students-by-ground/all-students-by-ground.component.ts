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
import { StudentDetails } from '../student-form/student-form.component';
import { KalamService } from '../kalam.service';
import { MAT_DIALOG_DATA as MAT_DIALOG_DATA, MatDialog, MatDialogRef as MatDialogRef } from '@angular/material/dialog';
import { SportsList, getSportIcon } from '../constant';
import * as _ from 'lodash';
import { ViewStudentDataComponent } from '../view-student-data/view-student-data.component';
import * as moment from 'moment';

@Component({
    selector: 'app-all-students-by-ground',
    templateUrl: './all-students-by-ground.component.html',
    styleUrls: ['./all-students-by-ground.component.scss'],
    standalone: false
})
export class AllStudentsByGroundComponent implements OnInit {

  title: string = "List of Students in ";
  students: StudentDetails[] = [];
  groundName: string | undefined;
  paidCount: number = 0;
  unpaidCount: number = 0;
  getSportIcon = getSportIcon;

  constructor(
    private kalamService: KalamService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AllStudentsByGroundComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StudentDetails[],
  ) {
    this.students = [] as StudentDetails[];
  }

  ngOnInit(): void {
    let currentMonth = moment().startOf("month").format('MMMM');
    this.students = _.sortBy(this.data, ["age", "gender"]);
    this.groundName = this.students[0].groundName;
    this.students.forEach((element: StudentDetails) => {

      // let dob = moment(element.dob);
      // let today = moment();

      // let val = today.year() - dob.year();

      // if(val < 6) {
      //   element.underAge = 'u-5';
      // }else if(val <=21) {
      //   element.underAge = `u-${val}`;
      // }else {
      //   element.underAge = 'open'
      // }

      // this.kalamService.editStudentDetails(element)

      if(element.scholarship == "100") {
        element.payment = "Free"
      }else if((element.feesMonthPaid !== currentMonth || element.feesMonthPaid == undefined) && !element.feesApproveWaiting) {
        element.payment =  "Not Paid";
      }else {
        element.payment =  "Paid"
      } 
    });

    this.paidCount = this.students.filter(s => s.payment === 'Paid' || s.payment === 'Free').length;
    this.unpaidCount = this.students.filter(s => s.payment === 'Not Paid').length;
  }

  callNum(num: string) {
    return `tel:${num}`
  }

  cancel(){
    this.dialogRef.close();
  }

  getSportLabel(value: string) {
    const match = SportsList.filter(res => res.value == value)[0];
    return match ? match.label : value || '';
  }

  genderMapper(gender: string) {
    if(gender == 'male') {
      return "(M)";
    }else {
      return "(F)";
    }
  }

  viewStudent(student: StudentDetails) {
    const dialogRef = this.dialog.open(ViewStudentDataComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      disableClose: true,
      data: student,
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      //console.log(result);
      
    });
  }

}
