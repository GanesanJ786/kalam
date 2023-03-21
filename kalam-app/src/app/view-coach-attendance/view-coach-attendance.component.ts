import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { KalamService } from '../kalam.service';

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

  constructor(private router: Router, private kalamService: KalamService) { 
    this.coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
    this.kalamService.getCoachAttendanceData(this.coachId).subscribe((coach: any) => {
      let coachData = coach.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      this.allCoachList = coachData;
      this.coachList = coachData.reduce((unique:any, o:any) => {
          if(!unique.some((obj:any) => obj.inCoachId === o.inCoachId)) {
            unique.push(o);
          }
          return unique;
      },[]);
    })
  }

  
  ngOnInit(): void {

  }

  gotoHome() {
    this.router.navigate([`/home`]);
  }
  coachSelection() {
    let coachInfo = this.allCoachList.filter((res:any) => res.inCoachId == this.coachVal);
    // this.coachView =  _.sortBy(this.coachView, ["groundName", "status"]);
    let sortCoach = _.sortBy(coachInfo, ["loginDate", "loginTime","groundName"]);
    let inCoach = sortCoach.filter((v:any) => v.status == "IN");
    let outCoach = sortCoach.filter((v:any) => v.status == "OUT");
    outCoach = _.sortBy(outCoach, ["logoffDate", "logoffTime","groundName"]);
    // sortCoach.forEach((e:any) => {
    //   outCoach.forEach((o:any) => {
    //     if(e.status == "IN" && o.status == "OUT" && (e.loginDate == o.logoffDate)) {
    //       e.logOffDataTime = `${o.logoffDate} ${o.logoffTime}`
    //     }
    //   })
    // })
    inCoach.forEach((inC:any,i:any) => {
      if(inC.groundName ==  outCoach[i]?.groundName && inC.loginDate ==  outCoach[i]?.logoffDate) {
        inC.logOffDataTime = `${outCoach[i].logoffDate} ${outCoach[i].logoffTime}`
      }else {
        inC.logOffDataTime = "-"
      }
    })
    this.coachView = inCoach;
    console.log(this.coachView)
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

}
