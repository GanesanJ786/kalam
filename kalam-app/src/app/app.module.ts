import { NgModule } from '@angular/core';
import {
  HTTP_INTERCEPTORS
} from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input'
import { MatButtonModule} from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';


import { StudentFormComponent } from './student-form/student-form.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire/compat';
import { HomeComponent } from './home/home.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { MyTeamsComponent } from './my-teams/my-teams.component';
import { AadharNumberDirective } from './aadhar-number.directive';
import { LoaderInterceptor } from './loader.interceptor';
import { LoaderComponent } from './loader/loader.component';
import { AddGroundComponent } from './add-ground/add-ground.component';
import { ViewCoachAttendanceComponent } from './view-coach-attendance/view-coach-attendance.component';
import { NewCoachApproveComponent } from './new-coach-approve/new-coach-approve.component';
import { NewStudentsComponent } from './new-students/new-students.component';
import { HeaderComponent } from './header/header.component';
import { ApprovePaymentComponent } from './approve-payment/approve-payment.component';
import { ViewStudentDataComponent } from './view-student-data/view-student-data.component';
import { AllStudentsByGroundComponent } from './all-students-by-ground/all-students-by-ground.component';
import { StudentscholarshipComponent } from './studentscholarship/studentscholarship.component';
import { ViewStudentAttendanceRangeComponent } from './view-student-attendance-range/view-student-attendance-range.component';
import { ViewStudentAttendanceDateWiseComponent } from './view-student-attendance-date-wise/view-student-attendance-date-wise.component';
import { StudentPerformanceComponent } from './student-performance/student-performance.component';
import { StudentAnalyticsComponent } from './student-analytics/student-analytics.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    StudentFormComponent,
    SignUpComponent,
    HomeComponent,
    MyProfileComponent,
    MyTeamsComponent,
    AadharNumberDirective,
    LoaderComponent,
    AddGroundComponent,
    ViewCoachAttendanceComponent,
    NewCoachApproveComponent,
    NewStudentsComponent,
    HeaderComponent,
    ApprovePaymentComponent,
    ViewStudentDataComponent,
    AllStudentsByGroundComponent,
    StudentscholarshipComponent,
    ViewStudentAttendanceRangeComponent,
    ViewStudentAttendanceDateWiseComponent,
    StudentPerformanceComponent,
    StudentAnalyticsComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatRadioModule,
    MatIconModule,
    MatTabsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatMenuModule,
    MatExpansionModule,
    MatTableModule,
    MatSortModule,
    AngularFireModule.initializeApp(environment.firebase),
    NgIdleKeepaliveModule.forRoot()
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true,
    }
],
  bootstrap: [AppComponent]
})
export class AppModule { }
