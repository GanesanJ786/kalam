import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KalamService } from '../kalam.service';
import { LoaderService } from '../loader.service';
import { StudentDetails } from '../student-form/student-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import * as _ from 'lodash';

interface AttendanceEntry {
  student: StudentDetails;
  status: 'IN' | 'OUT';
  alreadySaved: boolean;
  existingDocId?: string;
}

@Component({
  selector: 'app-quick-attendance',
  standalone: false,
  templateUrl: './quick-attendance.component.html',
  styleUrl: './quick-attendance.component.scss'
})
export class QuickAttendanceComponent implements OnInit {

  groundList: any[] = [];
  selectedGround: string = '';
  coachId: string | undefined;
  todayDate: string = '';
  todayDisplay: string = '';
  attendanceList: AttendanceEntry[] = [];
  loading: boolean = false;
  saving: boolean = false;
  allStudents: StudentDetails[] = [];
  searchText: string = '';

  constructor(
    private kalamService: KalamService,
    private loaderService: LoaderService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.coachId = this.kalamService.getCoachData().academyId
      ? this.kalamService.getCoachData().academyId?.replace('A', '')
      : this.kalamService.getCoachData().kalamId;
    this.todayDate = moment().format('MM-DD-YYYY');
    this.todayDisplay = moment().format('dddd, DD MMM YYYY');
  }

  ngOnInit(): void {
    this.kalamService.getGroundDetails(this.coachId).subscribe((res: any) => {
      this.groundList = res.map((document: any) => ({
        id: document.payload.doc.id,
        ...document.payload.doc.data() as {}
      }));
    });
  }

  onGroundChange(): void {
    if (!this.selectedGround) return;
    this.loading = true;
    this.attendanceList = [];
    this.searchText = '';

    // Get all approved students for this ground
    this.kalamService.getAllApprovedStudent(this.coachId).subscribe((res: any) => {
      const students: StudentDetails[] = res.map((document: any) => ({
        id: document.payload.doc.id,
        ...document.payload.doc.data() as {}
      }));

      // Filter by selected ground
      this.allStudents = students
        .filter(s => s.groundName === this.selectedGround)
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''));

      // Build attendance list defaulting to IN (present)
      this.attendanceList = this.allStudents.map(student => ({
        student,
        status: 'IN',
        alreadySaved: false
      }));

      // Check existing attendance for today
      this.kalamService.getStudentAttendanceData(this.coachId!, this.todayDate).subscribe((stud: any) => {
        const todayRecords = stud.map((document: any) => ({
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }));

        // Mark students who already have attendance today
        this.attendanceList.forEach(entry => {
          const existing = todayRecords.find((r: any) =>
            r.kalamId === entry.student.kalamId &&
            r.name === entry.student.name &&
            r.groundName === this.selectedGround
          );
          if (existing) {
            entry.status = existing.status === 'OUT' ? 'OUT' : 'IN';
            entry.alreadySaved = true;
            entry.existingDocId = existing.id;
          }
        });

        this.loading = false;
      });
    });
  }

  get filteredList(): AttendanceEntry[] {
    if (!this.searchText.trim()) return this.attendanceList;
    const q = this.searchText.toLowerCase().trim();
    return this.attendanceList.filter(e =>
      e.student.name?.toLowerCase().includes(q) ||
      e.student.kalamId?.toLowerCase().includes(q)
    );
  }

  get presentCount(): number {
    return this.attendanceList.filter(e => e.status === 'IN').length;
  }

  get absentCount(): number {
    return this.attendanceList.filter(e => e.status === 'OUT').length;
  }

  get totalCount(): number {
    return this.attendanceList.length;
  }

  get unsavedCount(): number {
    return this.attendanceList.filter(e => !e.alreadySaved).length;
  }

  toggleStatus(entry: AttendanceEntry): void {
    entry.status = entry.status === 'IN' ? 'OUT' : 'IN';
    entry.alreadySaved = false; // Mark as needing save
  }

  markAllPresent(): void {
    this.attendanceList.forEach(entry => {
      if (entry.status !== 'IN') {
        entry.status = 'IN';
        entry.alreadySaved = false;
      }
    });
  }

  markAllAbsent(): void {
    this.attendanceList.forEach(entry => {
      if (entry.status !== 'OUT') {
        entry.status = 'OUT';
        entry.alreadySaved = false;
      }
    });
  }

  saveAttendance(): void {
    if (this.saving) return;
    this.saving = true;

    const coachKalamId = this.kalamService.getCoachData().kalamId;
    const ageConvert = (val: string) => {
      if (val === 'open') return 'Open';
      return 'Under-' + val.split('-')[1];
    };

    let pending = 0;
    let completed = 0;

    this.attendanceList.forEach(entry => {
      if (entry.alreadySaved) return; // Skip unchanged entries

      pending++;
      const attendanceData: any = {
        kalamId: entry.student.kalamId,
        name: entry.student.name,
        academyId: this.coachId,
        coachId: coachKalamId,
        groundName: this.selectedGround,
        loginTime: moment().format('HH:mm:ss'),
        loginDate: this.todayDate,
        ageType: ageConvert(entry.student.underAge || ''),
        sessionType: moment().format('a'),
        status: entry.status
      };

      if (entry.existingDocId) {
        // Update existing record
        this.kalamService.editStudentAttendance(attendanceData, entry.existingDocId);
        entry.alreadySaved = true;
        completed++;
        if (completed === pending) this.onSaveComplete(pending);
      } else {
        // Create new record
        this.kalamService.studentAttendance(attendanceData);
        entry.alreadySaved = true;
        completed++;
        if (completed === pending) this.onSaveComplete(pending);
      }
    });

    if (pending === 0) {
      this.saving = false;
      this._snackBar.open('All attendance already saved!', '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
      });
    }
  }

  private onSaveComplete(count: number): void {
    this.saving = false;
    this._snackBar.open(`Attendance saved for ${count} student${count > 1 ? 's' : ''}!`, '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }

  getInitials(name: string): string {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  }
}
