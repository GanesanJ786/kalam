import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { KalamService } from '../kalam.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() title: string = "";

  loggedIn: boolean = false;

  constructor(private router: Router, private kalamService: KalamService) { }

  ngOnInit(): void {
    if(this.kalamService.getCoachData()) {
      this.loggedIn = true;
    }
  }

  logout() {
    // this.kalamService.setCoachData({} as RegistrationDetails);
     this.router.navigate([`/login`]);
     sessionStorage.removeItem("coachDetails");
   }

   editProfile() {
    this.router.navigate([`/sign-up`],{ queryParams: { source: 'edit' }});
   }

}
