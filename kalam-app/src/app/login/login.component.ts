import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { KalamService } from 'src/app/kalam.service';
import { StudentDetails } from '../student-form/student-form.component';

interface UserLogin {
  username: string;
  password: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  signInForm!: FormGroup;
  userLogin: UserLogin;

  constructor(private router: Router, private kalamService: KalamService) {
    this.userLogin = {} as UserLogin;
   }

  ngOnInit(): void {
    this.signInForm = new FormGroup({
      username: new FormControl(this.userLogin.username, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(20),
      ]),
      password: new FormControl(this.userLogin.password, [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(6),
      ]),
    });
    this.kalamService.getStudentDetails().subscribe((res: any) => {
      let data = res.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      console.log(data)
    })
  }

  onSubmit(): void {
    if (this.signInForm.invalid) {
      for (const control of Object.keys(this.signInForm.controls)) {
        this.signInForm.controls[control].markAsTouched();
      }
      return;
    }

    this.userLogin = this.signInForm.value;
    console.info('Username:', this.userLogin.username);
    console.info('Password:', this.userLogin.password);

    this.router.navigate([`/student-form`]);
  }

  signUp(){
    this.router.navigate([`/sign-up`]);
  }

}
