import { Component, OnInit } from '@angular/core';
import { KalamService } from '../kalam.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private kalamService: KalamService) { }
  tabLoadTimes: Date[] = [];
  tabIndex:number = 0;
  academyName: string = '';

  ngOnInit(): void {
    this.academyName = this.kalamService.getCoachData().academyName;
  }
  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }

}
