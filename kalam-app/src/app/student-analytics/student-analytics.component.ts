import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoaderService } from '../loader.service';
import { MatDialog } from '@angular/material/dialog';
import { KalamService } from '../kalam.service';
import * as moment from 'moment';
import { StudentDetails } from '../student-form/student-form.component';

@Component({
  selector: 'app-student-analytics',
  templateUrl: './student-analytics.component.html',
  styleUrls: ['./student-analytics.component.scss']
})
export class StudentAnalyticsComponent implements OnInit {

  coachId: string | undefined;
  owner: boolean = true;
  allStudents: any;
  selectedYear: number = 0;
  finalStudentList: any = [];
  listOfYears: number[] = [];
  displayedColumns: string[] = ['name', 'gender', 'ground'];

  dataSource = new MatTableDataSource();
    
  
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  constructor(private router: Router, private loaderService: LoaderService, public dialog: MatDialog,  private kalamService: KalamService) { 
    this.coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A", "") : this.kalamService.getCoachData().kalamId;
    this.owner = this.kalamService.getCoachData().academyId ? false : true;
    this.kalamService.getAllApprovedStudent(this.coachId).subscribe((res: any) => {
      let data = res.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      this.allStudents = data;
    });
  }

  ngOnInit(): void {
    const startYear = 2005;
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: currentYear - startYear + 1 }, (_, i) => startYear + i);
    this.listOfYears = years;
  }

  search() {
    let finalData = this.allStudents;

    finalData = finalData.filter((item: StudentDetails) => item.dob.includes(+this.selectedYear));

    //console.log(finalData);
    this.finalStudentList = finalData;
    this.dataSource.data = this.finalStudentList;
    setTimeout(() => {
      console.log(this.sort) //not undefined
      this.dataSource.sort = this.sort; 
    })
  }

  genderMapper(gender: string) {
    if(gender == 'male') {
      return "(M)";
    }else {
      return "(F)";
    }
  }

}
