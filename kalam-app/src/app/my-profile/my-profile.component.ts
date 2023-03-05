import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KalamService } from 'src/app/kalam.service';
import { RegistrationDetails } from '../sign-up/sign-up.component';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {

  constructor(private router: Router, private kalamService: KalamService) { }

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
    this.kalamService.setCoachData({} as RegistrationDetails);
    this.router.navigate([`/login`]);
  }

}
