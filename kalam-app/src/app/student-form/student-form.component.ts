import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { finalize } from 'rxjs/operators';

import { KalamService } from '../kalam.service';
import { LoaderService } from '../loader.service';
import { CompetencyLevel, Scholarship, SelectItem } from '../constant';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { CommonObject } from '../constant';

export interface StudentDetails {
  id?: string;
  name: string;
  dob: any;
  age: number;
  gender: string;
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
  studying: string;
  preAcademyPlayed: boolean;
  playingPostion: string;
  anyMedicalIssue: string;
  jersySize: string;
  height: string;
  weight: string;
  address: string;
  kalamId?: string;
  underAge?: string;
  imageUrl: string;
  coachId: string | undefined;
  disableInBtn?: boolean;
  disableOutBtn?: boolean;
  disableEveBtn?: boolean;
  approved?: boolean;
  coachName?: string;
  doj?: string;
  groundName?: string;
  status?: string;
  feesMonthPaid?:string;
  feesApproveWaiting?: boolean;
  isFeesEnable?:boolean;
  fessCollectedBy?: string;
  feesPaidDate?: string;
  feesAmount?: string;
  scholarship?: string;
  competency?: string;
  payment?: string;
  underType?: number;
  hideEve?: boolean;
  aadharNum?:string;
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
  selectedImage: any = null;
  imgSrc: string = "./assets/images/upload.png";
  groundList: any = [];
  coachId: string | undefined;
  title: string = "PLAYER DETAILS FORM";
  editAccess: boolean = false;
  profileImg: boolean = false;
  scholarship: SelectItem[] = [];
  competencyLevel: SelectItem[] = [];
  sportType: string = "football";

