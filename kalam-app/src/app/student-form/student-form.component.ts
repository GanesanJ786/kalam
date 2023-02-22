import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import * as moment from 'moment';

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
  form1: boolean = true;
  form2: boolean = false;
  form1Validation: boolean = true;
  form2Validation: boolean = true;

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
    });

    this.studentForm.valueChanges.subscribe((val:StudentDetails) => {
      if(this.form1 && val.name && val.dob && val.aadharNum && val.age && val.emailId && val.gender 
        && val.fatherName && val.fatherOcc && val.motherName && val.motherOcc
        && val.mobileNum && val.whatsappNum) {
          if(!this.studentForm.controls['name']['errors'] && !this.studentForm.controls['dob']['errors'] && !this.studentForm.controls['aadharNum']['errors'] && !this.studentForm.controls['age']['errors'] && !this.studentForm.controls['emailId']['errors'] && !this.studentForm.controls['gender']['errors'] 
            && !this.studentForm.controls['fatherName']['errors'] && !this.studentForm.controls['fatherOcc']['errors'] && !this.studentForm.controls['motherName']['errors'] && !this.studentForm.controls['motherOcc']['errors']
            && !this.studentForm.controls['mobileNum']['errors'] && !this.studentForm.controls['whatsappNum']['errors']) {
              this.form1Validation = false;
            }else {
              this.form1Validation = true;
            }
      }else {
        this.form1Validation = true;
      } 

      if(this.form2 && val.emgContactName && val.emgContactNum && val.institutionName && val.institutionNum 
        && val.preAcademyPlayed && val.playingPostion && val.anyMedicalIssue && val.jersySize
        && val.height && val.weight && val.address){
          if(!this.studentForm.controls['emgContactName']['errors'] && !this.studentForm.controls['emgContactNum']['errors'] && !this.studentForm.controls['institutionName']['errors'] && !this.studentForm.controls['institutionNum']['errors'] 
            && !this.studentForm.controls['preAcademyPlayed']['errors'] && !this.studentForm.controls['playingPostion']['errors'] && !this.studentForm.controls['anyMedicalIssue']['errors'] && !this.studentForm.controls['jersySize']['errors']
            && !this.studentForm.controls['height']['errors'] && !this.studentForm.controls['weight']['errors'] && !this.studentForm.controls['address']['errors']) {
              this.form2Validation = false;
          }else {
            this.form2Validation = true;
          }

      }else {
        this.form2Validation = true;
      }
    });
    
  }
  onSubmit(): void {

  }

  form1Submit(): void {
    this.form1 = false;
    this.form2 = true;
  }
  prevForm(): void {
    this.form1 = true;
    this.form2 = false;
    this.form1Validation = false;
  }
  
  dateSelected(type: string, event: MatDatepickerInputEvent<Date>) {
    //this.studentForm.get('age').se
    //let val = moment(event.value).format("MM/DD/YYYY");
    let year = moment.duration(moment().diff(event.value)).years();
    if(year) {
      this.studentForm.get("age")?.patchValue(year);
    }else {
      this.studentForm.get("age")?.patchValue(0);
    }
    
  }
}
