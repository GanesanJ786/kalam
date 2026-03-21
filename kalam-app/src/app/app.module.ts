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

import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input'
import { MatLegacyButtonModule as MatButtonModule} from '@angular/material/legacy-button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatLegacyRadioModule as MatRadioModule } from '@angular/material/legacy-radio';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacySnackBarModule as MatSnackBarModule } from '@angular/material/legacy-snack-bar';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
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
