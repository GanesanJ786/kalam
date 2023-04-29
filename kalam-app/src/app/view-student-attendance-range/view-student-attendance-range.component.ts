import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { KalamService } from '../kalam.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllStudentsByGroundComponent } from '../all-students-by-ground/all-students-by-ground.component';
import { StudentDetails } from '../student-form/student-form.component';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-view-student-attendance-range',
  templateUrl: './view-student-attendance-range.component.html',
  styleUrls: ['./view-student-attendance-range.component.scss']
})
export class ViewStudentAttendanceRangeComponent implements OnInit {

  title: string = "Attendance of "
  student: StudentDetails;
  startOfMonth: any;
  endOfMonth: any;
  attendanceRangeGroup = new FormGroup({
    start: new FormControl(new Date(year, month, 1)),
    end: new FormControl(new Date(year, month, 7)),
  });
  displayedColumns: string[] = ['name','ground','date','status'];

  dataSource = new MatTableDataSource();
  
  constructor(
    private kalamService: KalamService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AllStudentsByGroundComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StudentDetails,
  ) { 
    this.student = {} as StudentDetails;
  }

  ngOnInit(): void {
    this.student = this.data;
    this.startOfMonth = new Date(moment().startOf('month').format('YYYY-MM-DD hh:mm'));
    this.endOfMonth   = new Date(moment().endOf('month').format('YYYY-MM-DD hh:mm'));
  }

  cancel(){
    this.dialogRef.close();
  }

  search() {
    //console.log(this.attendanceRangeGroup);
    const obj = {
      start: moment(this.attendanceRangeGroup.value.start).format('MM-DD-YYYY'),
      end: moment(this.attendanceRangeGroup.value.end).format('MM-DD-YYYY')
    }
    this.kalamService.getSingleStudentAttendanceData(this.student, obj).subscribe((res: any) => {
      let data = res.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      this.dataSource.data = data;
    //console.log(this.students);
    // setTimeout(() => {
    //  // console.log(this.sort) //not undefined
    //   this.dataSource.sort = this.sort; 
    // })
    });
  }

  statusLabel(status:string) {
    if(status == "IN") {
      return "Present"
    }else if(status == "OUT") {
      return "Absent"
    }else {
      return status;
    }
  }

}
