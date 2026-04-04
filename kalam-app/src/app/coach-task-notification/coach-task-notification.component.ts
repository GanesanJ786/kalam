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
import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import * as _ from 'lodash';

import { KalamService } from '../kalam.service';
import { TaskService, CoachTask } from '../task.service';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

const today = new Date();
const month = today.getMonth();
const year = today.getFullYear();

@Component({
  selector: 'app-coach-task-notification',
  standalone: false,
  templateUrl: './coach-task-notification.component.html',
  styleUrl: './coach-task-notification.component.scss'
})
export class CoachTaskNotificationComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

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
  historyDisplayedColumns: string[] = ['date', 'title', 'description', 'assignedTo', 'status', 'actions'];

  // Date range filter
  taskDateRangeGroup!: UntypedFormGroup;
  startOfMonth: any;
  endOfMonth: any;

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
    this.isOwner = this.kalamService.isAcademyOwner();
    this.myKalamId = coachData.kalamId;
    this.myName = coachData.name;
    this.coachId = this.kalamService.getHeadCoachId();
    this.academyId = this.kalamService.getAcademyId();
  }

  ngOnInit(): void {
    this.taskForm = new UntypedFormGroup({
      title: new UntypedFormControl('', [Validators.required]),
      description: new UntypedFormControl('', [Validators.required]),
      assignedTo: new UntypedFormControl('', [Validators.required])
    });

    // Initialize date range picker
    const todayDate = new Date().getDate();
    const startDate = todayDate > 7 ? todayDate - 7 : 1;
    this.startOfMonth = new Date(moment().startOf('month').format('YYYY-MM-DD hh:mm'));
    this.endOfMonth = new Date(moment().endOf('month').format('YYYY-MM-DD hh:mm'));
    this.taskDateRangeGroup = new UntypedFormGroup({
      start: new UntypedFormControl(new Date(year, month, startDate)),
      end: new UntypedFormControl(new Date(year, month, todayDate)),
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
    this.kalamService.getAcademyCoachesCached(query).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.coachList = data.filter((c: any) => c.kalamId !== this.myKalamId && c.approved);
      // Add self (Head Coach) at the beginning for self-task creation
      this.coachList.unshift({
        kalamId: this.myKalamId,
        name: `${this.myName} (Self)`
      });
    });
  }

  private loadAssignedTasks(): void {
    this.loadingHistory = true;
    this.taskService.getTasksByHeadCoach(this.academyId).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
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
      status: 'Pending',
      taskDateStart: this.taskDateRangeGroup.value.start
        ? moment(this.taskDateRangeGroup.value.start).format('MM-DD-YYYY') : '',
      taskDateEnd: this.taskDateRangeGroup.value.end
        ? moment(this.taskDateRangeGroup.value.end).format('MM-DD-YYYY') : ''
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
    this.taskService.getActiveTasks(this.myKalamId, this.academyId).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
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
    this.taskService.getTaskHistory(this.myKalamId, this.academyId).pipe(takeUntil(this.destroy$)).subscribe((res: any) => {
      this.taskHistory = res.map((document: any) => ({
        id: document.payload.doc.id,
        ...document.payload.doc.data() as {}
      }));
      this.taskHistory = _.sortBy(this.taskHistory, ['assignedDate', 'assignedTime']).reverse();
      this.loadingHistory = false;
    });
  }

  isSelfTask(task: CoachTask): boolean {
    return task.assignedTo === this.myKalamId;
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

  getTaskDateRange(task: CoachTask): string {
    if (task.taskDateStart && task.taskDateEnd) {
      const start = moment(task.taskDateStart, 'MM-DD-YYYY');
      const end = moment(task.taskDateEnd, 'MM-DD-YYYY');
      return start.format('MMM D') + ' – ' + end.format('MMM D, YYYY');
    }
    // Fallback for tasks created before date range was added
    if (task.assignedDate) {
      return moment(task.assignedDate, 'MM-DD-YYYY').format('MMM D, YYYY');
    }
    return '—';
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
