import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

export interface LeaderboardEntry {
  name: string;
  academyId: string;
  count?: number;
  goals?: number;
  assists?: number;
  games?: number;
  studentCount?: number;
  academyName?: string;
  headCoach?: string;
}

export interface LeaderboardData {
  month: string;
  updatedAt: any;
  topStudentsByAttendance: LeaderboardEntry[];
  topPerformers: LeaderboardEntry[];
  topAcademiesBySize: LeaderboardEntry[];
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {

  private _cache: Map<string, Observable<LeaderboardData | null>> = new Map();

  constructor(private fireStore: AngularFirestore) {}

  getLeaderboard(month?: string): Observable<LeaderboardData | null> {
    const key = month || this.getCurrentMonth();
    if (!this._cache.has(key)) {
      const leaderboard$ = this.fireStore.collection('leaderboard').doc(key)
        .snapshotChanges().pipe(
          map(action => {
            if (!action.payload.exists) return null;
            return action.payload.data() as LeaderboardData;
          }),
          shareReplay({ bufferSize: 1, refCount: true })
        );
      this._cache.set(key, leaderboard$);
    }
    return this._cache.get(key)!;
  }

  private getCurrentMonth(): string {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  }
}
