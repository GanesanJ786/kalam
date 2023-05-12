import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { KalamService } from '../kalam.service';
import { AddGroundComponent } from '../add-ground/add-ground.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { FormControl, FormGroup } from '@angular/forms';
import { ViewStudentAttendanceDateWiseComponent } from '../view-student-attendance-date-wise/view-student-attendance-date-wise.component';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-view-coach-attendance',
  templateUrl: './view-coach-attendance.component.html',
  styleUrls: ['./view-coach-attendance.component.scss']
})
export class ViewCoachAttendanceComponent implements OnInit {

  coachList: any = [];
  coachId: string = "";
  allCoachList: any = [];
  coachVal: string = '';
  coachView: any = [];
  title: string = "Coaches Details";
  startOfMonth: any;
  endOfMonth: any;
  attendanceRangeGroup: any;
  startDate:  number = 1;
  endDate: number = 7;

  constructor(private router: Router, private kalamService: KalamService, public dialog: MatDialog) { 
    this.coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
    // this.kalamService.getCoachAttendanceData(this.coachId).subscribe((coach: any) => {
    //   let coachData = coach.map((document: any) => {
    //     return {
    //       id: document.payload.doc.id,
    //       ...document.payload.doc.data() as {}
    //     }
    //   });
    //   this.allCoachList = coachData;
    //   this.coachList = coachData.reduce((unique:any, o:any) => {
    //       if(!unique.some((obj:any) => obj.inCoachId === o.inCoachId)) {
    //         unique.push(o);
    //       }
    //       return unique;
    //   },[]);
    // })

    const query = {
      academyId: `A${this.kalamService.getCoachData().kalamId}`
    }
    this.kalamService.getAcademyCoaches(query).subscribe((coach:any) => {
      let obj = coach.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      this.coachList = obj;
    });
  }

  
  ngOnInit(): void {
    let todayDate = new Date().getDate();
    this.startOfMonth = new Date(moment().startOf('month').format('YYYY-MM-DD hh:mm'));
    this.endOfMonth   = new Date(moment().endOf('month').format('YYYY-MM-DD hh:mm'));
    this.startDate = todayDate > 7 ? todayDate-7 : 1;
    this.endDate = todayDate > 7 ? todayDate : 7 ;
    this.attendanceRangeGroup = new FormGroup({
      start: new FormControl(new Date(year, month, this.startDate)),
      end: new FormControl(new Date(year, month, this.endDate)),
    });
  }

  viewStudentAttendance(coach: any) {
    this.kalamService.getStudentAttendanceByCoachDatewise(coach).subscribe((coach:any) => {
      let obj = coach.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      //console.log(obj)
      const dialogRef = this.dialog.open(ViewStudentAttendanceDateWiseComponent, {
        data: obj
      });
  
      dialogRef.afterClosed().subscribe(result => {
        //console.log('The dialog was closed');
        //console.log(result);
        
      });
    });
    
  }

  gotoHome() {
    this.router.navigate([`/home`]);
  }
  dateChange(event: any) {
    if(this.coachVal && event.value) {
      this.coachSelection();
    }
  }
  coachSelection() {
    const query = {
      academyId: `${this.kalamService.getCoachData().kalamId}`,
      inCoachId: this.coachVal
    }
    const dateRange = {
      start: moment(this.attendanceRangeGroup.value.start).format('MM-DD-YYYY'),
      end: moment(this.attendanceRangeGroup.value.end).format('MM-DD-YYYY')
    }
    this.kalamService.getACoachAttendanceData(query, dateRange).subscribe((coach:any) => {
      let coachData = coach.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      let sortCoach = _.sortBy(coachData, ["loginDate", "loginTime","groundName"]);
      let inCoach = sortCoach.filter((v:any) => v.status == "IN");
      let outCoach = sortCoach.filter((v:any) => v.status == "OUT");
      let leaveData = sortCoach.filter((v:any) => v.status == "LEAVE");
      outCoach = _.sortBy(outCoach, ["logoffDate", "logoffTime","groundName"]);
      outCoach.forEach(r => r.matched = false);
      inCoach.forEach((inC:any,i:any) => {
        let outCoachData = outCoach.find(r => r.logoffDate == inC.loginDate && !r.matched);
        if(outCoachData) {
          inC.logOffDataTime = `${outCoachData.logoffDate} ${outCoachData.logoffTime}`;
          inC.logoutAddress = outCoachData.logoutAddress ? outCoachData.logoutAddress : null;
          inC.notes = outCoachData.notes;
          outCoachData.matched = true;
        }else {
          inC.logOffDataTime = "-"
          inC.logoutAddress = null;
        }
      });
      if(leaveData.length > 0) {
        inCoach = inCoach.concat(leaveData);
        this.coachView = _.sortBy(inCoach, ["loginDate"]);
      }else {
        this.coachView = inCoach;
      }
      
      });
  }

  logOffValue(coach: any) {
    if(coach.logoffDate) {
      return coach.logoffDate+" "+coach.logoffTime
    }
    return "-"
  }

  logInValue(coach: any) {
    if(coach.loginDate) {
      return coach.loginDate+" "+coach.loginTime
    }
    return "-"
  }

  checkValue(data: any) {
    if(data) {
      return data;
    }else {
      return "-";
    }
  }

  viewLocation(loginAddress:string, logoutAddress: string) {
    const dialogRef = this.dialog.open(AddGroundComponent, {
      disableClose: false,
      data: {loginAddress: loginAddress, logoutAddress: logoutAddress, dialogType: "Location"},
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      //console.log(result);
      
    });
  }

}
