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
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { KalamService } from '../kalam.service';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
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

  async logout() {
    await this.kalamService.logoutAndClearSession();
    window.location.replace('/login');
  }

   editProfile() {
    this.router.navigate([`/sign-up`],{ queryParams: { source: 'edit' }});
   }

}
