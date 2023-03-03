import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-teams',
  templateUrl: './my-teams.component.html',
  styleUrls: ['./my-teams.component.scss']
})
export class MyTeamsComponent implements OnInit {

  constructor(private router: Router) { }
  ageType = undefined;

  
  ngOnInit(): void {
  }

  newStudent() {
    this.router.navigate([`/student-form`]);
  }
}
