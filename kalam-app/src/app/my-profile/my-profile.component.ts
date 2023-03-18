import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { KalamService } from 'src/app/kalam.service';
import { AddGroundComponent } from '../add-ground/add-ground.component';
import { RegistrationDetails } from '../sign-up/sign-up.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  groundList: any = [];
  coachId: string | undefined;

  constructor(private router: Router, private kalamService: KalamService, public dialog: MatDialog) {
    this.groundList = [];
    this.coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
    this.kalamService.getGroundDetails(this.coachId).subscribe((res: any) => {
      let data = res.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      this.groundList = data;
    })
   }

  coachDetails: RegistrationDetails = {} as RegistrationDetails;

  ngOnInit(): void {
   // console.log('retrievedObject: ', JSON.stringify(sessionStorage.getItem('coachDetails')));
    // let coachDetails: any = sessionStorage.getItem("coachDetails");
    // if (coachDetails) {
    //     let coachProfile = JSON.parse(coachDetails)
    //     console.log(coachProfile);
    // }

    this.coachDetails = this.kalamService.getCoachData();
  }
  editProfile() {
    
  }
  logout() {
   // this.kalamService.setCoachData({} as RegistrationDetails);
    this.router.navigate([`/login`]);
    sessionStorage.removeItem("coachDetails");
  }

  addGround() {
    const dialogRef = this.dialog.open(AddGroundComponent, {
      data: {groundName: "", groundAddress: ""},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      console.log(result);
    });
  }

  in(ground: any){
    const attendance = {
      groundName: ground.groundName,
      academyId: this.coachId,
      inCoachId: this.kalamService.getCoachData().kalamId,

    }
  }

  out(ground: any){

  }
}
