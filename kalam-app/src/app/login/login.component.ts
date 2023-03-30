import { Component, OnInit } from '@angular/core';
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

export interface UserLogin {
  username: string;
  password: string;
}

export interface StudentData {
  coachId: string | undefined;
  underAge: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signInForm!: FormGroup;
  userLogin: UserLogin;

  constructor(private router: Router, 
    private loaderService: LoaderService,
    private _snackBar: MatSnackBar,
    private kalamService: KalamService) {
    this.userLogin = {} as UserLogin;
   }

  ngOnInit(): void {
    this.signInForm = new FormGroup({
      username: new FormControl(this.userLogin.username, [
        Validators.required, 
        Validators.email,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')
      ]),
      password: new FormControl(this.userLogin.password, [
        Validators.required
      ]),
    });
    this.kalamService.setCoachData({} as RegistrationDetails);
  }

  onSubmit(): void {
    if (this.signInForm.invalid) {
      for (const control of Object.keys(this.signInForm.controls)) {
        this.signInForm.controls[control].markAsTouched();
      }
      return;
    }
    this.loaderService.show();
    this.kalamService.loginDetails(this.signInForm.value).subscribe((res: any) => {
      this.loaderService.hide();
      let data = res.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      if(data.length > 0) {
        if(data[0].approved) {
          sessionStorage.setItem('coachDetails', JSON.stringify(data[0]));
          //this.kalamService.setCoachData(data[0]);
          this.router.navigate([`/home`]);
        }else {
          if(data[0].academyOwned == 'N') {
            this._snackBar.open(`Your account is not yet approved. Please contact ${data[0].academyName} admin.`, '', {
              horizontalPosition: 'center',
              verticalPosition: 'top',
              duration: 8000,
              panelClass: ['red-snackbar']
            });
          }
         
        }
        
      }else {
        this._snackBar.open('Invalid username or password', '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 5000,
          panelClass: ['red-snackbar']
        });
      }
    });
    
  }

  signUp(){
    this.router.navigate([`/sign-up`]);
  }

}
