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
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KalamService } from '../kalam.service';

@Component({
    selector: 'app-new-students',
    templateUrl: './new-students.component.html',
    styleUrls: ['./new-students.component.scss'],
    standalone: false
})
export class NewStudentsComponent implements OnInit {

  students: any = [];
  title: string = "Student Approval Queue";

  constructor(private router: Router,private kalamService: KalamService) { }

  ngOnInit(): void {
    this.getStudentData();
  }

  approve(student: any) {
    student.approved = true;
    this.kalamService.approvedStudent(student);
    setTimeout(() => {
      this.getStudentData();
    }, 500);
  }

  reject(student: any) {
    this.kalamService.deleteStudent(student);
    setTimeout(() => {
      this.getStudentData();
    }, 500);
  }

  gotoHome() {
    this.router.navigate([`/home`]);
  }

  getStudentData() {
    this.students = this.kalamService.getNewStudentsList();
  }

}
