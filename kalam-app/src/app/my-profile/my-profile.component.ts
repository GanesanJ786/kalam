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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { KalamService } from 'src/app/kalam.service';
import { getSportIcon, getSportLabel as getSportNameLabel } from '../constant';
import { AddGroundComponent } from '../add-ground/add-ground.component';
import { RegistrationDetails } from '../sign-up/sign-up.component';
import * as moment from 'moment';
import { StudentDetails } from '../student-form/student-form.component';
import { AllStudentsByGroundComponent } from '../all-students-by-ground/all-students-by-ground.component';
import { TaskService } from '../task.service';
import { firstValueFrom, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.scss'],
    standalone: false
})
export class MyProfileComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  groundList: any = [];
  coachId: string | undefined;
  allBtnDisabled: boolean = false;
  owner: boolean = true;
  notApproved: any = [];
  newStudents: any = [];
  paidStudentList: any = [];
  academyName: string = "";
  logo: string = "";
  academyJoinCode: string = "";
  addressData: any;
  allStudents: StudentDetails[] = [];
  inCoachId: string = "";
  pendingTaskCount: number = 0;
  coachSports: string[] = [];
  getSportIcon = getSportIcon;
  getSportNameLabel = getSportNameLabel;

  getGroundSportIcon(groundName: string): string {
    const students = this.allStudents.filter((s: any) => s.groundName === groundName && s.preferredSport);
    if (students.length > 0) {
      const sportCounts: Record<string, number> = {};
      students.forEach((s: any) => {
        const sport = (s.preferredSport || '').toLowerCase();
        sportCounts[sport] = (sportCounts[sport] || 0) + 1;
      });
      const topSport = Object.keys(sportCounts).sort((a, b) => sportCounts[b] - sportCounts[a])[0];
      return getSportIcon(topSport);
    }
    return this.coachSports?.length ? getSportIcon(this.coachSports[0]) : 'sports';
  }

  constructor(
    private router: Router,
    private kalamService: KalamService,
    public dialog: MatDialog,
    private taskService: TaskService,
    private snackBar: MatSnackBar
  ) {
    this.groundList = [];
    this.academyName = this.kalamService.getCoachData().academyName;
    this.logo = this.kalamService.getCoachData().logoUrl;
    this.academyJoinCode = this.kalamService.getCoachData().academyJoinCode || '';
    this.coachSports = this.kalamService.getCoachData().toCoach || [];
    this.coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
    this.owner = this.kalamService.getCoachData().academyId ? false : true;
    this.inCoachId = this.kalamService.getCoachData().kalamId;

    if(!this.owner) {
      this.kalamService.getHeadCoache(this.coachId).pipe(take(1)).subscribe((res: any) => {
        let data = res.map((document: any) => {
          return {
            id: document.payload.doc.id,
            ...document.payload.doc.data() as {}
          }
        });
        this.logo = data.length > 0 && data[0].logoUrl ? data[0].logoUrl : "";
      })
    }
    
    this.kalamService.getGroundDetailsCached(this.coachId).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.groundList = data;

      this.kalamService.getCurrentCoachIn(this.inCoachId, moment().format("MM-DD-YYYY")).pipe(takeUntil(this.destroy$)).subscribe((coach: any) => {
        this.allBtnDisabled = false;
        let coachDataIn = coach.map((document: any) => {
          return {
            id: document.payload.doc.id,
            ...document.payload.doc.data() as {}
          }
        });

        this.kalamService.getCurrentCoachOut(this.inCoachId, moment().format("MM-DD-YYYY")).pipe(takeUntil(this.destroy$)).subscribe((coach: any) => {
          this.allBtnDisabled = false;
          let coachDataOut = coach.map((document: any) => {
            return {
              id: document.payload.doc.id,
              ...document.payload.doc.data() as {}
            }
          });
          this.attendanceLoop(coachDataIn, coachDataOut);
        })

      })

    })
   }

  coachDetails: RegistrationDetails = {} as RegistrationDetails;

  getLocation(): Promise<any> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          if (position) {
            this.kalamService.getLocationAddress(position).subscribe((res: any) => {
              this.addressData = res.results[0];
              this.addressData._coords = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };
              resolve(this.addressData);
            }, (err: any) => {
              // Geocoding failed but we still have coords
              this.addressData = {
                formatted: `${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`,
                _coords: { lat: position.coords.latitude, lng: position.coords.longitude }
              };
              resolve(this.addressData);
            });
          }
        },
        (error: any) => {
          console.log(error);
          reject(error);
        });
      } else {
        reject('Geolocation is not supported by this browser.');
      }
    });
  }

  attendanceLoop(coachDataIn: any, coachDataOut: any) {
    this.groundList.forEach((element: any) => {
            //element["coachAlreadyIn"] = coachData.filter((val:any) => val.groundName == element.groundName);
            element['disableInBtn'] = false;
            element['disableOutBtn'] = true;
            if(coachDataIn.filter((val:any) => (val.groundName == element.groundName && val.status == "IN")).length > 
            coachDataOut.filter((val:any) => (val.groundName == element.groundName && val.status == "OUT")).length ) {
              this.allBtnDisabled = true;
              element['disableOutBtn'] = false;
            }
            //if(element["coachAlreadyIn"].find((c:any) => c.inCoachId == ))
          });
  }

  ngOnInit(): void {
   // console.log('retrievedObject: ', JSON.stringify(sessionStorage.getItem('coachDetails')));
    // let coachDetails: any = sessionStorage.getItem("coachDetails");
    // if (coachDetails) {
    //     let coachProfile = JSON.parse(coachDetails)
    //     console.log(coachProfile);
    // }

    //this.getLocation();
    this.coachDetails = this.kalamService.getCoachData();
    this.academyJoinCode = this.coachDetails?.academyJoinCode || '';
    this.ensureAcademyJoinCodeForOwner();
    this.loadPendingTaskCount();
    if(this.owner) {
      const query = {
        academyId: `A${this.kalamService.getCoachData().kalamId}`
      }
      this.kalamService.getAcademyCoachesCached(query).pipe(takeUntil(this.destroy$)).subscribe((obj:any) => {
        this.notApproved = obj.filter((res:any) => !res.approved);
        this.kalamService.setNewCoachesList(this.notApproved);
        //this.router.navigate([`/new-coaches`]);
      });

      this.kalamService.newStudentList({coachId: this.coachId}).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        let obj = res.map((document: any) => {
          return {
            id: document.payload.doc.id,
            ...document.payload.doc.data() as {}
          }
        });

        this.newStudents = obj.filter((s:any) => !s.inActive);
        this.kalamService.setNewStudentsList(this.newStudents);
      });

      this.kalamService.feesApprove({coachId: this.coachId}).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        let obj = res.map((document: any) => {
          return {
            id: document.payload.doc.id,
            ...document.payload.doc.data() as {}
          }
        });

        this.paidStudentList = obj;
        this.kalamService.paidStudentList = this.paidStudentList ;
      });

      this.kalamService.getStudentDetailsCached(this.coachId).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
        this.allStudents = data.filter((res: StudentDetails) => res.approved);
        this.groundList.forEach((element: any) => {
          element.totalStudent = this.allStudents.filter((res:any) => res.groundName == element.groundName).length;
        })
      });
    }
  }

  private loadPendingTaskCount(): void {
    if (!this.owner) {
      // Sub coach: count active tasks (Pending + Acknowledged) assigned to them
      this.taskService.getActiveTasks(this.inCoachId).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        const allTasks = res.map((document: any) => ({
          ...document.payload.doc.data() as {}
        }));
        this.pendingTaskCount = allTasks.filter((t: any) => t.status !== 'Completed').length;
      });
    } else {
      // Head coach: count pending tasks they assigned
      const academyId = `A${this.kalamService.getCoachData().kalamId}`;
      this.taskService.getTasksByHeadCoach(academyId).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
        const tasks = res.map((document: any) => ({
          ...document.payload.doc.data() as {}
        }));
        this.pendingTaskCount = tasks.filter((t: any) => t.status === 'Pending').length;
      });
    }
  }

  private async ensureAcademyJoinCodeForOwner(): Promise<void> {
    if (!this.owner || this.academyJoinCode) {
      return;
    }

    if (!this.coachDetails?.id) {
      return;
    }

    const generatedCode = await this.generateUniqueAcademyJoinCode(this.coachDetails.academyName);
    this.coachDetails.academyJoinCode = generatedCode;
    this.academyJoinCode = generatedCode;
    this.kalamService.editCoachDetails(this.coachDetails);
    this.kalamService.cacheCoachData(this.coachDetails);
  }

  private async generateUniqueAcademyJoinCode(academyName: string): Promise<string> {
    const prefix = (academyName || 'KALAM')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 4)
      .padEnd(4, 'X');

    while (true) {
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      const code = `${prefix}-${randomPart}`;
      const res: any = await firstValueFrom(this.kalamService.getAcademyByJoiningCode(code));
      if (!res.length) {
        return code;
      }
    }
  }

  async copyJoinCode(): Promise<void> {
    if (!this.academyJoinCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(this.academyJoinCode);
      this.snackBar.open('Academy joining code copied.', '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
      });
    } catch {
      this.snackBar.open(`Join code: ${this.academyJoinCode}`, '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 4000,
      });
    }
  }

  editProfile() {
    
  }
  
  approval() {
    this.router.navigate([`/new-coaches`]);
  }

  studentApproval() {
    this.router.navigate([`/new-students`]);
  }

  feesApproval() {
    this.router.navigate([`/fees-approval`]);
  }

  addGround() {
    const dialogRef = this.dialog.open(AddGroundComponent, {
      data: {groundName: "", groundAddress: "", dialogType: "Ground"},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  applyLeave() {
    const dialogRef = this.dialog.open(AddGroundComponent, {
      data: {dialogType: "Leave"},
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed');
      // console.log(result);
      const attendance = {
        groundName: "",
        academyId: this.coachId,
        inCoachId: this.kalamService.getCoachData().kalamId,
        coachName: this.kalamService.getCoachData().name,
        activeDate: moment(result.data.dateOfLeave).format("MM-DD-YYYY"),
        loginTime: "",
        loginDate: moment(result.data.dateOfLeave).format("MM-DD-YYYY"),
        notes: result.data.reasonOfLeave,
        loginAddress: "",
        appliedLeave: true,
        status: "LEAVE"
      }
      this.kalamService.coachAttendance(attendance);
    });
  }

  async checkIn(ground: any){
    try {
      await this.getLocation();
    } catch(e) {}
    const dialogRef = this.dialog.open(AddGroundComponent, {
      disableClose: true,
      data: {groundName: "", groundAddress: "", dialogType: "Topics"},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      const attendance: any = {
        groundName: ground.groundName,
        academyId: this.coachId,
        inCoachId: this.kalamService.getCoachData().kalamId,
        coachName: this.kalamService.getCoachData().name,
        activeDate: moment().format("MM-DD-YYYY"),
        loginTime: moment().format("HH:mm:ss"),
        loginDate: moment().format("MM-DD-YYYY"),
        topics: result.data.topics,
        loginAddress: this.addressData?.formatted,
        status: "IN"
      }
      if (this.addressData?._coords) {
        attendance.loginCoords = this.addressData._coords;
      }
      this.kalamService.coachAttendance(attendance);
    });

    
  }

  async out(ground: any){
    try {
      await this.getLocation();
    } catch(e) {}
    const dialogRef = this.dialog.open(AddGroundComponent, {
      disableClose: true,
      data: {groundName: "", groundAddress: "", dialogType: "Notes"},
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      const attendance: any = {
        groundName: ground.groundName,
        academyId: this.coachId,
        inCoachId: this.kalamService.getCoachData().kalamId,
        coachName: this.kalamService.getCoachData().name,
        activeDate: moment().format("MM-DD-YYYY"),
        logoffTime: moment().format("HH:mm:ss"),
        logoffDate: moment().format("MM-DD-YYYY"),
        notes: result.data.notes,
        logoutAddress: this.addressData?.formatted,
        status: "OUT"
      }
      if (this.addressData?._coords) {
        attendance.logoutCoords = this.addressData._coords;
      }
      this.kalamService.coachAttendance(attendance);
    });
    
  }
  viewCoachData() {
    this.router.navigate([`/coachDetails`]);
  }

  getActiveGround(): any {
    return this.groundList.find((g: any) => !g.disableOutBtn) || null;
  }

  viewAllStudents(groundName: string) {
    let allStudentsGroundBy = this.allStudents.filter((res: StudentDetails) => res.groundName == groundName);
    const dialogRef = this.dialog.open(AllStudentsByGroundComponent, {
      maxWidth: '100vw',
      maxHeight: '100vh',
      height: '100%',
      width: '100%',
      panelClass: 'full-screen-modal',
      data: allStudentsGroundBy
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      //console.log(result);
      
    });
  }

  quickAttendance() {
    this.router.navigate(['/quick-attendance']);
  }

  coachTasks() {
    this.router.navigate(['/coach-tasks']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
