import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { StudentDetails } from '../student-form/student-form.component';
import { KalamService } from '../kalam.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SportsList } from '../constant';
import * as _ from 'lodash';
import { ViewStudentDataComponent } from '../view-student-data/view-student-data.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

@Component({
  selector: 'app-all-students-by-ground',
  templateUrl: './all-students-by-ground.component.html',
  styleUrls: ['./all-students-by-ground.component.scss']
})
export class AllStudentsByGroundComponent implements OnInit {

  title: string = "List of Students in ";
  students: StudentDetails[] = [];
  groundName: string | undefined;
  displayedColumns: string[] = ['name','institutionName','mobileNum','payment'];

  dataSource = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

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
      if(element.scholarship == "100") {
        element.payment = "Free"
      }else if((element.feesMonthPaid !== currentMonth || element.feesMonthPaid == undefined) && !element.feesApproveWaiting) {
        element.payment =  "Not Paid";
      }else {
        element.payment =  "Paid"
      } 
    })

    this.dataSource.data = this.students;
    setTimeout(() => {
      console.log(this.sort) //not undefined
      this.dataSource.sort = this.sort; 
    })
  }

  callNum(num: string) {
    return `tel:${num}`
  }

  cancel(){
    this.dialogRef.close();
  }

  getSportLabel(value: string) {
    return SportsList.filter(res => res.value == value)[0].label;
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
