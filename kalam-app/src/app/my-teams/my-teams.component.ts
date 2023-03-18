import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SportsList, UnderAge } from '../constant';
import { KalamService } from '../kalam.service';
import { LoaderService } from '../loader.service';
import { StudentDetails } from '../student-form/student-form.component';
// import * as _ from "lodash";

@Component({
  selector: 'app-my-teams',
  templateUrl: './my-teams.component.html',
  styleUrls: ['./my-teams.component.scss']
})
export class MyTeamsComponent implements OnInit {

  constructor(private router: Router, private loaderService: LoaderService,  private kalamService: KalamService) {
    this.kalamService.getStudentDetails().subscribe((res: any) => {
      let data = res.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      this.allStudents =  data;
      this.underList();
    });
   
  }
  ageType: string = '';
  studentList: any;
  allStudents: any;
  underCategory: any = [];
  
  ngOnInit(): void {
    
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
    });
  }

  underList() {
    this.underCategory = [];
    this.allStudents.forEach((element:any) => {
      let obj = {
        value: element.underAge,
        key: this.ageConvert(element.underAge)
      }
      this.underCategory.push(obj);
    });
    this.underCategory = this.underCategory.reduce((unique:any, o:any) => {
        if(!unique.some((obj:any) => obj.key === o.key && obj.value === o.value)) {
          unique.push(o);
        }
        return unique;
    },[]);
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
  }

  getSportLabel(value: string) {
    return SportsList.filter(res => res.value == value)[0].label;
  }

  getUnderAgeLabel(value: string) {
    return UnderAge.filter(res => res.value == value)[0].label;
  }
}
