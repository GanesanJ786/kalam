import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { KalamService } from '../kalam.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AllStudentsByGroundComponent } from '../all-students-by-ground/all-students-by-ground.component';
import { StudentDetails } from '../student-form/student-form.component';
import * as moment from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import * as _ from 'lodash';

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
  displayedColumns: string[] = ['name','ground','date','status'];
  attendanceRangeGroup: any;
  dataSource = new MatTableDataSource();
  startDate:  number = 1;
  endDate: number = 7;
  
  constructor(
    private kalamService: KalamService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<AllStudentsByGroundComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StudentDetails,
  ) { 
    this.student = {} as StudentDetails;
  }

  ngOnInit(): void {
    let todayDate = new Date().getDate();
    this.student = this.data;
    this.startOfMonth = new Date(moment().startOf('month').format('YYYY-MM-DD hh:mm'));
    this.endOfMonth   = new Date(moment().endOf('month').format('YYYY-MM-DD hh:mm'));
    this.startDate = todayDate > 7 ? todayDate-7 : 1;
    this.endDate = todayDate > 7 ? todayDate : 7 ;
    this.attendanceRangeGroup = new FormGroup({
      start: new FormControl(new Date(year, month, this.startDate)),
      end: new FormControl(new Date(year, month, this.endDate)),
    });
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

      const filteredData = _.filter(data, (item) => {
        const itemDate = new Date(item.loginDate);
        return itemDate >= new Date(obj.start) && itemDate <= new Date(obj.end); // Excludes exact matches
      });
  
      data = filteredData;

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
