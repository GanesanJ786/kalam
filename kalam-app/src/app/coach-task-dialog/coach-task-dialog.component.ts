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
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-coach-task-dialog',
  standalone: false,
  templateUrl: './coach-task-dialog.component.html',
  styleUrl: './coach-task-dialog.component.scss'
})
export class CoachTaskDialogComponent {

  taskEntries: any[] = [];
  coachName: string = '';
  activeFilter: string = 'all'; // 'all' | 'Pending' | 'Completed' | 'Acknowledged'

  constructor(
    public dialogRef: MatDialogRef<CoachTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.taskEntries = data.taskEntries || [];
    this.coachName = data.coachName || '';
    // Sort by date descending (newest first)
    this.sortByDateDescending();
  }

  private sortByDateDescending(): void {
    this.taskEntries.sort((a: any, b: any) => {
      const dateA = this.parseDate(a.activeDate);
      const dateB = this.parseDate(b.activeDate);
      // Descending: newest first
      if (dateB.getTime() !== dateA.getTime()) {
        return dateB.getTime() - dateA.getTime();
      }
      // If same date, sort by time descending
      const timeA = a.loginTime || '00:00:00';
      const timeB = b.loginTime || '00:00:00';
      return timeB.localeCompare(timeA);
    });
  }

  private parseDate(dateStr: string): Date {
    if (!dateStr) return new Date(0);
    // Handle MM-DD-YYYY format
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return new Date(+parts[2], +parts[0] - 1, +parts[1]);
    }
    return new Date(dateStr);
  }

  get filteredTasks(): any[] {
    if (this.activeFilter === 'all') return this.taskEntries;
    return this.taskEntries.filter((t: any) => t.taskStatus === this.activeFilter);
  }

  get totalCount(): number {
    return this.taskEntries.length;
  }

  get pendingCount(): number {
    return this.taskEntries.filter((t: any) => t.taskStatus === 'Pending').length;
  }

  get completedCount(): number {
    return this.taskEntries.filter((t: any) => t.taskStatus === 'Completed').length;
  }

  setFilter(filter: string): void {
    this.activeFilter = filter;
  }

  getTaskStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'task-pending';
      case 'Acknowledged': return 'task-acknowledged';
      case 'Completed': return 'task-completed';
      default: return 'task-pending';
    }
  }

  getTaskStatusIcon(status: string): string {
    switch (status) {
      case 'Completed': return 'check_circle';
      case 'Acknowledged': return 'thumb_up';
      default: return 'pending';
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
