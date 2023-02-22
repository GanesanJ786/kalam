import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';

interface RegistrationDetails {
  name: string;
  emailId: string;
  password: string;
  confirmPassword: string;
  dob: string;
  gender: string;
  aadharNum: string;
  whatsappNum: string;
  academyName: string;
  academyNum: string;
  toCoach: string;
  address: string;
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  constructor(private router: Router) {
    this.registerDeatils = {} as RegistrationDetails;
   }
  registrationForm!: FormGroup;
  registerDeatils: RegistrationDetails
  sports:string[] = ['Football', 'Badminton', 'Volleyball', 'Cricket', 'Hockey'];

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      name: new FormControl(this.registerDeatils.name,[Validators.required]),
      dob: new FormControl(this.registerDeatils.dob, [Validators.required]),
      password: new FormControl(this.registerDeatils.password,[Validators.required]),
      confirmPassword: new FormControl(this.registerDeatils.confirmPassword,[Validators.required]),
      gender: new FormControl(this.registerDeatils.gender, [Validators.required]),
      aadharNum: new FormControl(this.registerDeatils.aadharNum,[Validators.required]),
      emailId: new FormControl(this.registerDeatils.emailId, [Validators.required]),
      whatsappNum: new FormControl(this.registerDeatils.whatsappNum, [Validators.required]),
      academyName: new FormControl(this.registerDeatils.academyName,[Validators.required]),
      academyNum: new FormControl(this.registerDeatils.academyNum, []),
      toCoach: new FormControl(this.registerDeatils.toCoach,[Validators.required]),
      address: new FormControl(this.registerDeatils.address, [Validators.required])
    });
  }

  onSubmit(){

  }

  dateSelected(type: string, event: MatDatepickerInputEvent<Date>) {

  }

  back(){
    this.router.navigate([`/login`]);
  }

}
