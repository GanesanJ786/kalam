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
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { KalamService } from '../kalam.service';
import { getSportIcon } from '../constant';
import { AddGroundComponent } from '../add-ground/add-ground.component';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { take } from 'rxjs/operators';
import { ViewStudentAttendanceDateWiseComponent } from '../view-student-attendance-date-wise/view-student-attendance-date-wise.component';
import { CoachTaskDialogComponent } from '../coach-task-dialog/coach-task-dialog.component';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
    selector: 'app-view-coach-attendance',
    templateUrl: './view-coach-attendance.component.html',
    styleUrls: ['./view-coach-attendance.component.scss'],
    standalone: false
})
export class ViewCoachAttendanceComponent implements OnInit {

  coachList: any = [];
  coachId: string = "";
  allCoachList: any = [];
  coachVal: string = '';
  coachView: any = [];
  title: string = "Coach Attendance";
  getSportIcon = getSportIcon;
  selectedCoachSport: string = '';
  startOfMonth: any;
  endOfMonth: any;
  attendanceRangeGroup: any;
  startDate:  number = 1;
  endDate: number = 7;
  taskEntries: any = [];

  constructor(private router: Router, private kalamService: KalamService, public dialog: MatDialog) { 
    this.coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;

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
      // Add head coach (self) at start so they can view their own attendance
      const coachData = this.kalamService.getCoachData();
      this.coachList.unshift({
        kalamId: coachData.kalamId,
        name: `${coachData.name} (Self)`
      });
    });
  }

  
  ngOnInit(): void {
    let todayDate = new Date().getDate();
    this.startOfMonth = new Date(moment().startOf('month').format('YYYY-MM-DD hh:mm'));
    this.endOfMonth   = new Date(moment().endOf('month').format('YYYY-MM-DD hh:mm'));
    this.startDate = todayDate > 7 ? todayDate-7 : 1;
    this.endDate = todayDate > 7 ? todayDate : 7 ;
    this.attendanceRangeGroup = new UntypedFormGroup({
      start: new UntypedFormControl(new Date(year, month, this.startDate)),
      end: new UntypedFormControl(new Date(year, month, this.endDate)),
    });
  }

  viewStudentAttendance(coach: any) {
    this.kalamService.getStudentAttendanceByCoachDatewise(coach).pipe(take(1)).subscribe((coach:any) => {
      let obj = coach.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      const dialogRef = this.dialog.open(ViewStudentAttendanceDateWiseComponent, {
        data: obj
      });
  
      dialogRef.afterClosed().subscribe(result => {
        
      });
    });
    
  }

  viewCoachTasks() {
    const selectedCoach = this.coachList.find((c: any) => c.kalamId === this.coachVal);
    const dateRange = {
      start: moment(this.attendanceRangeGroup.value.start).format('MM/DD/YYYY'),
      end: moment(this.attendanceRangeGroup.value.end).format('MM/DD/YYYY')
    };
    const dialogRef = this.dialog.open(CoachTaskDialogComponent, {
      data: {
        taskEntries: this.taskEntries,
        coachName: selectedCoach ? selectedCoach.name : '',
        dateRange: dateRange
      },
      panelClass: 'vca-task-dialog-panel',
      maxWidth: '95vw',
      width: '480px',
      maxHeight: '85vh'
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
    const selectedCoach = this.coachList.find((c: any) => c.kalamId === this.coachVal);
    this.selectedCoachSport = selectedCoach?.toCoach?.[0] || '';
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

      const filteredData = coachData.filter((item: any) => {
        const itemDate = new Date(this.kalamService.convertToISO(item.activeDate));
        return itemDate >= new Date(this.kalamService.convertToISO(dateRange.start)) && itemDate <= new Date(this.kalamService.convertToISO(dateRange.end));
      });

      coachData = filteredData;

      // Separate TASK entries from regular attendance
      this.taskEntries = coachData.filter((v: any) => v.status === 'TASK');

      let sortCoach = _.sortBy(coachData.filter((v: any) => v.status !== 'TASK'), ["loginDate", "loginTime","groundName"]);
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
          inC.logoutCoords = outCoachData.logoutCoords || null;
          inC.notes = outCoachData.notes;
          outCoachData.matched = true;
        }else {
          inC.logOffDataTime = "-"
          inC.logoutAddress = null;
          inC.logoutCoords = null;
        }
      });
      if(leaveData.length > 0) {
        inCoach = inCoach.concat(leaveData);
      }
      this.coachView = inCoach.sort((a: any, b: any) => {
        const dateTimeA = new Date(`${this.kalamService.convertToISO(a.loginDate)}T${a.loginTime || '00:00:00'}`).getTime();
        const dateTimeB = new Date(`${this.kalamService.convertToISO(b.loginDate)}T${b.loginTime || '00:00:00'}`).getTime();
        return dateTimeB - dateTimeA;
      });
      
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

  viewLocation(loginAddress:string, logoutAddress: string, loginCoords?: any, logoutCoords?: any) {
    const dialogRef = this.dialog.open(AddGroundComponent, {
      disableClose: false,
      data: {
        loginAddress: loginAddress,
        logoutAddress: logoutAddress,
        loginCoords: loginCoords || null,
        logoutCoords: logoutCoords || null,
        dialogType: "Location"
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      
    });
  }

  getPresentCount(): number {
    return this.coachView.filter((c: any) => c.status !== 'LEAVE').length;
  }

  getLeaveCount(): number {
    return this.coachView.filter((c: any) => c.status === 'LEAVE').length;
  }

  getTaskStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'task-pending';
      case 'Acknowledged': return 'task-acknowledged';
      case 'Completed': return 'task-completed';
      default: return '';
    }
  }

  getTaskPendingCount(): number {
    return this.taskEntries.filter((t: any) => t.taskStatus === 'Pending').length;
  }

  getTaskCompletedCount(): number {
    return this.taskEntries.filter((t: any) => t.taskStatus === 'Completed').length;
  }

  getDateRangeLabel(): string {
    const start = this.attendanceRangeGroup.value.start;
    const end = this.attendanceRangeGroup.value.end;
    if (start && end) {
      return `${moment(start).format('MMM D')} – ${moment(end).format('MMM D, YYYY')}`;
    }
    return '';
  }

}
