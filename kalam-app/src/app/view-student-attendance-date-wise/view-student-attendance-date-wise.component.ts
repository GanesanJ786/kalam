import { Component, OnInit, Inject, ChangeDetectorRef, ViewChild  } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { KalamService } from '../kalam.service';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-view-student-attendance-date-wise',
  templateUrl: './view-student-attendance-date-wise.component.html',
  styleUrls: ['./view-student-attendance-date-wise.component.scss']
})
export class ViewStudentAttendanceDateWiseComponent implements OnInit {

  displayedColumns: string[] = ['name','status'];
  attendanceRangeGroup: any;
  dataSource = new MatTableDataSource();
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  constructor(private kalamService: KalamService, private cdr: ChangeDetectorRef,
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ViewStudentAttendanceDateWiseComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.data = this.data.sort((a:any,b:any) => a.status > b.status ? 1 : -1);
      this.dataSource.data = this.data;
      setTimeout(() => {
         this.dataSource.sort = this.sort; 
       })
     }

  ngOnInit(): void {
    
  }

  ngAfterViewChecked(){
    //your code to update the model
    this.cdr.detectChanges();
 }

  cancel(){
    this.dialogRef.close();
  }

}
