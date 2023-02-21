import { core } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';
import { Moment } from 'moment';

interface StudentDetails {
  name: string;
  dob: string;
  age: string;
  gender: string;
  aadharNum: string;
  fatherName: string;
  motherName: string;
  fatherOcc: string;
  motherOcc: string;
  emailId: string;
  mobileNum: string;
  whatsappNum: string;
  emgContactName: string;
  emgContactNum: string;
  institutionName: string;
  institutionNum: string;
  preAcademyPlayed: boolean;
  playingPostion: string;
  anyMedicalIssue: string;
  jersySize: string;
  height: string;
  weight: string;
  address: string;
}

@Component({
  selector: 'app-student-form',
  templateUrl: './student-form.component.html',
  styleUrls: ['./student-form.component.scss']
})
export class StudentFormComponent implements OnInit {

  studentForm!: FormGroup;
  studentDetails: StudentDetails;

  constructor() {
    this.studentDetails = {} as StudentDetails;
  }

  ngOnInit(): void {
    this.studentForm = new FormGroup({
      name: new FormControl(this.studentDetails.name,[Validators.required]),
      dob: new FormControl(this.studentDetails.dob, [Validators.required]),
      age: new FormControl(this.studentDetails.age,[Validators.required]),
      gender: new FormControl(this.studentDetails.gender, [Validators.required]),
      aadharNum: new FormControl(this.studentDetails.aadharNum,[Validators.required]),
      fatherName: new FormControl(this.studentDetails.fatherName, [Validators.required]),
      motherName: new FormControl(this.studentDetails.motherName,[Validators.required]),
      fatherOcc: new FormControl(this.studentDetails.fatherOcc, [Validators.required]),
      motherOcc: new FormControl(this.studentDetails.motherOcc,[Validators.required]),
      emailId: new FormControl(this.studentDetails.emailId, [Validators.required]),
      mobileNum: new FormControl(this.studentDetails.mobileNum,[Validators.required]),
      whatsappNum: new FormControl(this.studentDetails.whatsappNum, [Validators.required]),
      emgContactName: new FormControl(this.studentDetails.emgContactName,[Validators.required]),
      emgContactNum: new FormControl(this.studentDetails.emgContactNum, [Validators.required]),
      institutionName: new FormControl(this.studentDetails.institutionName,[Validators.required]),
      institutionNum: new FormControl(this.studentDetails.institutionNum, [Validators.required]),
      preAcademyPlayed: new FormControl(this.studentDetails.preAcademyPlayed,[Validators.required]),
      playingPostion: new FormControl(this.studentDetails.playingPostion,[Validators.required]),
      anyMedicalIssue: new FormControl(this.studentDetails.anyMedicalIssue, [Validators.required]),
      jersySize: new FormControl(this.studentDetails.jersySize, [Validators.required]),
      height: new FormControl(this.studentDetails.height,[Validators.required]),
      weight: new FormControl(this.studentDetails.weight, [Validators.required]),
      address: new FormControl(this.studentDetails.address, [Validators.required])
    })
  }
  onSubmit(): void {

  }
  dateSelected(type: string, event: MatDatepickerInputEvent<Date>) {
    //let val = moment(event.value).format("MM/DD/YYYY")
    console.log(moment.duration(moment().diff(event.value)).years());
  }
}
