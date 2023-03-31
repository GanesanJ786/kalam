import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SportsList, UnderAge } from '../constant';
import { KalamService } from '../kalam.service';
import { LoaderService } from '../loader.service';
import { StudentDetails } from '../student-form/student-form.component';
import * as moment from 'moment';
import * as _ from "lodash";

@Component({
  selector: 'app-my-teams',
  templateUrl: './my-teams.component.html',
  styleUrls: ['./my-teams.component.scss']
})
export class MyTeamsComponent implements OnInit {

  constructor(private router: Router, private loaderService: LoaderService,  private kalamService: KalamService) {
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

    this.getStudentAttendance();
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
    this.kalamService.getAllStudentAttendanceData(this.coachId, this.ageConvert(this.ageType)).subscribe((stud:any) => {
      let stundentData = stud.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      this.allStudentAttendance =  _.sortBy(stundentData, ["ageType", "loginDate"]);
    })
  }

  getStudentList() {
    this.loaderService.show();
    const coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
    this.kalamService.studentList({coachId: coachId, underAge: this.ageType}).subscribe((res: any) => {
      this.loaderService.hide();
      let data = res.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      this.studentList = data.sort((a:StudentDetails,b:StudentDetails) => a.playingPostion > b.playingPostion ? 1 : -1);
      
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
            if(studList.status == "IN" && element.kalamId == studList.kalamId) {
              element['disableInBtn'] = true;
            }
            if(studList.status == "OUT" && element.kalamId == studList.kalamId) {
              element['disableOutBtn'] = true;
            }
            
          });
        });
      })
      
        
    });
  }

  underList() {
    this.underCategory = [];
    this.allStudents.forEach((element:any) => {
      let obj = {
        value: element.underAge,
        key: this.ageConvert(element.underAge),
        age: element.age
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
    this.getStudentList();
    this.getStudentAttendance();
  }

  getSportLabel(value: string) {
    return SportsList.filter(res => res.value == value)[0].label;
  }

  getUnderAgeLabel(value: string) {
    return UnderAge.filter(res => res.value == value)[0].label;
  }

  in(student: StudentDetails) {
    const studentAttendance = {
      kalamId: student.kalamId,
      name: student.name,
      academyId: this.coachId,
      coachId: this.kalamService.getCoachData().kalamId,
      groundName: this.groundName,
      loginTime: moment().format("HH:mm:ss"),
      loginDate: moment().format("MM-DD-YYYY"),
      ageType: this.ageConvert(this.ageType),
      status: "IN"
    }

    if(student["disableOutBtn"]) {
      const id = this.allStudentAttendance.find((res:any) => res.kalamId == student.kalamId).id;
      this.kalamService.editStudentAttendance(studentAttendance,id);
      student["disableOutBtn"] = false;
    }else {
      this.kalamService.studentAttendance(studentAttendance);
    }
    student["disableInBtn"] = true;
  }
  out(student: StudentDetails) {
    const studentAttendance = {
      kalamId: student.kalamId,
      name: student.name,
      academyId: this.coachId,
      coachId: this.kalamService.getCoachData().kalamId,
      groundName: this.groundName,
      loginTime: moment().format("HH:mm:ss"),
      loginDate: moment().format("MM-DD-YYYY"),
      ageType: this.ageConvert(this.ageType),
      status: "OUT"
    }
    if(student["disableInBtn"]) {
      const id = this.allStudentAttendance.find((res:any) => res.kalamId == student.kalamId).id;
      this.kalamService.editStudentAttendance(studentAttendance,id);
      student["disableInBtn"] = false;
    }else {
      this.kalamService.studentAttendance(studentAttendance);
    }
 
    student["disableOutBtn"] = true;
  }
  viewStudent() {
    this.studentListView = true;
    this.viewStudentAttendance = false;
  }
  viewAttendance() {
    this.studentListView = false;
    this.viewStudentAttendance = true;
  }
}
