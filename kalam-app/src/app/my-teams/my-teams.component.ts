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

  constructor(private router: Router, private loaderService: LoaderService,  private kalamService: KalamService) { }
  ageType: string = '';
  studentList: any;
  
  ngOnInit(): void {
    
  }

  getStudentList() {
    this.loaderService.show();
    this.kalamService.studentList({coachId: this.kalamService.getCoachData().kalamId, underAge: this.ageType}).subscribe((res: any) => {
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
