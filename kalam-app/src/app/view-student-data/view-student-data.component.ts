import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { KalamService } from '../kalam.service';
import { StudentDetails } from '../student-form/student-form.component';
import { SportsList } from '../constant';
import { StudentPerformance, StudentPerformanceComponent } from '../student-performance/student-performance.component';
import * as _ from 'lodash';

@Component({
  selector: 'app-view-student-data',
  templateUrl: './view-student-data.component.html',
  styleUrls: ['./view-student-data.component.scss']
})
export class ViewStudentDataComponent implements OnInit {

  title: string = "PLAYER";
  student: StudentDetails;
  panelOpenState = false;
  studentPerData: StudentPerformance[] = [];
  
  constructor(
    private kalamService: KalamService,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ViewStudentDataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StudentDetails,
  ) {
    this.student = {} as StudentDetails;
  }

  ngOnInit(): void {
    this.student = this.data
    this.getStudentPerformance();
  }

  getStudentPerformance() {
    if(this.student.kalamId){
      this.kalamService.getStudentPerformance(this.student.kalamId).subscribe((res: any) => {
        let data = res.map((document: any) => {
          return {
            id: document.payload.doc.id,
            ...document.payload.doc.data() as {}
          }
        });
        this.studentPerData = _.sortBy(data, 'gameDate').reverse();
      });
    }
  }

  cancel(){
    this.dialogRef.close();
  }
  getSportLabel(value: string) {
    return SportsList.filter(res => res.value == value)[0].label;
  }

  addPerform(){
    // let studentPer = {
    //   name: "786"
    // }

    // const studentId: string | undefined = this.student.id;
    // if (studentId) {
    //   this.kalamService.addStudentPerformace(studentId,studentPer);
    // } else {
    //   console.error('User ID is undefined');
    // }
    const dialogRef = this.dialog.open(StudentPerformanceComponent, {
      width: '95%', 
      maxWidth: '95%',
      data: {...this.student},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      //console.log(result);
    });
  }

}
