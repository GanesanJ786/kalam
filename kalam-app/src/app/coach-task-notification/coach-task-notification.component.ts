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
import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import * as _ from 'lodash';

import { KalamService } from '../kalam.service';
import { TaskService, CoachTask } from '../task.service';

@Component({
  selector: 'app-coach-task-notification',
  standalone: false,
  templateUrl: './coach-task-notification.component.html',
  styleUrl: './coach-task-notification.component.scss'
})
export class CoachTaskNotificationComponent implements OnInit {

  // Role flags
  isOwner: boolean = false;
  coachId: string = '';
  myKalamId: string = '';
  myName: string = '';
  academyId: string = '';

  // Head Coach: Assign Task
  coachList: any[] = [];
  taskForm!: UntypedFormGroup;
  assignedTasks: CoachTask[] = [];
  showAssignForm: boolean = false;

  // Sub Coach: Active Notifications (Pending + Acknowledged, NOT Completed)
  activeTasks: CoachTask[] = [];

  // Task History (both roles)
  taskHistory: CoachTask[] = [];
  historyDisplayedColumns: string[] = ['date', 'title', 'description', 'assignedTo', 'status'];

  // Loading states
  loadingTasks: boolean = false;
  loadingHistory: boolean = false;

  constructor(
    private kalamService: KalamService,
    private taskService: TaskService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    const coachData = this.kalamService.getCoachData();
    this.isOwner = coachData.academyId ? false : true;
    this.myKalamId = coachData.kalamId;
    this.myName = coachData.name;
    this.coachId = coachData.academyId
      ? coachData.academyId.replace('A', '')
      : coachData.kalamId;
    this.academyId = this.isOwner
      ? `A${coachData.kalamId}`
      : coachData.academyId;
  }

  ngOnInit(): void {
    this.taskForm = new UntypedFormGroup({
      title: new UntypedFormControl('', [Validators.required]),
      description: new UntypedFormControl('', [Validators.required]),
      assignedTo: new UntypedFormControl('', [Validators.required])
    });

    if (this.isOwner) {
      this.loadCoachList();
      this.loadAssignedTasks();
    } else {
      this.loadActiveTasks();
      this.loadTaskHistory();
    }
  }

  // ─── Head Coach Functions ────────────────────

  private loadCoachList(): void {
    const query = { academyId: this.academyId };
    this.kalamService.getAcademyCoaches(query).subscribe((res: any) => {
      const data = res.map((document: any) => ({
        id: document.payload.doc.id,
        ...document.payload.doc.data() as {}
      }));
      this.coachList = data.filter((c: any) => c.kalamId !== this.myKalamId && c.approved);
    });
  }

  private loadAssignedTasks(): void {
    this.loadingHistory = true;
    this.taskService.getTasksByHeadCoach(this.academyId).subscribe((res: any) => {
      this.assignedTasks = res.map((document: any) => ({
        id: document.payload.doc.id,
        ...document.payload.doc.data() as {}
      }));
      this.assignedTasks = _.sortBy(this.assignedTasks, ['assignedDate', 'assignedTime']).reverse();
      this.loadingHistory = false;
    });
  }

  toggleAssignForm(): void {
    this.showAssignForm = !this.showAssignForm;
    if (!this.showAssignForm) {
      this.taskForm.reset();
    }
  }

  assignTask(): void {
    if (this.taskForm.invalid) {
      for (const control of Object.keys(this.taskForm.controls)) {
        this.taskForm.controls[control].markAsTouched();
      }
      return;
    }

    const selectedCoach = this.coachList.find(
      (c: any) => c.kalamId === this.taskForm.value.assignedTo
    );

    const task: CoachTask = {
      title: this.taskForm.value.title,
      description: this.taskForm.value.description,
      assignedTo: this.taskForm.value.assignedTo,
      assignedToName: selectedCoach ? selectedCoach.name : '',
      assignedBy: this.myKalamId,
      assignedByName: this.myName,
      academyId: this.academyId,
      assignedDate: moment().format('MM-DD-YYYY'),
      assignedTime: moment().format('HH:mm:ss'),
      status: 'Pending'
    };

    this.taskService.createTask(task, this.coachId);
    this.taskForm.reset();
    this.showAssignForm = false;
    this._snackBar.open('Task assigned successfully!', '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  deleteTask(task: CoachTask): void {
    this.taskService.deleteTask(task.id!, task.attendanceDocId);
    this._snackBar.open('Task deleted', '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2000,
    });
  }

  // ─── Sub Coach Functions ─────────────────────

  /**
   * Load active tasks: Pending + Acknowledged.
   * Notifications remain visible until the sub-coach explicitly marks as Completed.
   */
  private loadActiveTasks(): void {
    this.loadingTasks = true;
    this.taskService.getActiveTasks(this.myKalamId).subscribe((res: any) => {
      const allTasks: CoachTask[] = res.map((document: any) => ({
        id: document.payload.doc.id,
        ...document.payload.doc.data() as {}
      }));
      // Filter client-side: only Pending and Acknowledged stay as active notifications
      this.activeTasks = allTasks.filter(t => t.status !== 'Completed');
      this.activeTasks = _.sortBy(this.activeTasks, ['assignedDate', 'assignedTime']).reverse();
      this.loadingTasks = false;
    });
  }

  private loadTaskHistory(): void {
    this.loadingHistory = true;
    this.taskService.getTaskHistory(this.myKalamId).subscribe((res: any) => {
      this.taskHistory = res.map((document: any) => ({
        id: document.payload.doc.id,
        ...document.payload.doc.data() as {}
      }));
      this.taskHistory = _.sortBy(this.taskHistory, ['assignedDate', 'assignedTime']).reverse();
      this.loadingHistory = false;
    });
  }

  respondToTask(task: CoachTask, status: 'Acknowledged' | 'Completed'): void {
    this.taskService.respondToTask(task.id!, status, task.attendanceDocId);
    this._snackBar.open(`Task marked as ${status}!`, '', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  // ─── Helpers ─────────────────────────────────

  getStatusClass(status: string): string {
    switch (status) {
      case 'Pending': return 'status-pending';
      case 'Acknowledged': return 'status-acknowledged';
      case 'Completed': return 'status-completed';
      default: return '';
    }
  }

  get pendingCount(): number {
    return this.isOwner
      ? this.assignedTasks.filter(t => t.status === 'Pending').length
      : this.activeTasks.filter(t => t.status === 'Pending').length;
  }

  get acknowledgedCount(): number {
    if (this.isOwner) {
      return this.assignedTasks.filter(t => t.status === 'Acknowledged').length;
    }
    return this.activeTasks.filter(t => t.status === 'Acknowledged').length;
  }

  get completedCount(): number {
    if (this.isOwner) {
      return this.assignedTasks.filter(t => t.status === 'Completed').length;
    }
    return this.taskHistory.filter(t => t.status === 'Completed').length;
  }

  get activeNotificationCount(): number {
    return this.activeTasks.length;
  }

  goHome(): void {
    this.router.navigate(['/home']);
  }
}
