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
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource as MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { LoaderService } from '../loader.service';
import { MatDialog } from '@angular/material/dialog';
import { KalamService } from '../kalam.service';
import * as moment from 'moment';
import { StudentDetails } from '../student-form/student-form.component';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-student-analytics',
    templateUrl: './student-analytics.component.html',
    styleUrls: ['./student-analytics.component.scss'],
    standalone: false
})
export class StudentAnalyticsComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  coachId: string | undefined;
  owner: boolean = true;
  allStudents: any;
  selectedYear: number = 0;
  finalStudentList: any = [];
  filteredStudentList: any = [];
  listOfYears: number[] = [];
  displayedColumns: string[] = ['name', 'gender', 'ground'];

  // Sorting & Filtering
  sortBy: string = 'name';
  sortDirection: string = 'asc';
  filterGender: string = 'all';
  filterGround: string = 'all';
  uniqueGrounds: string[] = [];

  dataSource = new MatTableDataSource();
    
  
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  constructor(private router: Router, private loaderService: LoaderService, public dialog: MatDialog,  private kalamService: KalamService) { 
    this.coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A", "") : this.kalamService.getCoachData().kalamId;
    this.owner = this.kalamService.getCoachData().academyId ? false : true;
    this.kalamService.getAllApprovedStudentCached(this.coachId).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
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

    this.finalStudentList = finalData;

    // Extract unique grounds
    this.uniqueGrounds = [...new Set(finalData.map((s: any) => s.groundName).filter(Boolean))] as string[];
    this.uniqueGrounds.sort((a, b) => a.localeCompare(b));

    // Reset filters
    this.filterGender = 'all';
    this.filterGround = 'all';
    this.sortBy = 'name';
    this.sortDirection = 'asc';

    this.applyFiltersAndSort();

    this.dataSource.data = this.filteredStudentList;
    setTimeout(() => {
      this.dataSource.sort = this.sort; 
    });
  }

  applyFiltersAndSort() {
    let list = [...this.finalStudentList];

    // Filter by gender
    if (this.filterGender !== 'all') {
      list = list.filter((s: any) => s.gender === this.filterGender);
    }

    // Filter by ground
    if (this.filterGround !== 'all') {
      list = list.filter((s: any) => s.groundName === this.filterGround);
    }

    // Sort
    list = this.sortList(list);

    this.filteredStudentList = list;
  }

  sortList(list: any[]): any[] {
    const dir = this.sortDirection === 'asc' ? 1 : -1;
    return list.sort((a: any, b: any) => {
      let valA: any, valB: any;
      switch (this.sortBy) {
        case 'name':
          valA = (a.name || '').toLowerCase();
          valB = (b.name || '').toLowerCase();
          return valA.localeCompare(valB) * dir;
        case 'gender':
          valA = (a.gender || '').toLowerCase();
          valB = (b.gender || '').toLowerCase();
          return valA.localeCompare(valB) * dir;
        case 'ground':
          valA = (a.groundName || '').toLowerCase();
          valB = (b.groundName || '').toLowerCase();
          return valA.localeCompare(valB) * dir;
        case 'dob':
          valA = a.dob ? new Date(a.dob).getTime() : 0;
          valB = b.dob ? new Date(b.dob).getTime() : 0;
          return (valA - valB) * dir;
        default:
          return 0;
      }
    });
  }

  onFilterOrSortChange() {
    this.applyFiltersAndSort();
  }

  toggleSortDirection() {
    this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    this.applyFiltersAndSort();
  }

  genderMapper(gender: string) {
    if(gender == 'male') {
      return "(M)";
    }else {
      return "(F)";
    }
  }

  getMaleCount(): number {
    return this.finalStudentList.filter((s: any) => s.gender === 'male').length;
  }

  getFemaleCount(): number {
    return this.finalStudentList.filter((s: any) => s.gender === 'female').length;
  }

  getFilteredMaleCount(): number {
    return this.filteredStudentList.filter((s: any) => s.gender === 'male').length;
  }

  getFilteredFemaleCount(): number {
    return this.filteredStudentList.filter((s: any) => s.gender === 'female').length;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
