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
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LoaderService } from '../loader.service';
import { MatDialog } from '@angular/material/dialog';
import { KalamService } from '../kalam.service';
import { Router } from '@angular/router';
import { StudentDetails } from '../student-form/student-form.component';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';



@Component({
    selector: 'app-studentscholarship',
    templateUrl: './studentscholarship.component.html',
    styleUrls: ['./studentscholarship.component.scss'],
    standalone: false
})
export class StudentscholarshipComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  groundList: any = [];
  coachId: string | undefined;
  owner: boolean = true;
  allStudents: any;
  underCategory: any = [];
  groundName: string = '';
  ageType: string = '';
  scholarshipType: string = '';
  finalStudentList: any = [];
  isScholarship: boolean = false;
  displayedColumns: string[] = [];

  dataSource = new MatTableDataSource();
  

  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  constructor(private router: Router, private loaderService: LoaderService, public dialog: MatDialog,  private kalamService: KalamService) { 
   
    this.coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
    this.owner = this.kalamService.getCoachData().academyId ? false : true;
    this.kalamService.getAllApprovedStudentCached(this.coachId).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.allStudents = [...data];
      let currentMonth = moment().startOf("month").format('MMMM');


      this.kalamService.getAllInactiveStudents(this.coachId).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        let inActive = res.map((document: any) => {
          return {
            id: document.payload.doc.id,
            ...document.payload.doc.data() as {}
          }
        });

        inActive.forEach((student: any) => {
          if(this.allStudents.filter((s:any) => s.id == student.id).length == 0) {
            this.allStudents.push(student)
          }
        });
         
       
        this.allStudents.forEach((element:StudentDetails) => {
          // if(element.scholarship == undefined) {
          //   element.scholarship = "No"
          // }
          element.underType =  this.checkAge(element);
          if((element.feesMonthPaid !== currentMonth || element.feesMonthPaid == undefined) && !element.feesApproveWaiting) {
            element.payment =  "Not Paid";
          }else {
            element.payment =  "Paid"
          } 
        });  
        this.underList();
      });
    });
    this.kalamService.getGroundDetailsCached(this.coachId).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.groundList = data;
    });
  }

  ngAfterViewInit() {
    //this.dataSource.paginator = this.paginator;
    //this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }

  underList() {
    this.underCategory = [];
    this.allStudents.forEach((element:any) => {
      let obj = {
        value: element.underAge,
        key: this.ageConvert(element.underAge),
        age: this.checkAge(element)
      }
      this.underCategory.push(obj);
    });
    this.underCategory = this.underCategory.reduce((unique:any, o:any) => {
        if(!unique.some((obj:any) => obj.key === o.key && obj.value === o.value)) {
          unique.push(o);
        }
        return unique;
    },[]);
    this.underCategory = this.underCategory.sort((a:any,b:any) => a.age > b.age ? 1 : -1);
  }

  checkAge(element: StudentDetails) {
    if(element.underAge !== "open") {
      return Number(element.underAge?.split("-")[1]);
    }else {
      return element.age;
    }
  }

  ageConvert(val: string) {
    if(val == "open") {
      return "Open"
    }else {
      return "Under-"+val.split("-")[1];
    }
  }

  search() {
    this.isScholarship = false;
    
    let finalData = this.allStudents;
    
    if(this.ageType !== 'all') {
      finalData = finalData.filter((res: StudentDetails) => res.underAge == this.ageType)
    }
    if(this.groundName !== 'all') {
      finalData = finalData.filter((res: StudentDetails) => res.groundName == this.groundName)
    }
    if(this.scholarshipType == 'yes') {
      this.displayedColumns = ['age', 'name', 'scholarship', 'inActive'];
      this.isScholarship = true;
      finalData = finalData.filter((res: StudentDetails) => res.scholarship);
      finalData = _.sortBy(finalData, ["underType", "scholarship"]);
    }
    if(this.scholarshipType == 'no') {
      this.displayedColumns = ['age', 'name', 'payment', 'inActive'];
      this.isScholarship = false;
      finalData = finalData.filter((res: StudentDetails) => !res.scholarship);
      finalData = _.sortBy(finalData, ["underType"]);
    }
   
    //console.log(finalData);
    this.finalStudentList = finalData;
    this.dataSource.data = this.finalStudentList;
    setTimeout(() => {
      console.log(this.sort) //not undefined
      this.dataSource.sort = this.sort; 
    })
  }

  selectAge(val: string) {
    this.ageType = val;
    this.trySearch();
  }

  selectGround(val: string) {
    this.groundName = val;
    this.trySearch();
  }

  selectScholarship(val: string) {
    this.scholarshipType = val;
    this.trySearch();
  }

  trySearch() {
    if (this.ageType && this.groundName && this.scholarshipType) {
      this.search();
    }
  }

  genderMapper(gender: string) {
    if(gender == 'male') {
      return "(M)";
    }else {
      return "(F)";
    }
  }

  getPaidCount(): number {
    return this.finalStudentList.filter((s: any) => s.payment === 'Paid').length;
  }

  getNotPaidCount(): number {
    return this.finalStudentList.filter((s: any) => s.payment !== 'Paid').length;
  }

  getActiveCount(): number {
    return this.finalStudentList.filter((s: any) => !s.inActive).length;
  }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
  }

  inActive(student: any) {
    if (confirm(`Are you sure to inactivate ${student.name}?`) == true) {
      student.approved = false;
      student.inActive = true;
      this.kalamService.approvedStudent(student);
      //console.log(student);
    }
  }

  activate(student: any) {
    if (confirm(`Are you sure to activate ${student.name}?`) == true) {
      student.approved = true;
      student.inActive = false;
      this.kalamService.approvedStudent(student);
      //console.log(student);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