  constructor(private kalamService: KalamService, private router: Router,
    private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private storage: AngularFireStorage) {
    this.competencyLevel = CompetencyLevel;
    this.scholarship = Scholarship;
    this.studentDetails = {} as StudentDetails;
    this.coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
    if(environment.siteNameObj){
      let obj = (CommonObject as any)[environment.siteNameObj];
      this.sportType = obj.sportType;
    }
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams
    .subscribe((params:any) => {
      if(params.source == 'edit') {
        if(this.kalamService.editStudentData.length == 0) {
          this.router.navigate([`/home`]);
          return;
        }
        this.title = "Edit Player Information"
        this.editAccess = true;
        this.studentDetails = {...this.studentDetails, ...this.kalamService.editStudentData};
        this.studentDetails.dob = new Date(this.studentDetails.dob)
        if(this.studentDetails.imageUrl) {
          this.imgSrc = this.studentDetails.imageUrl;
          this.profileImg = true;
        }
      }
    });


    this.kalamService.getGroundDetails(this.coachId).subscribe((res: any) => {
      let data = res.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      this.groundList = data;
    });
    this.studentForm = new FormGroup({
      imageUrl: new FormControl("", []),
      name: new FormControl(this.studentDetails.name,[Validators.required]),
      dob: new FormControl(this.studentDetails.dob, [Validators.required]),
      age: new FormControl(this.studentDetails.age,[Validators.required]),
      gender: new FormControl(this.studentDetails.gender, [Validators.required]),
      fatherName: new FormControl(this.studentDetails.fatherName, [Validators.required]),
      motherName: new FormControl(this.studentDetails.motherName,[Validators.required]),
      fatherOcc: new FormControl(this.studentDetails.fatherOcc, [Validators.required]),
      motherOcc: new FormControl(this.studentDetails.motherOcc,[Validators.required]),
      emailId: new FormControl(this.studentDetails.emailId, [Validators.email,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
      whatsappNum: new FormControl(this.studentDetails.whatsappNum, [Validators.required]),
      
      institutionName: new FormControl(this.studentDetails.institutionName,[Validators.required]),
      studying: new FormControl(this.studentDetails.studying, [Validators.required]),
     
      address: new FormControl(this.studentDetails.address, [Validators.required]),
      groundName: new FormControl(this.studentDetails.groundName, [Validators.required]),
      scholarship: new FormControl(this.studentDetails.scholarship, []),
      competency: new FormControl(this.studentDetails.competency, []),
      kalamId: new FormControl(this.studentDetails.kalamId, []),
      ...(this.sportType == 'football' && {
        emgContactName: new FormControl(this.studentDetails.emgContactName,[Validators.required]),
        emgContactNum: new FormControl(this.studentDetails.emgContactNum, [Validators.required]),
        preAcademyPlayed: new FormControl(this.studentDetails.preAcademyPlayed,[Validators.required]),
        playingPostion: new FormControl(this.studentDetails.playingPostion,[Validators.required]),
        anyMedicalIssue: new FormControl(this.studentDetails.anyMedicalIssue, [Validators.required]),
        jersySize: new FormControl(this.studentDetails.jersySize, [Validators.required]),
        height: new FormControl(this.studentDetails.height,[Validators.required]),
        weight: new FormControl(this.studentDetails.weight, [Validators.required]),
      })
    });

    if(this.sportType == 'football') {
      this.btnValidation();
    }    
    if(this.editAccess) {
      this.studentForm.updateValueAndValidity({ onlySelf: false, emitEvent: true })
    }
  }


  btnValidation() {
    this.studentForm.valueChanges.subscribe((val:StudentDetails) => {
      if(this.form1 && val.name && val.dob && val.age && val.gender 
        && val.fatherName && val.fatherOcc && val.motherName && val.motherOcc
       && val.whatsappNum) {
          if(!this.studentForm.controls['name']['errors'] && !this.studentForm.controls['dob']['errors'] && !this.studentForm.controls['age']['errors'] && !this.studentForm.controls['emailId']['errors'] && !this.studentForm.controls['gender']['errors'] 
            && !this.studentForm.controls['fatherName']['errors'] && !this.studentForm.controls['fatherOcc']['errors'] && !this.studentForm.controls['motherName']['errors'] && !this.studentForm.controls['motherOcc']['errors']
            && !this.studentForm.controls['whatsappNum']['errors']) {
              this.form1Validation = false;
            }else {
              this.form1Validation = true;
            }
      }else {
        this.form1Validation = true;
      } 

      if(this.form2 && val.institutionName && val.studying && val.groundName
        && val.preAcademyPlayed && val.playingPostion && val.anyMedicalIssue && val.jersySize
        && val.height && val.weight && val.address){
          if(!this.studentForm.controls['institutionName']['errors'] && !this.studentForm.controls['studying']['errors'] && !this.studentForm.controls['groundName']['errors'] 
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

  formData(url: string, uniqId: string): void {
    let studentForm: StudentDetails = {...this.studentForm.value};
    let obj = {...this.studentForm.value};
    const coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
    studentForm.kalamId = uniqId;
    studentForm.dob = moment(obj.dob).format("MM/DD/YYYY");
    studentForm.underAge = this.underAgeCalc(studentForm.dob);
    if(url) {
      studentForm['imageUrl'] = url;
    }else if(!this.editAccess) {
      studentForm['imageUrl'] = "";
    }else if(this.editAccess) {
      studentForm['imageUrl'] = !this.imgSrc.includes("./assets/images/upload.png") ? this.imgSrc : '';
    }
    studentForm['coachId'] = coachId;
    studentForm['approved'] = false;
    studentForm['doj'] = moment().format("MM/DD/YYYY");
    studentForm['coachName'] = this.kalamService.getCoachData().name;
    if(this.kalamService.getCoachData().academyOwned == "Y") {
      studentForm['approved'] =   true;
    }   
    if(this.editAccess) {
      studentForm.id = this.studentDetails.id;
      this.kalamService.editStudentDetails(studentForm);
    }else {
      this.kalamService.setStudentDetails(studentForm);
      this._snackBar.open("New student successfully added.", '', {
        horizontalPosition: "center",
        verticalPosition: "top",
        duration: 4000,
      });
    }
    this.kalamService.editStudentData = [];
    this.loaderService.hide();
    this.router.navigate([`/home`]);
  }

  onSubmit() {
    this.loaderService.show();
    let uniqId = "";
    if(!this.editAccess) {
      uniqId = this.kalamService.generateUniqueId();
    }else {
      uniqId = this.studentForm.value.kalamId;
    }
    if(this.selectedImage) {
      var filePath = `student/${this.kalamService.getCoachData().academyId.split("-").splice(1,2).join("-")}/${uniqId.split("-").splice(1,2).join("-")}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.formData(url,uniqId);
          });
        })
      ).subscribe();
    }else {
      this.formData("",uniqId);
    }
  }
  showPreview(event:any) {
    if(event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e:any) => this.imgSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectedImage = event.target.files[0];
    }else {
      this.imgSrc = "./assets/images/upload.png";
      this.selectedImage = null;
    }
  }
  
  underAgeCalc(dobDate: string) {
    let type = ""
    // if(val <= 15) {
    //   type = 'u-15';
    // }else if(val == 16) {
    //   type = 'u-16';
    // }else if(val <= 19) {
    //   type = 'u-19';
    // }else if(val <= 23) {
    //   type = 'u-23';
    // }else {
    //   type = 'open'
    // }

    let dob = moment(dobDate);
    let today = moment();

    let val = today.year() - dob.year();

    if(val < 6) {
      type = 'u-5';
    }else if(val <=21) {
      type = `u-${val}`;
    }else {
      type = 'open'
    }

    return type
  }

  form1Submit(): void {
    this.form1 = false;
    this.form2 = true;
    //if(this.editAccess) {
      this.studentForm.updateValueAndValidity({ onlySelf: false, emitEvent: true })
   // }
  }
  prevForm(): void {
    this.form1 = true;
    this.form2 = false;
    this.form1Validation = false;
    this.studentForm.patchValue({
      imageUrl: ""
    })
    //if(this.editAccess) {
      this.studentForm.updateValueAndValidity({ onlySelf: false, emitEvent: true })
    //}
  }
  
  dateSelected(type: string, event: MatDatepickerInputEvent<Date>) {
    //this.studentForm.get('age').se
    //let val = moment(event.value).format("MM/DD/YYYY");
    let year = moment.duration(moment().diff(event.value)).years();
    if(year > 0) {
      this.studentForm.get("age")?.patchValue(year);
    }else {
      this.studentForm.get("age")?.patchValue(0);
      setTimeout(() => {
        this.studentForm.get("age")?.setErrors({'incorrect': true});
        this.studentForm.controls['age'].markAsTouched();
      }, 10);
    }
  }

  gotoHome() {
    this.router.navigate([`/home`]);
  }

  btnText() {
    return this.editAccess ? "UPDATE" : "SUBMIT";
  }
}
