import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';
import { RatingLevel, SelectItemNum } from '../constant';
import { KalamService } from '../kalam.service';
import { StudentDetails } from '../student-form/student-form.component';
import * as moment from 'moment';

export interface StudentPerformance {
  numberofGoals: number;
  assist: number;
  accuratePass: number;
  chanceCreated: number;
  shootOnTarget: number;
  shootOffTarget: number;
  accurateCrosses: number;
  longBallPass: number;
  tacklesWonOnevsOne: number;
  clearance: number;
  heading: number;
  recovery: number;
  foulCommited: number;
  wasFouled: number;
  gameSense: number;
  gameDate: string;
  gameTitle: string;
}

export interface ChessPerformance {
  gameTitle: string;
  gameDate: string;
  kalamId: string;
  coachId: string;
  result: string;
  moveAccuracy: string;
  mistakes: string;
  timeUsage: string;
}

@Component({
  selector: 'app-student-performance',
  templateUrl: './student-performance.component.html',
  styleUrls: ['./student-performance.component.scss']
})
export class StudentPerformanceComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<StudentPerformanceComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: StudentDetails,
    private kalamService: KalamService) { 
    this.studentPerformance = {} as StudentPerformance;
    this.chessPerformance = {} as ChessPerformance;
    this.ratingLevel = RatingLevel;
    }

  title = "Add Student Performance";
  addStudentPerformance!: FormGroup;
  studentPerformance: StudentPerformance;
  chessPerformance: ChessPerformance;
  sportType: string = 'football';

  ratingLevel: SelectItemNum[] = [];

  ngOnInit(): void {
    this.addStudentPerformance = new FormGroup({
       ...(this.sportType == 'football' && {
        gameDate: new FormControl(this.studentPerformance.gameDate,[Validators.required]),
        gameTitle: new FormControl(this.studentPerformance.gameTitle,[Validators.required]),
        numberofGoals: new FormControl(this.studentPerformance.numberofGoals,[Validators.required]),
        assist: new FormControl(this.studentPerformance.assist,[Validators.required]),
        accuratePass: new FormControl(this.studentPerformance.accuratePass,[Validators.required]),
        chanceCreated: new FormControl(this.studentPerformance.chanceCreated,[Validators.required]),
        shootOnTarget: new FormControl(this.studentPerformance.shootOnTarget,[Validators.required]),
        shootOffTarget: new FormControl(this.studentPerformance.shootOffTarget,[Validators.required]),
        accurateCrosses: new FormControl(this.studentPerformance.accurateCrosses,[Validators.required]),
        longBallPass: new FormControl(this.studentPerformance.longBallPass,[Validators.required]),
        tacklesWonOnevsOne: new FormControl(this.studentPerformance.tacklesWonOnevsOne,[Validators.required]),
        clearance: new FormControl(this.studentPerformance.clearance,[Validators.required]),
        heading: new FormControl(this.studentPerformance.heading,[Validators.required]),
        recovery: new FormControl(this.studentPerformance.recovery,[Validators.required]),
        foulCommited: new FormControl(this.studentPerformance.foulCommited,[Validators.required]),
        wasFouled: new FormControl(this.studentPerformance.wasFouled,[Validators.required]),
        gameSense: new FormControl(this.studentPerformance.gameSense,[Validators.required]),
       }),
       ...(this.sportType == 'chess' && {
        gameTitle: new FormControl(this.chessPerformance.gameTitle,[Validators.required]),
        result: new FormControl(this.chessPerformance.result,[Validators.required]),
        gameDate: new FormControl(this.chessPerformance.gameDate,[Validators.required]),
        moveAccuracy: new FormControl(this.chessPerformance.moveAccuracy,[Validators.required]),
        mistakes: new FormControl(this.chessPerformance.mistakes,[Validators.required]),
        timeUsage: new FormControl(this.chessPerformance.timeUsage,[Validators.required]),
      })
      });
  }

  cancel(){
    this.dialogRef.close();
  }
  save(){
    console.log(this.addStudentPerformance.value)
    if (this.addStudentPerformance.invalid) {
      for (const control of Object.keys(this.addStudentPerformance.controls)) {
        this.addStudentPerformance.controls[control].markAsTouched();
      }
      return;
    }
    const coachId = this.kalamService.getCoachData().kalamId;
    let studentPerData = this.addStudentPerformance.value;
    studentPerData['gameDate'] = moment(this.addStudentPerformance.value.gameDate).format("MM/DD/YYYY");
    studentPerData['kalamId'] = this.data.kalamId;
    studentPerData['coachId'] = coachId;
    this.kalamService.addStudentPerformace(studentPerData);
    this.dialogRef.close();
  }

}