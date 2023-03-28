import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { StudentFormComponent } from './student-form/student-form.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HomeComponent } from './home/home.component';
import { ViewCoachAttendanceComponent } from './view-coach-attendance/view-coach-attendance.component';
import { NewCoachApproveComponent } from './new-coach-approve/new-coach-approve.component';

import { AuthGuardService } from './auth-guard.service';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'home', component: HomeComponent, canActivate: [AuthGuardService] },
  { path: 'student-form', component: StudentFormComponent, canActivate: [AuthGuardService] },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'coachDetails', component: ViewCoachAttendanceComponent, canActivate: [AuthGuardService]},
  { path: 'new-coaches', component: NewCoachApproveComponent, canActivate: [AuthGuardService]},
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
