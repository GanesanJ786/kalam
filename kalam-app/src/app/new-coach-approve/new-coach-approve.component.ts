import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KalamService } from '../kalam.service';

@Component({
  selector: 'app-new-coach-approve',
  templateUrl: './new-coach-approve.component.html',
  styleUrls: ['./new-coach-approve.component.scss']
})
export class NewCoachApproveComponent implements OnInit {

  coaches: any = [];

  constructor(private router: Router,private kalamService: KalamService) {
    
   }

  ngOnInit(): void {
    this.getCoachData();
  }

  approve(coach: any) {
    let obj = coach;
    coach.approved = true;
    this.kalamService.approvedCoach(coach);
    setTimeout(() => {
      this.getCoachData();
    }, 500);
  }

  reject(coach: any) {
    this.kalamService.deleteCoach(coach);
    setTimeout(() => {
      this.getCoachData();
    }, 500);
  }

  gotoHome() {
    this.router.navigate([`/home`]);
  }

  getCoachData() {
    this.coaches = this.kalamService.getNewCoachesList();
    if(this.coaches.length == 0) {
      this.gotoHome();
    }
  }

}
