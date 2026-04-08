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
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { KalamService } from '../kalam.service';

@Component({
    selector: 'app-new-students',
    templateUrl: './new-students.component.html',
    styleUrls: ['./new-students.component.scss'],
    standalone: false
})
export class NewStudentsComponent implements OnInit, OnDestroy {

  students: any = [];
  title: string = "Student Approval Queue";
  private coachId: string;
  private destroy$ = new Subject<void>();

  constructor(private router: Router,private kalamService: KalamService) {
    this.coachId = this.kalamService.getHeadCoachId();
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  approve(student: any) {
    student.approved = true;
    this.kalamService.approvedStudent(student);
  }

  reject(student: any) {
    this.kalamService.deleteStudent(student);
  }

  gotoHome() {
    this.router.navigate([`/home`]);
  }

  loadStudents() {
    this.kalamService.newStudentList({coachId: this.coachId}).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.students = res.map((document: any) => ({
        id: document.payload.doc.id,
        ...document.payload.doc.data() as {}
      })).filter((s: any) => !s.inActive);
      this.kalamService.setNewStudentsList(this.students);
    });
  }

}
