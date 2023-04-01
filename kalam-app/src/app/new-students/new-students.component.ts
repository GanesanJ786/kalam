import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KalamService } from '../kalam.service';

@Component({
  selector: 'app-new-students',
  templateUrl: './new-students.component.html',
  styleUrls: ['./new-students.component.scss']
})
export class NewStudentsComponent implements OnInit {

  students: any = [];
  title: string = "New Students yet to be approved";

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
    if(this.students.length == 0) {
      this.gotoHome();
    }
  }

}
