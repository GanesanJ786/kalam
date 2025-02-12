import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SportsList, UnderAge } from '../constant';
import { KalamService } from '../kalam.service';
import { LoaderService } from '../loader.service';
import { StudentDetails } from '../student-form/student-form.component';
import * as moment from 'moment';
import * as _ from "lodash";
import { MatDialog } from '@angular/material/dialog';
import { AddGroundComponent } from '../add-ground/add-ground.component';
import { ViewStudentDataComponent } from '../view-student-data/view-student-data.component';
import { ViewStudentAttendanceRangeComponent } from '../view-student-attendance-range/view-student-attendance-range.component';

@Component({
  selector: 'app-my-teams',
  templateUrl: './my-teams.component.html',
  styleUrls: ['./my-teams.component.scss']
})
export class MyTeamsComponent implements OnInit {

  constructor(private router: Router, private loaderService: LoaderService, public dialog: MatDialog,  private kalamService: KalamService) {
    this.coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
    this.owner = this.kalamService.getCoachData().academyId ? false : true;
    this.kalamService.getStudentDetails(this.coachId).subscribe((res: any) => {
      let data = res.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      this.allStudents =  data;
      this.underList();
    });
    this.kalamService.getGroundDetails(this.coachId).subscribe((res: any) => {
      let data = res.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
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

  get groundNameNotAll(): boolean {
    return this.groundName !== 'all' && this.groundName !== ''
  }

  getStudentAttendance() {
    this.kalamService.getAllStudentAttendanceData(this.coachId, this.ageConvert(this.ageType), this.groundName).subscribe((stud:any) => {
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

  getStudentList(all: boolean) {
    const coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
    if(!all){
      this.loaderService.show();
      this.kalamService.studentList({coachId: coachId, underAge: this.ageType, groundName: this.groundName}).subscribe((res: any) => {
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
    }else {
      let data = this.allStudents.filter((res: StudentDetails) => res.groundName == this.groundName);
      this.studentList = data.sort((a:StudentDetails,b:StudentDetails) => a.playingPostion > b.playingPostion ? 1 : -1);
      this.checkAttendance();
    }
  }

  getStudentListUnderAge() {
    this.loaderService.show();
    const coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
    let idArr:string[] = [];
    this.kalamService.studentListUnderAge({coachId: coachId, underAge: this.ageType}).subscribe((res: any) => {
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

      /* Upate kalam id for all exisiting students
      // data.forEach((d: any) => {
        
      //   if(idArr.filter((v) => v == `${d['name']+d['aadharNum']+d['dob']}`).length == 0){
      //     let ddT = new Date().getTime().toString();
      //     d['kalamId'] = d.aadharNum.substring(0,3)+ddT.substring(ddT.length -3)+d['dob'].substring(0,5).replace("/","");
      //     console.log(d);
      //     this.kalamService.editStudentDetails(d);
      //     idArr.push(d['name']+d['aadharNum']+d['dob'])
      //   }
      // })

      */

      /* to check any duplicate id exist or not
      // var lookup = data.reduce((a:any, e:any) => {
      //   a[e.kalamId] = ++a[e.kalamId] || 0;
      //   return a;
      // }, {});
      
      // console.log(data.filter((e:any) => lookup[e.kalamId]));

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
      this.kalamService.getStudentAttendanceData(coachId, moment().format("MM-DD-YYYY")).subscribe((stud:any) => {
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
    if(this.ageType == 'all' && this.groundName == 'all'){
      return
    }
    if(this.ageType == 'all' && this.groundName) {
      this.getStudentList(true);
      return;
    }
    if(this.ageType && this.groundName) {
      if(this.groundName == "all") {
        this.getStudentListUnderAge();
        //this.getStudentAttendance();
      }else{
        this.getStudentList(false);
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
    return SportsList.filter(res => res.value == value)[0].label;
  }

  getUnderAgeLabel(value: string) {
    return UnderAge.filter(res => res.value == value)[0].label;
  }

  in(student: StudentDetails, eve?: boolean) {
    let stopLoop = false;
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
      this.kalamService.getStudentAttendanceUpdate(query).subscribe((stud:any) => {
        let stundentData = stud.map((document: any) => {
          return {
            id: document.payload.doc.id,
            ...document.payload.doc.data() as {}
          }
        })
        if(!stopLoop) {
          this.kalamService.editStudentAttendance(studentAttendance,stundentData[0].id);
          stopLoop = true;
          student["disableOutBtn"] = false;
        }
        
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
    let stopLoop = false;
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
        this.kalamService.getStudentAttendanceUpdateEvening(query).subscribe((stud:any) => {
          let stundentData = stud.map((document: any) => {
            return {
              id: document.payload.doc.id,
              ...document.payload.doc.data() as {}
            }
          })
          if(!stopLoop) {
            this.kalamService.deleteStudentAttendance(stundentData[0].id);
            student["disableEveBtn"] = false;
            stopLoop = true;
          }
         
        }) 
      }else {
        let query = {
          name: student.name,
          kalamId: student.kalamId,
          loginDate: moment().format("MM-DD-YYYY"),
          coachId: this.kalamService.getCoachData().kalamId
        }
        this.kalamService.getStudentAttendanceUpdate(query).subscribe((stud:any) => {
          let stundentData = stud.map((document: any) => {
            return {
              id: document.payload.doc.id,
              ...document.payload.doc.data() as {}
            }
          })
          if(!stopLoop) {
            this.kalamService.editStudentAttendance(studentAttendance,stundentData[0].id);
            student["disableInBtn"] = false;
            stopLoop = true;
          }
          
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
}
