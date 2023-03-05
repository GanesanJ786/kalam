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
    LoaderComponent
  ],
  imports: [
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
    AngularFireModule.initializeApp(environment.firebase)
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
