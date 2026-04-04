import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { LeaderboardService, LeaderboardData, LeaderboardEntry } from '../leaderboard.service';

@Component({
  selector: 'app-landing-page',
  standalone: false,
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss']
})
export class LandingPageComponent implements OnInit {

  leaderboard: LeaderboardData | null = null;
  loading = true;
  activeTab: 'attendance' | 'performance' | 'academies' = 'attendance';

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit(): void {
    this.leaderboardService.getLeaderboard().pipe(take(1)).subscribe(data => {
      this.leaderboard = data;
      this.loading = false;
    });
  }

  get attendanceList(): LeaderboardEntry[] {
    return this.leaderboard?.topStudentsByAttendance || [];
  }

  get performerList(): LeaderboardEntry[] {
    return this.leaderboard?.topPerformers || [];
  }

  get academyList(): LeaderboardEntry[] {
    return this.leaderboard?.topAcademiesBySize || [];
  }
}
