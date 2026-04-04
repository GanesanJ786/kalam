import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import { KalamService } from '../kalam.service';
import { StudentDetails } from '../student-form/student-form.component';
import { AddGroundComponent } from '../add-ground/add-ground.component';

@Component({
  selector: 'app-collect-fees',
  standalone: false,
  templateUrl: './collect-fees.component.html',
  styleUrl: './collect-fees.component.scss'
})
export class CollectFeesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  allStudents: StudentDetails[] = [];
  filteredStudents: StudentDetails[] = [];
  unpaidStudents: StudentDetails[] = [];
  paidStudentsCount: number = 0;

  searchQuery: string = '';
  statusFilter: 'all' | 'paid' | 'unpaid' = 'unpaid';
  groundFilter: string = 'all';
  groundNames: string[] = [];

  owner: boolean = false;
  loading: boolean = true;

  constructor(
    private router: Router,
    private kalamService: KalamService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.owner = this.kalamService.isAcademyOwner();
    const coachData = this.kalamService.getCoachData();
    const coachId = coachData.academyId
      ? coachData.academyId.replace('A', '')
      : coachData.kalamId;

    this.kalamService.getStudentDetailsCached(coachId)
      .pipe(takeUntil(this.destroy$))
      .subscribe((data: any) => {
        this.allStudents = data.filter((s: any) => s.approved);
        this.classify();
        this.loading = false;
      });
  }

  classify() {
    const currentMonth = moment().startOf('month').format('MMMM');
    this.allStudents.forEach((s: any) => {
      if (s.scholarship === '100') {
        s._feesUnpaid = false;
      } else if ((s.feesMonthPaid !== currentMonth || s.feesMonthPaid == undefined) && !s.feesApproveWaiting) {
        s._feesUnpaid = true;
      } else {
        s._feesUnpaid = false;
      }
    });
    this.unpaidStudents = this.allStudents.filter((s: any) => s._feesUnpaid);
    this.paidStudentsCount = this.allStudents.length - this.unpaidStudents.length;
    const grounds = new Set(this.allStudents.map((s: any) => s.groundName).filter(Boolean));
    this.groundNames = Array.from(grounds).sort();
    this.filter();
  }

  setStatusFilter(f: 'all' | 'paid' | 'unpaid') {
    this.statusFilter = f;
    this.filter();
  }

  setGroundFilter(g: string) {
    this.groundFilter = g;
    this.filter();
  }

  filter() {
    let list = this.allStudents;
    if (this.statusFilter === 'unpaid') {
      list = list.filter((s: any) => s._feesUnpaid);
    } else if (this.statusFilter === 'paid') {
      list = list.filter((s: any) => !s._feesUnpaid);
    }
    if (this.groundFilter !== 'all') {
      list = list.filter((s: any) => s.groundName === this.groundFilter);
    }
    if (this.searchQuery?.trim()) {
      const q = this.searchQuery.trim().toLowerCase();
      list = list.filter((s: any) => s.name?.toLowerCase().includes(q));
    }
    this.filteredStudents = list;
  }

  collectFee(student: StudentDetails) {
    const dialogRef = this.dialog.open(AddGroundComponent, {
      disableClose: true,
      data: { dialogType: 'Payment' },
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result?.data?.amount) {
        student.feesAmount = result.data.amount;
        student.feesApproveWaiting = this.owner ? false : true;
        student.fessCollectedBy = this.kalamService.getCoachData().name;
        student.feesPaidDate = moment().format('MM-DD-YYYY');
        if (this.owner) {
          student.feesMonthPaid = moment().startOf('month').format('MMMM');
        }
        this.kalamService.editStudentDetails(student);
        this.classify();
      }
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
