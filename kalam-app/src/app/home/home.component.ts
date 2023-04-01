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
  title: string = 'Home';

  ngOnInit(): void {
    this.academyName = this.kalamService.getCoachData().academyName;
  }
  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }

  tabChanged(event: any) {
    if(event.index == 0) {
      this.title = "Home"
    }else if(event.index == 1) {
      this.title = "Teams" 
    }else if(event.index == 2) {
      this.title = "Analysis" 
    }
  }

}
