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
import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA as MAT_DIALOG_DATA, MatDialogRef as MatDialogRef } from '@angular/material/dialog';
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

export interface FitnessPerformance {
  gameTitle: string;
  gameDate: string;
  kalamId: string;
  coachId: string;
  endurance: number;
  strength: number;
  flexibility: number;
  speed: number;
  balance: number;
  coreStrength: number;
  recovery: number;
}

@Component({
    selector: 'app-student-performance',
    templateUrl: './student-performance.component.html',
    styleUrls: ['./student-performance.component.scss'],
    standalone: false
})
export class StudentPerformanceComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<StudentPerformanceComponent>, 
    @Inject(MAT_DIALOG_DATA) public data: StudentDetails,
    private kalamService: KalamService) { 
    this.studentPerformance = {} as StudentPerformance;
    this.chessPerformance = {} as ChessPerformance;
    this.fitnessPerformance = {} as FitnessPerformance;
    this.ratingLevel = RatingLevel;
    this.sportType = this.data.preferredSport || 'football';
    }

  title = "Add Student Performance";
  addStudentPerformance!: UntypedFormGroup;
  studentPerformance: StudentPerformance;
  chessPerformance: ChessPerformance;
  fitnessPerformance: FitnessPerformance;
  sportType: string = 'football';

  ratingLevel: SelectItemNum[] = [];
  pastPerformances: any[] = [];
  isSmartFilled = false;

  ngOnInit(): void {
    this.loadPastPerformances();
    this.addStudentPerformance = new UntypedFormGroup({
       ...(this.sportType == 'football' && {
        gameDate: new UntypedFormControl(this.studentPerformance.gameDate,[Validators.required]),
        gameTitle: new UntypedFormControl(this.studentPerformance.gameTitle,[Validators.required]),
        numberofGoals: new UntypedFormControl(this.studentPerformance.numberofGoals,[Validators.required]),
        assist: new UntypedFormControl(this.studentPerformance.assist,[Validators.required]),
        accuratePass: new UntypedFormControl(this.studentPerformance.accuratePass,[Validators.required]),
        chanceCreated: new UntypedFormControl(this.studentPerformance.chanceCreated,[Validators.required]),
        shootOnTarget: new UntypedFormControl(this.studentPerformance.shootOnTarget,[Validators.required]),
        shootOffTarget: new UntypedFormControl(this.studentPerformance.shootOffTarget,[Validators.required]),
        accurateCrosses: new UntypedFormControl(this.studentPerformance.accurateCrosses,[Validators.required]),
        longBallPass: new UntypedFormControl(this.studentPerformance.longBallPass,[Validators.required]),
        tacklesWonOnevsOne: new UntypedFormControl(this.studentPerformance.tacklesWonOnevsOne,[Validators.required]),
        clearance: new UntypedFormControl(this.studentPerformance.clearance,[Validators.required]),
        heading: new UntypedFormControl(this.studentPerformance.heading,[Validators.required]),
        recovery: new UntypedFormControl(this.studentPerformance.recovery,[Validators.required]),
        foulCommited: new UntypedFormControl(this.studentPerformance.foulCommited,[Validators.required]),
        wasFouled: new UntypedFormControl(this.studentPerformance.wasFouled,[Validators.required]),
        gameSense: new UntypedFormControl(this.studentPerformance.gameSense,[Validators.required]),
       }),
       ...(this.sportType == 'chess' && {
        gameTitle: new UntypedFormControl(this.chessPerformance.gameTitle,[Validators.required]),
        result: new UntypedFormControl(this.chessPerformance.result,[Validators.required]),
        gameDate: new UntypedFormControl(this.chessPerformance.gameDate,[Validators.required]),
        moveAccuracy: new UntypedFormControl(this.chessPerformance.moveAccuracy,[Validators.required]),
        mistakes: new UntypedFormControl(this.chessPerformance.mistakes,[Validators.required]),
        timeUsage: new UntypedFormControl(this.chessPerformance.timeUsage,[Validators.required]),
      }),
       ...(this.sportType == 'fitness' && {
        gameTitle: new UntypedFormControl(this.fitnessPerformance.gameTitle,[Validators.required]),
        gameDate: new UntypedFormControl(this.fitnessPerformance.gameDate,[Validators.required]),
        endurance: new UntypedFormControl(this.fitnessPerformance.endurance,[Validators.required]),
        strength: new UntypedFormControl(this.fitnessPerformance.strength,[Validators.required]),
        flexibility: new UntypedFormControl(this.fitnessPerformance.flexibility,[Validators.required]),
        speed: new UntypedFormControl(this.fitnessPerformance.speed,[Validators.required]),
        balance: new UntypedFormControl(this.fitnessPerformance.balance,[Validators.required]),
        coreStrength: new UntypedFormControl(this.fitnessPerformance.coreStrength,[Validators.required]),
        recovery: new UntypedFormControl(this.fitnessPerformance.recovery,[Validators.required]),
      })
      });
  }

  cancel(){
    this.dialogRef.close();
  }

  loadPastPerformances() {
    if (this.data.kalamId) {
      this.kalamService.getStudentPerformance(this.data.kalamId).subscribe((res: any) => {
        this.pastPerformances = res.map((doc: any) => ({
          id: doc.payload.doc.id,
          ...doc.payload.doc.data() as {}
        }));
      });
    }
  }

  smartFill() {
    const excludeFields = ['gameDate', 'gameTitle', 'result', 'timeUsage'];
    const ratingFields = Object.keys(this.addStudentPerformance.controls)
      .filter(key => !excludeFields.includes(key));

    if (this.pastPerformances.length > 0) {
      // Use averages from past performance data
      for (const field of ratingFields) {
        const values = this.pastPerformances
          .map(p => p[field])
          .filter(v => v !== undefined && v !== null && !isNaN(Number(v)));
        if (values.length > 0) {
          const avg = Math.round(values.reduce((a: number, b: number) => a + b, 0) / values.length);
          this.addStudentPerformance.get(field)?.setValue(avg);
        }
      }
    } else {
      // Use competency-based defaults
      const competency = (this.data.competency || '').toLowerCase();
      let base: number;
      if (competency === 'advanced') {
        base = 7;
      } else if (competency === 'intermediate') {
        base = 5;
      } else {
        base = 3;
      }
      for (const field of ratingFields) {
        this.addStudentPerformance.get(field)?.setValue(base);
      }
    }

    // Auto-set today's date
    this.addStudentPerformance.get('gameDate')?.setValue(new Date());
    this.isSmartFilled = true;
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