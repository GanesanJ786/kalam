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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SportsList, UnderAge, getSportIcon } from '../constant';
import { KalamService } from '../kalam.service';
import { LoaderService } from '../loader.service';
import { StudentDetails } from '../student-form/student-form.component';
import * as moment from 'moment';
import * as _ from "lodash";
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { AddGroundComponent } from '../add-ground/add-ground.component';
import { ViewStudentDataComponent } from '../view-student-data/view-student-data.component';
import { ViewStudentAttendanceRangeComponent } from '../view-student-attendance-range/view-student-attendance-range.component';

@Component({
    selector: 'app-my-teams',
    templateUrl: './my-teams.component.html',
    styleUrls: ['./my-teams.component.scss'],
    standalone: false
})
export class MyTeamsComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  getSportIcon = getSportIcon;

  constructor(private router: Router, private loaderService: LoaderService, public dialog: MatDialog,  private kalamService: KalamService) {
    this.coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
    this.owner = this.kalamService.getCoachData().academyId ? false : true;
    this.kalamService.getStudentDetailsCached(this.coachId).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.allStudents = data;
      this.underList();
    });
    this.kalamService.getGroundDetailsCached(this.coachId).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.groundList = data;
    });

    //this.getStudentAttendance();
  }
  ageType: string = '';
  studentList: any;
  allStudents: any;
  underCategory: any = [];
  groundName: string = '';
  groundList: any = [];
  coachId: string | undefined;
  owner: boolean = true;
  studentListView: boolean = true;
  viewStudentAttendance: boolean = false;
  allStudentAttendance: any = [];

  ngOnInit(): void {
    
  }

  getStudentAttendance() {
    this.kalamService.getAllStudentAttendanceData(this.coachId, this.ageConvert(this.ageType), this.groundName).pipe(take(1)).subscribe((stud:any) => {
      let stundentData = stud.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      this.allStudentAttendance =  _.sortBy(stundentData, ["ageType", "loginDate"]);
    })
  }

  checkFees() {
    let currentMonth = moment().startOf("month").format('MMMM');
    this.studentList.forEach((element: StudentDetails) => {
      if((element.feesMonthPaid !== currentMonth || element.feesMonthPaid == undefined) && !element.feesApproveWaiting) {
        element.isFeesEnable = true;
      }else {
        element.isFeesEnable = false;
      } 
    });
  }

  getStudentList() {
    
    this.loaderService.show();
    const coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
    this.kalamService.studentList({coachId: coachId, underAge: this.ageType, groundName: this.groundName}).pipe(take(1)).subscribe((res: any) => {
      this.loaderService.hide();
      let data = res.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      this.studentList = data.sort((a:StudentDetails,b:StudentDetails) => a.playingPostion > b.playingPostion ? 1 : -1);
      this.checkAttendance();
    });
  }

  getStudentListUnderAge() {
    this.loaderService.show();
    const coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
    this.kalamService.studentListUnderAge({coachId: coachId, underAge: this.ageType}).pipe(take(1)).subscribe((res: any) => {
      this.loaderService.hide();
      let data = res.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      
      /* AGE Age & Under age update by select age group and select "ALL" in ground

      data.forEach((d: any) => {
        let newAge = moment.duration(moment().diff(d.dob)).years();
        let newUnderAge = this.underAgeCalc(d.dob);
        if(d.underAge !== newUnderAge || d.age !== newAge) {
          d.age = newAge;
          d.underAge = newUnderAge;
          this.kalamService.editStudentDetails(d);
        }
      })

      */
      this.studentList = data.sort((a:StudentDetails,b:StudentDetails) => a.playingPostion > b.playingPostion ? 1 : -1);
      this.checkAttendance();
    });
  }

  underAgeCalc(dobDate: string) {
    let type = ""
    // if(val <= 15) {
    //   type = 'u-15';
    // }else if(val == 16) {
    //   type = 'u-16';
    // }else if(val <= 19) {
    //   type = 'u-19';
    // }else if(val <= 23) {
    //   type = 'u-23';
    // }else {
    //   type = 'open'
    // }

    let dob = moment(dobDate);
    let today = moment();

    let val = today.year() - dob.year();

    if(val < 6) {
      type = 'u-5';
    }else if(val <=21) {
      type = `u-${val}`;
    }else {
      type = 'open'
    }

    return type
  }

  checkAttendance() {
    const coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
    this.checkFees();
      this.kalamService.getStudentAttendanceData(coachId, moment().format("MM-DD-YYYY")).pipe(take(1)).subscribe((stud:any) => {
        let stundentData = stud.map((document: any) => {
          return {
            id: document.payload.doc.id,
            ...document.payload.doc.data() as {}
          }
        });
        stundentData.forEach((studList:any) => {
          this.studentList.forEach((element: any) => {
            //element['disableInBtn'] = false;
            if(studList.status == "IN" && element.kalamId == studList.kalamId && element.name == studList.name) {
              element['disableInBtn'] = true;
            }
            if(studList.status == "OUT" && element.kalamId == studList.kalamId && element.name == studList.name && studList.evening !== false) {
              element['disableOutBtn'] = true;
            }
            if(studList.status == "IN" && element.kalamId == studList.kalamId && element.name == studList.name && studList.evening) {
              element['disableEveBtn'] = true;
            }
            
          });
        });
      })
  }

  underList() {
    this.underCategory = [];
    this.allStudents.forEach((element:any) => {
      let obj = {
        value: element.underAge,
        key: this.ageConvert(element.underAge),
        age: this.checkAge(element)
      }
      this.underCategory.push(obj);
    });
    this.underCategory = this.underCategory.reduce((unique:any, o:any) => {
        if(!unique.some((obj:any) => obj.key === o.key && obj.value === o.value)) {
          unique.push(o);
        }
        return unique;
    },[]);
    this.underCategory = this.underCategory.sort((a:any,b:any) => a.age > b.age ? 1 : -1);
  }

  checkAge(element: StudentDetails) {
    if(element.underAge !== "open") {
      return Number(element.underAge?.split("-")[1]);
    }else {
      return element.age;
    }
  }

  ageConvert(val: string) {
    if(val == "open") {
      return "Open"
    }else {
      return "Under-"+val.split("-")[1];
    }
  }

  newStudent() {
    this.router.navigate([`/student-form`]);
  }

  underSelection() {
    if(this.ageType && this.groundName) {
      if(this.groundName == "all") {
        this.getStudentListUnderAge();
        //this.getStudentAttendance();
      }else{
        this.getStudentList();
        //this.getStudentAttendance();
      }
    }
  }

  studentAttendanceRange(student: StudentDetails) {
    const dialogRef = this.dialog.open(ViewStudentAttendanceRangeComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      data: student
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      //console.log(result);
      
    });
  }

  getSportLabel(value: string) {
    const match = SportsList.filter(res => res.value == value)[0];
    return match ? match.label : value || '';
  }

  getUnderAgeLabel(value: string) {
    const match = UnderAge.filter(res => res.value == value)[0];
    return match ? match.label : value || '';
  }

  checkIn(student: StudentDetails, eve?: boolean) {
    const studentAttendance = {
      kalamId: student.kalamId,
      name: student.name,
      academyId: this.coachId,
      coachId: this.kalamService.getCoachData().kalamId,
      groundName: this.groundName,
      loginTime: moment().format("HH:mm:ss"),
      loginDate: moment().format("MM-DD-YYYY"),
      ageType: this.ageConvert(this.ageType),
      sessionType:moment().format('a'),
      status: "IN",
      ...eve && {evening: eve} 
    }
    if(eve) {
      student['disableEveBtn'] = true;
      student["disableOutBtn"] = false;
    }
    if(student["disableOutBtn"] && !eve) {
      let query = {
        name: student.name,
        kalamId: student.kalamId,
        loginDate: moment().format("MM-DD-YYYY"),
        coachId: this.kalamService.getCoachData().kalamId
      }
      this.kalamService.getStudentAttendanceUpdate(query).pipe(take(1)).subscribe((stud:any) => {
        let stundentData = stud.map((document: any) => {
          return {
            id: document.payload.doc.id,
            ...document.payload.doc.data() as {}
          }
        })
        this.kalamService.editStudentAttendance(studentAttendance,stundentData[0].id);
        student["disableOutBtn"] = false;
        
      }) 
    }else {
      this.kalamService.studentAttendance(studentAttendance)
    }
    student["disableInBtn"] = true;
    if(moment().format('a') == "pm") {
      student["hideEve"] = true;
    }
  }
  out(student: StudentDetails) {
    const studentAttendance: any = {
      kalamId: student.kalamId,
      name: student.name,
      academyId: this.coachId,
      coachId: this.kalamService.getCoachData().kalamId,
      groundName: this.groundName,
      loginTime: moment().format("HH:mm:ss"),
      loginDate: moment().format("MM-DD-YYYY"),
      ageType: this.ageConvert(this.ageType),
      sessionType:moment().format('a'),
      status: "OUT"
    }
    if(student["disableInBtn"]) {
      if(student['disableEveBtn']) {
        studentAttendance['evening'] = false;
        let query = {
          name: student.name,
          kalamId: student.kalamId,
          loginDate: moment().format("MM-DD-YYYY"),
          coachId: this.kalamService.getCoachData().kalamId
        }
        this.kalamService.getStudentAttendanceUpdateEvening(query).pipe(take(1)).subscribe((stud:any) => {
          let stundentData = stud.map((document: any) => {
            return {
              id: document.payload.doc.id,
              ...document.payload.doc.data() as {}
            }
          })
          this.kalamService.deleteStudentAttendance(stundentData[0].id);
          student["disableEveBtn"] = false;
         
        }) 
      }else {
        let query = {
          name: student.name,
          kalamId: student.kalamId,
          loginDate: moment().format("MM-DD-YYYY"),
          coachId: this.kalamService.getCoachData().kalamId
        }
        this.kalamService.getStudentAttendanceUpdate(query).pipe(take(1)).subscribe((stud:any) => {
          let stundentData = stud.map((document: any) => {
            return {
              id: document.payload.doc.id,
              ...document.payload.doc.data() as {}
            }
          })
          this.kalamService.editStudentAttendance(studentAttendance,stundentData[0].id);
          student["disableInBtn"] = false;
          
        }) 
      }
      
    }else {
      this.kalamService.studentAttendance(studentAttendance);
    }
 
    student["disableOutBtn"] = true;
    if(moment().format('a') == "pm") {
      student["hideEve"] = false;
    }
  }
  viewStudent() {
    this.studentListView = true;
    this.viewStudentAttendance = false;
  }
  viewAttendance() {
    this.studentListView = false;
    this.viewStudentAttendance = true;
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
  editStudent(student:StudentDetails) {
    delete(student.hideEve);
    delete(student.disableOutBtn);
    delete(student.disableInBtn);
    delete(student.disableEveBtn);
    this.kalamService.editStudentData = student;
    this.router.navigate([`/student-form`],{ queryParams: { source: 'edit' }});
  }
  pay(student: StudentDetails) {
    const dialogRef = this.dialog.open(AddGroundComponent, {
      disableClose: true,
      data: {dialogType: "Payment"},
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.data.amount) {
        student.feesAmount = result.data.amount;
        student.feesApproveWaiting = true;
        student.fessCollectedBy = this.kalamService.getCoachData().name;
        student.feesPaidDate = moment().format("MM-DD-YYYY");
        if(this.owner) {
          student.feesApproveWaiting = false;
          student.feesMonthPaid = moment().startOf("month").format('MMMM');
        }
        this.kalamService.editStudentDetails(student);
        this.checkFees();
      }
    });    
  }

  viewStudentProfile(student: StudentDetails) {
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
