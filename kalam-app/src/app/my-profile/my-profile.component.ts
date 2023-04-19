import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { KalamService } from 'src/app/kalam.service';
import { AddGroundComponent } from '../add-ground/add-ground.component';
import { RegistrationDetails } from '../sign-up/sign-up.component';
import * as moment from 'moment';
import { StudentDetails } from '../student-form/student-form.component';
import { AllStudentsByGroundComponent } from '../all-students-by-ground/all-students-by-ground.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  groundList: any = [];
  coachId: string | undefined;
  allBtnDisabled: boolean = false;
  owner: boolean = true;
  notApproved: any = [];
  newStudents: any = [];
  paidStudentList: any = [];
  academyName: string = "";
  logo: string = "";
  addressData: any;
  allStudents: StudentDetails[] = [];

  constructor(private router: Router, private kalamService: KalamService, public dialog: MatDialog) {
    this.groundList = [];
    this.academyName = this.kalamService.getCoachData().academyName;
    this.logo = this.kalamService.getCoachData().logoUrl;
    this.coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
    this.owner = this.kalamService.getCoachData().academyId ? false : true;

    if(!this.owner) {
      this.kalamService.getHeadCoache(this.coachId).subscribe((res: any) => {
        let data = res.map((document: any) => {
          return {
            id: document.payload.doc.id,
            ...document.payload.doc.data() as {}
          }
        });
        this.logo = data[0].logoUrl ? data[0].logoUrl : "";
      })
    }
    
    this.kalamService.getGroundDetails(this.coachId).subscribe((res: any) => {
      let data = res.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      this.groundList = data;
      if(this.kalamService.getCoachesAttendance.length == 0) {
        this.kalamService.getCoachAttendanceData(this.coachId).subscribe((coach: any) => {
          this.allBtnDisabled = false;
          let coachData = coach.map((document: any) => {
            return {
              id: document.payload.doc.id,
              ...document.payload.doc.data() as {}
            }
          });
          this.kalamService.getCoachesAttendance = coachData;
          this.groundList.forEach((element: any) => {
            element["coachAlreadyIn"] = coachData.filter((val:any) => val.groundName == element.groundName);
            element['disableInBtn'] = false;
            element['disableOutBtn'] = true;
            if(coachData.filter((val:any) => (val.groundName == element.groundName && moment().format("MM-DD-YYYY") == val.loginDate && val.inCoachId == this.coachDetails.kalamId && val.status == "IN")).length > 
            coachData.filter((val:any) => (val.groundName == element.groundName && moment().format("MM-DD-YYYY") == val.logoffDate && val.inCoachId == this.coachDetails.kalamId && val.status == "OUT")).length ) {
              this.allBtnDisabled = true;
              element['disableOutBtn'] = false;
            }
            //if(element["coachAlreadyIn"].find((c:any) => c.inCoachId == ))
          });
        })
      }
    })


   }

  coachDetails: RegistrationDetails = {} as RegistrationDetails;

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position: any) => {
        if (position) {
          console.log("Latitude: " + position.coords.latitude +
            "Longitude: " + position.coords.longitude);
            this.kalamService.getLocationAddress(position).subscribe((res:any) => {
              this.addressData = res.results[0];
              // this.vilage = addressData.components.village+', ';
              // this.address = addressData.components.state_district+" - "
              //+addressData.components.postcode;
              // console.log(addressData.formatted);
              // console.log(`${addressData.components.village}, ${addressData.components.state_district}`);
            })
        }
      },
      (error: any) => console.log(error));
    } else {
      alert("Geolocation is not supported by this browser.");
    }
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
    if(this.owner) {
      const query = {
        academyId: `A${this.kalamService.getCoachData().kalamId}`
      }
      this.kalamService.getAcademyCoaches(query).subscribe((coach:any) => {
        let obj = coach.map((document: any) => {
          return {
            id: document.payload.doc.id,
            ...document.payload.doc.data() as {}
          }
        });

        this.notApproved = obj.filter((res:any) => !res.approved);
        this.kalamService.setNewCoachesList(this.notApproved);
        //this.router.navigate([`/new-coaches`]);
      });

      this.kalamService.newStudentList({coachId: this.coachId}).subscribe((res: any) => {
        let obj = res.map((document: any) => {
          return {
            id: document.payload.doc.id,
            ...document.payload.doc.data() as {}
          }
        });

        this.newStudents = obj;
        this.kalamService.setNewStudentsList(this.newStudents);
      });

      this.kalamService.feesApprove({coachId: this.coachId}).subscribe((res: any) => {
        let obj = res.map((document: any) => {
          return {
            id: document.payload.doc.id,
            ...document.payload.doc.data() as {}
          }
        });

        this.paidStudentList = obj;
        this.kalamService.paidStudentList = this.paidStudentList ;
      });

      this.kalamService.getStudentDetails(this.coachId).subscribe((res: any) => {
        let data = res.map((document: any) => {
          return {
            id: document.payload.doc.id,
            ...document.payload.doc.data() as {}
          }
        });
        this.allStudents = data.filter((res: StudentDetails) => res.approved);
        this.groundList.forEach((element: any) => {
          element.totalStudent = this.allStudents.filter((res:any) => res.groundName == element.groundName).length;
        })
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

  in(ground: any){
    this.getLocation();
    const dialogRef = this.dialog.open(AddGroundComponent, {
      disableClose: true,
      data: {groundName: "", groundAddress: "", dialogType: "Topics"},
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      //console.log(result);
      const attendance = {
        groundName: ground.groundName,
        academyId: this.coachId,
        inCoachId: this.kalamService.getCoachData().kalamId,
        coachName: this.kalamService.getCoachData().name,
        loginTime: moment().format("HH:mm:ss"),
        loginDate: moment().format("MM-DD-YYYY"),
        topics: result.data.topics,
        loginAddress: this.addressData?.formatted,
        status: "IN"
      }
      this.kalamService.coachAttendance(attendance);
    });

    
  }

  out(ground: any){
    this.getLocation();
    const dialogRef = this.dialog.open(AddGroundComponent, {
      disableClose: true,
      data: {groundName: "", groundAddress: "", dialogType: "Notes"},
    });

    dialogRef.afterClosed().subscribe(result => {
      //console.log('The dialog was closed');
      //console.log(result);
      const attendance = {
        groundName: ground.groundName,
        academyId: this.coachId,
        inCoachId: this.kalamService.getCoachData().kalamId,
        coachName: this.kalamService.getCoachData().name,
        logoffTime: moment().format("HH:mm:ss"),
        logoffDate: moment().format("MM-DD-YYYY"),
        notes: result.data.notes,
        logoutAddress: this.addressData?.formatted,
        status: "OUT"
      }
      this.kalamService.coachAttendance(attendance);
    });
    
  }
  viewCoachData() {
    this.router.navigate([`/coachDetails`]);
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
}
