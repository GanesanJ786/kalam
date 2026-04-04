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
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { StudentFormComponent } from './student-form/student-form.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { ViewCoachAttendanceComponent } from './view-coach-attendance/view-coach-attendance.component';
import { NewCoachApproveComponent } from './new-coach-approve/new-coach-approve.component';
import { NewStudentsComponent } from './new-students/new-students.component';
import { ApprovePaymentComponent } from './approve-payment/approve-payment.component';
import { QuickAttendanceComponent } from './quick-attendance/quick-attendance.component';
import { CoachTaskNotificationComponent } from './coach-task-notification/coach-task-notification.component';
import { AccountComponent } from './account/account.component';
import { SubscriptionPageComponent } from './subscription-page/subscription-page.component';
import { CollectFeesComponent } from './collect-fees/collect-fees.component';

import { AuthGuardService } from './auth-guard.service';

const routes: Routes = [
  { path: 'login', component: AccountComponent},
  { path: 'legacy-login', component: LoginComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'student-form', component: StudentFormComponent, canActivate: [AuthGuardService] },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'coachDetails', component: ViewCoachAttendanceComponent, canActivate: [AuthGuardService]},
  { path: 'new-coaches', component: NewCoachApproveComponent, canActivate: [AuthGuardService]},
  { path: 'new-students', component: NewStudentsComponent, canActivate: [AuthGuardService]},
  { path: 'fees-approval', component: ApprovePaymentComponent, canActivate: [AuthGuardService]},
  { path: 'quick-attendance', component: QuickAttendanceComponent, canActivate: [AuthGuardService]},
  { path: 'coach-tasks', component: CoachTaskNotificationComponent, canActivate: [AuthGuardService]},
  { path: 'collect-fees', component: CollectFeesComponent, canActivate: [AuthGuardService]},
  { path: 'subscription', component: SubscriptionPageComponent, canActivate: [AuthGuardService]},
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
