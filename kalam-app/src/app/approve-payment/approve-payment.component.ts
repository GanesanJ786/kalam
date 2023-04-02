import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KalamService } from '../kalam.service';
import * as moment from 'moment';

@Component({
  selector: 'app-approve-payment',
  templateUrl: './approve-payment.component.html',
  styleUrls: ['./approve-payment.component.scss']
})
export class ApprovePaymentComponent implements OnInit {

  students: any = [];
  title: string = "Paid student list";

  constructor(private router: Router,private kalamService: KalamService) { }

  ngOnInit(): void {
    this.getStudentData();
  }

  approve(student: any) {
    student.feesApproveWaiting = false;
    student.feesMonthPaid = moment().startOf("month").format('MMMM');
    this.kalamService.approvedStudent(student);
    setTimeout(() => {
      this.getStudentData();
    }, 500);
  }


  gotoHome() {
    this.router.navigate([`/home`]);
  }

  getStudentData() {
    this.students = this.kalamService.paidStudentList;
    if(this.students.length == 0) {
      this.gotoHome();
    }
  }

}
