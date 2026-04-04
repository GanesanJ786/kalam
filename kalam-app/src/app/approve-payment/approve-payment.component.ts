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
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { KalamService } from '../kalam.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-approve-payment',
    templateUrl: './approve-payment.component.html',
    styleUrls: ['./approve-payment.component.scss'],
    standalone: false
})
export class ApprovePaymentComponent implements OnInit, OnDestroy {

  students: any = [];
  title: string = "Paid student list";
  totalAmount: number = 0;
  approvingAll: boolean = false;
  private coachId: string = '';
  private destroy$ = new Subject<void>();

  constructor(private router: Router, private kalamService: KalamService) { }

  ngOnInit(): void {
    this.coachId = this.kalamService.getCoachData().academyId
      ? this.kalamService.getCoachData().academyId?.replace("A","")
      : this.kalamService.getCoachData().kalamId;
    this.loadPendingPayments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadPendingPayments() {
    this.kalamService.feesApprove({ coachId: this.coachId }).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.students = res.map((document: any) => ({
        id: document.payload.doc.id,
        ...document.payload.doc.data() as {}
      }));
      this.kalamService.paidStudentList = this.students;
      this.totalAmount = this.students.reduce((sum: number, s: any) => sum + (Number(s.feesAmount) || 0), 0);
    });
  }

  approve(student: any) {
    student._approving = true;
    student.feesApproveWaiting = false;
    student.feesMonthPaid = moment().startOf("month").format('MMMM');
    this.kalamService.approvedStudent(student);
  }

  approveAll() {
    if (!this.students?.length || this.approvingAll) return;
    this.approvingAll = true;
    const currentMonth = moment().startOf("month").format('MMMM');
    this.students.forEach((student: any) => {
      student._approving = true;
      student.feesApproveWaiting = false;
      student.feesMonthPaid = currentMonth;
      this.kalamService.approvedStudent(student);
    });
    setTimeout(() => {
      this.approvingAll = false;
    }, 1000);
  }

  gotoHome() {
    this.router.navigate([`/home`]);
  }

}
