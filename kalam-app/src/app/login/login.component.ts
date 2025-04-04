import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { KalamService } from 'src/app/kalam.service';
import { RegistrationDetails } from '../sign-up/sign-up.component';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import { LoaderService } from '../loader.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Subscription } from 'rxjs';

export interface UserLogin {
  username: string;
  password: string;
}

export interface StudentData {
  coachId: string | undefined;
  underAge: string;
  groundName?: string;
  scholarshipType?: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  signInForm!: FormGroup;
  userLogin: UserLogin;

  private subscription: Subscription = new Subscription;


  constructor(private router: Router,
    private loaderService: LoaderService,
    private _snackBar: MatSnackBar,
    private afAuth: AngularFireAuth,
    private kalamService: KalamService) {
    this.userLogin = {} as UserLogin;
  }

  ngOnInit(): void {
    this.signInForm = new FormGroup({
      username: new FormControl(this.userLogin.username, [
        Validators.required,
        Validators.email, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')
      ]),
      password: new FormControl(this.userLogin.password, [
        Validators.required
      ]),
    });
    this.kalamService.setCoachData({} as RegistrationDetails);
  }

  ngOnDestroy(): void {
    // Unsubscribe to avoid memory leaks
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

  }

  onSubmit(): void {
    let stopLoop = false;
    if (this.signInForm.invalid) {
      for (const control of Object.keys(this.signInForm.controls)) {
        this.signInForm.controls[control].markAsTouched();
      }
      return;
    }
    this.loaderService.show();

    this.afAuth.signInWithEmailAndPassword(this.signInForm.value.username, this.signInForm.value.password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user?.emailVerified) {
          console.log('Email is verified. User can proceed.');
          // Navigate to the dashboard or continue with your flow
          this.subscription = this.kalamService.loginDetails(this.signInForm.value).subscribe((res: any) => {
            if (!stopLoop) {
              this.loaderService.hide();
              let data = res.map((document: any) => {
                return {
                  id: document.payload.doc.id,
                  ...document.payload.doc.data() as {}
                }
              });
              if (data.length > 0) {
                if (data[0].approved) {
                  sessionStorage.setItem('coachDetails', JSON.stringify(data[0]));
                  // let coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
                  // this.kalamService.getAllStudents(coachId).subscribe((res: any) => {
                  //   let data = res.map((document: any) => {
                  //     return {
                  //       id: document.payload.doc.id,
                  //       ...document.payload.doc.data() as {}
                  //     }
                  //   });

                  //   console.log(data);
                  // })
                  //this.kalamService.setCoachData(data[0]);
                  this.router.navigate([`/home`]);
                } else {
                  if (data[0].academyOwned == 'N') {
                    this._snackBar.open(`Your account is not yet approved. Please contact ${data[0].academyName} admin.`, '', {
                      horizontalPosition: 'center',
                      verticalPosition: 'top',
                      duration: 8000,
                      panelClass: ['red-snackbar']
                    });
                  }

                }

              } else {
                this._snackBar.open('Invalid username or password', '', {
                  horizontalPosition: 'center',
                  verticalPosition: 'top',
                  duration: 5000,
                  panelClass: ['red-snackbar']
                });
              }
              stopLoop = true;
            }
          });
        } else {
          console.log('Email is not verified. Please verify your email.');
          alert('Your email is not verified. Please verify it first.');
          user?.sendEmailVerification().then(() => {
            
            console.log('Verification email sent!');
          }).catch((error) => {
            console.error('Error sending verification email:', error);
            alert(error.message);
          });
          this.loaderService.hide();
          return;
          // Optionally, send another verification email
          //this.sendVerificationEmail(email); 
        }
      })
      .catch((error) => {
        console.error('Error during login:', error);
        alert('Login failed: ' + error.message);
        this.loaderService.hide();
      });

  }

  signUp() {
    this.router.navigate([`/sign-up`]);
  }

}
