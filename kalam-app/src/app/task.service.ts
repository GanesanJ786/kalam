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
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import * as moment from 'moment';

export interface CoachTask {
  id?: string;
  title: string;
  description: string;
  assignedTo: string;        // sub-coach kalamId
  assignedToName: string;    // sub-coach name
  assignedBy: string;        // head coach kalamId
  assignedByName: string;    // head coach name
  academyId: string;
  assignedDate: string;      // MM-DD-YYYY
  assignedTime: string;      // HH:mm:ss
  status: 'Pending' | 'Acknowledged' | 'Completed';
  respondedDate?: string;
  respondedTime?: string;
  attendanceDocId?: string;  // linked coachAttendance document id
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private collectionName = 'coachTasks';

  constructor(private fireStore: AngularFirestore) { }

  /** Head coach creates a task for a sub-coach and logs it in coachAttendance */
  createTask(task: CoachTask, coachId: string): void {
    // 1. Log the task assignment in coachAttendance
    const attendanceData: any = {
      groundName: '',
      academyId: coachId,
      inCoachId: task.assignedTo,
      coachName: task.assignedToName,
      activeDate: task.assignedDate,
      loginTime: task.assignedTime,
      loginDate: task.assignedDate,
      notes: `Task: ${task.title} — ${task.description}`,
      loginAddress: '',
      status: 'TASK',
      taskTitle: task.title,
      taskDescription: task.description,
      taskAssignedBy: task.assignedByName,
      taskStatus: 'Pending'
    };

    this.fireStore.collection('coachAttendance').add({ ...attendanceData }).then((docRef) => {
      // 2. Store the task with a reference to the attendance doc
      const taskWithRef = { ...task, attendanceDocId: docRef.id };
      this.fireStore.collection(this.collectionName).add(taskWithRef);
    });
  }

  /** Get pending (unresponded) tasks for a specific sub-coach */
  getPendingTasks(coachKalamId: string) {
    return this.fireStore.collection(this.collectionName, ref =>
      ref.where('assignedTo', '==', coachKalamId)
         .where('status', '==', 'Pending')
    ).snapshotChanges();
  }

  /**
   * Get active (not-yet-completed) tasks for a sub-coach.
   * Notifications remain visible until the sub-coach marks the task as Completed.
   * Firestore does not support != queries well, so we fetch all and filter client-side.
   */
  getActiveTasks(coachKalamId: string) {
    return this.fireStore.collection(this.collectionName, ref =>
      ref.where('assignedTo', '==', coachKalamId)
    ).snapshotChanges();
  }

  /** Get all tasks assigned by a head coach */
  getTasksByHeadCoach(academyId: string) {
    return this.fireStore.collection(this.collectionName, ref =>
      ref.where('academyId', '==', academyId)
    ).snapshotChanges();
  }

  /** Get task history for a specific sub-coach */
  getTaskHistory(coachKalamId: string) {
    return this.fireStore.collection(this.collectionName, ref =>
      ref.where('assignedTo', '==', coachKalamId)
    ).snapshotChanges();
  }

  /** Sub-coach responds to a task (Acknowledged / Completed) and updates attendance */
  respondToTask(taskId: string, status: 'Acknowledged' | 'Completed', attendanceDocId?: string): void {
    const now = {
      respondedDate: moment().format('MM-DD-YYYY'),
      respondedTime: moment().format('HH:mm:ss')
    };

    // Update the task document
    this.fireStore.doc(`${this.collectionName}/${taskId}`).update({
      status: status,
      ...now
    });

    // Update the linked coachAttendance document so head coach sees it in attendance view
    if (attendanceDocId) {
      this.fireStore.doc(`coachAttendance/${attendanceDocId}`).update({
        taskStatus: status,
        taskRespondedDate: now.respondedDate,
        taskRespondedTime: now.respondedTime
      });
    }
  }

  /** Delete a task and its linked attendance entry */
  deleteTask(taskId: string, attendanceDocId?: string): void {
    this.fireStore.doc(`${this.collectionName}/${taskId}`).delete();
    if (attendanceDocId) {
      this.fireStore.doc(`coachAttendance/${attendanceDocId}`).delete();
    }
  }
}
