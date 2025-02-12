import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { KalamService } from '../kalam.service';
import { StudentDetails } from '../student-form/student-form.component';
import { SportsList } from '../constant';
import { AddGamesComponent } from '../popup-screens/add-games/add-games.component';

@Component({
  selector: 'app-view-student-data',
  templateUrl: './view-student-data.component.html',
  styleUrls: ['./view-student-data.component.scss']
})
export class ViewStudentDataComponent implements OnInit {

  title: string = "PLAYER";
  student: StudentDetails;
  panelOpenState = false;
  
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
  }

  cancel(){
    this.dialogRef.close();
  }
  getSportLabel(value: string) {
    return SportsList.filter(res => res.value == value)[0].label;
  }
  addGame(){
    const dialogRef = this.dialog.open(AddGamesComponent, {
      maxWidth: '80vw',
      maxHeight: '80vh',
      height: '80%',
      width: '80%',
      panelClass: 'full-screen-modal',
      data: {groundName: "", groundAddress: "", dialogType: "Ground"},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

}
