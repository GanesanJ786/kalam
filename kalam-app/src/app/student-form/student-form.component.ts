/**
 * Copyright (c) 2024-2026 Kalam. All Rights Reserved.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Copyright (c) 2024-2026 Kalam. All Rights Reserved.
 * Unauthorized copying or distribution is strictly prohibited.
 */
/**
 * Copyright (c) 2024-2026 Kalam. All Rights Reserved.
 * Unauthorized copying or distribution is strictly prohibited.
 */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { finalize, take, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

import { KalamService } from '../kalam.service';
import { LoaderService } from '../loader.service';
import { CompetencyLevel, Scholarship, SelectItem } from '../constant';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  occupationStatus?: string;
  preferredSport?: string;
  skillLevel?: string;
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
}

@Component({
    selector: 'app-student-form',
    templateUrl: './student-form.component.html',
    styleUrls: ['./student-form.component.scss'],
    standalone: false,
    animations: [
      trigger('fadeSlide', [
        transition(':enter', [
          style({ opacity: 0, transform: 'translateY(16px)' }),
          animate('350ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 1, transform: 'translateY(0)' }))
        ]),
        transition(':leave', [
          animate('200ms cubic-bezier(0.4, 0, 0.2, 1)',
            style({ opacity: 0, transform: 'translateY(-10px)' }))
        ])
      ])
    ]
})
export class StudentFormComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  studentForm!: UntypedFormGroup;
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
  sportOptions = [
    { value: 'football', label: 'Football', icon: 'sports_soccer' },
    { value: 'volleyball', label: 'Volleyball', icon: 'sports_volleyball' },
    { value: 'badminton', label: 'Badminton', icon: 'sports_tennis' },
    { value: 'cricket', label: 'Cricket', icon: 'sports_cricket' },
    { value: 'chess', label: 'Chess', icon: 'psychology' },
    { value: 'hockey', label: 'Hockey', icon: 'sports_hockey' },
    { value: 'fitness', label: 'Fitness', icon: 'fitness_center' },
  ];
  genderOptions = [
    { value: 'male', label: 'Male', icon: 'male' },
    { value: 'female', label: 'Female', icon: 'female' },
    { value: 'other', label: 'Other', icon: 'transgender' },
  ];
  occupationOptions = [
    { value: 'student', label: 'Student', icon: 'school' },
    { value: 'professional', label: 'Professional', icon: 'work' },
    { value: 'other', label: 'Other', icon: 'person' },
  ];
  skillLevelOptions = [
    { value: 'beginner', label: 'Beginner', icon: 'emoji_events' },
    { value: 'intermediate', label: 'Intermediate', icon: 'trending_up' },
    { value: 'advanced', label: 'Advanced', icon: 'star' },
  ];
  positionSports = ['football', 'hockey'];

  constructor(private kalamService: KalamService, private router: Router,
    private _snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private loaderService: LoaderService,
    private storage: AngularFireStorage) {
    this.competencyLevel = CompetencyLevel;
    this.scholarship = Scholarship;
    this.studentDetails = {} as StudentDetails;
    this.coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
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


    this.kalamService.getGroundDetailsCached(this.coachId).pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      this.groundList = data;
    });
    this.studentForm = new UntypedFormGroup({
      imageUrl: new UntypedFormControl("", []),
      occupationStatus: new UntypedFormControl(this.studentDetails.occupationStatus || 'student', [Validators.required]),
      name: new UntypedFormControl(this.studentDetails.name,[Validators.required]),
      dob: new UntypedFormControl(this.studentDetails.dob, [Validators.required]),
      age: new UntypedFormControl(this.studentDetails.age,[Validators.required]),
      gender: new UntypedFormControl(this.studentDetails.gender, [Validators.required]),
      fatherName: new UntypedFormControl(this.studentDetails.fatherName, [Validators.required]),
      motherName: new UntypedFormControl(this.studentDetails.motherName,[Validators.required]),
      fatherOcc: new UntypedFormControl(this.studentDetails.fatherOcc, [Validators.required]),
      motherOcc: new UntypedFormControl(this.studentDetails.motherOcc,[Validators.required]),
      emailId: new UntypedFormControl(this.studentDetails.emailId, [Validators.required,Validators.email,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
      mobileNum: new UntypedFormControl(this.studentDetails.mobileNum,[Validators.required]),
      whatsappNum: new UntypedFormControl(this.studentDetails.whatsappNum, [Validators.required]),
      emgContactName: new UntypedFormControl(this.studentDetails.emgContactName,[Validators.required]),
      emgContactNum: new UntypedFormControl(this.studentDetails.emgContactNum, [Validators.required]),
      institutionName: new UntypedFormControl(this.studentDetails.institutionName,[Validators.required]),
      studying: new UntypedFormControl(this.studentDetails.studying, [Validators.required]),
      preAcademyPlayed: new UntypedFormControl(this.studentDetails.preAcademyPlayed,[Validators.required]),
      playingPostion: new UntypedFormControl(this.studentDetails.playingPostion,[Validators.required]),
      anyMedicalIssue: new UntypedFormControl(this.studentDetails.anyMedicalIssue, [Validators.required]),
      jersySize: new UntypedFormControl(this.studentDetails.jersySize, [Validators.required]),
      height: new UntypedFormControl(this.studentDetails.height,[Validators.required]),
      weight: new UntypedFormControl(this.studentDetails.weight, [Validators.required]),
      address: new UntypedFormControl(this.studentDetails.address, [Validators.required]),
      groundName: new UntypedFormControl(this.studentDetails.groundName, [Validators.required]),
      preferredSport: new UntypedFormControl(this.studentDetails.preferredSport || '', [Validators.required]),
      skillLevel: new UntypedFormControl(this.studentDetails.skillLevel || '', []),
      scholarship: new UntypedFormControl(this.studentDetails.scholarship, []),
      competency: new UntypedFormControl(this.studentDetails.competency, []),
    });

    this.onOccupationStatusChange(this.studentForm.get('occupationStatus')?.value || 'student');

    this.studentForm.get('occupationStatus')?.valueChanges.subscribe((status: string) => {
      this.onOccupationStatusChange(status);
    });

    this.onSportChange(this.studentForm.get('preferredSport')?.value || '');

    this.studentForm.get('preferredSport')?.valueChanges.subscribe((sport: string) => {
      this.onSportChange(sport);
    });

    this.btnValidation();
    
    if(this.editAccess) {
      this.studentForm.updateValueAndValidity({ onlySelf: false, emitEvent: true })
    }
  }


  get isStudent(): boolean {
    return this.studentForm?.get('occupationStatus')?.value === 'student';
  }

  get isPositionSport(): boolean {
    const sport = this.studentForm?.get('preferredSport')?.value;
    return this.positionSports.includes(sport);
  }

  get isSkillSport(): boolean {
    const sport = this.studentForm?.get('preferredSport')?.value;
    return sport && !this.positionSports.includes(sport);
  }

  onOccupationStatusChange(status: string) {
    const familyFields = ['fatherName', 'motherName', 'fatherOcc', 'motherOcc'];
    const educationFields = ['institutionName', 'studying'];
    const fields = [...familyFields, ...educationFields];

    if (status === 'student') {
      fields.forEach(f => {
        this.studentForm.get(f)?.setValidators([Validators.required]);
        this.studentForm.get(f)?.updateValueAndValidity();
      });
    } else {
      fields.forEach(f => {
        this.studentForm.get(f)?.clearValidators();
        this.studentForm.get(f)?.updateValueAndValidity();
      });
    }
  }

  selectSport(value: string) {
    this.studentForm.get('preferredSport')?.setValue(value);
    this.studentForm.get('preferredSport')?.markAsTouched();
  }

  selectSkillLevel(value: string) {
    this.studentForm.get('skillLevel')?.setValue(value);
    this.studentForm.get('skillLevel')?.markAsTouched();
  }

  onSportChange(sport: string) {
    if (this.positionSports.includes(sport)) {
      this.studentForm.get('playingPostion')?.setValidators([Validators.required]);
      this.studentForm.get('skillLevel')?.clearValidators();
      this.studentForm.get('skillLevel')?.setValue('');
    } else if (sport) {
      this.studentForm.get('skillLevel')?.setValidators([Validators.required]);
      this.studentForm.get('playingPostion')?.clearValidators();
      this.studentForm.get('playingPostion')?.setValue('');
    } else {
      this.studentForm.get('playingPostion')?.setValidators([Validators.required]);
      this.studentForm.get('skillLevel')?.clearValidators();
    }
    this.studentForm.get('playingPostion')?.updateValueAndValidity();
    this.studentForm.get('skillLevel')?.updateValueAndValidity();
  }

  selectGender(value: string) {
    this.studentForm.get('gender')?.setValue(value);
    this.studentForm.get('gender')?.markAsTouched();
  }

  selectOccupation(value: string) {
    this.studentForm.get('occupationStatus')?.setValue(value);
    this.studentForm.get('occupationStatus')?.markAsTouched();
  }

  btnValidation() {
    this.studentForm.valueChanges.subscribe((val:StudentDetails) => {
      if(this.form1) {
        const baseValid = val.name && val.dob && val.age && val.gender && val.mobileNum && val.whatsappNum;
        const familyValid = !this.isStudent || (val.fatherName && val.fatherOcc && val.motherName && val.motherOcc);
        if(baseValid && familyValid) {
          const noBaseErrors = !this.studentForm.controls['name']['errors'] && !this.studentForm.controls['dob']['errors'] && !this.studentForm.controls['age']['errors'] && !this.studentForm.controls['emailId']['errors'] && !this.studentForm.controls['gender']['errors']
            && !this.studentForm.controls['mobileNum']['errors'] && !this.studentForm.controls['whatsappNum']['errors'];
          const noFamilyErrors = !this.isStudent || (!this.studentForm.controls['fatherName']['errors'] && !this.studentForm.controls['fatherOcc']['errors'] && !this.studentForm.controls['motherName']['errors'] && !this.studentForm.controls['motherOcc']['errors']);
          this.form1Validation = !(noBaseErrors && noFamilyErrors);
        }else {
          this.form1Validation = true;
        }
      }

      if(this.form2) {
        const educationValid = !this.isStudent || (val.institutionName && val.studying);
        const posOrSkill = this.isPositionSport ? val.playingPostion : (this.isSkillSport ? (this.studentForm.get('skillLevel')?.value) : true);
        const baseValid2 = val.emgContactName && val.emgContactNum && val.groundName
          && val.preAcademyPlayed && val.anyMedicalIssue && val.jersySize
          && val.height && val.weight && val.address && val.preferredSport && posOrSkill;
        if(baseValid2 && educationValid){
          const noBaseErrors2 = !this.studentForm.controls['emgContactName']['errors'] && !this.studentForm.controls['emgContactNum']['errors'] && !this.studentForm.controls['groundName']['errors'] 
            && !this.studentForm.controls['preAcademyPlayed']['errors'] && !this.studentForm.controls['anyMedicalIssue']['errors'] && !this.studentForm.controls['jersySize']['errors']
            && !this.studentForm.controls['height']['errors'] && !this.studentForm.controls['weight']['errors'] && !this.studentForm.controls['address']['errors'] && !this.studentForm.controls['preferredSport']['errors']
            && !this.studentForm.controls['playingPostion']['errors'] && !this.studentForm.controls['skillLevel']['errors'];
          const noEduErrors = !this.isStudent || (!this.studentForm.controls['institutionName']['errors'] && !this.studentForm.controls['studying']['errors']);
          this.form2Validation = !(noBaseErrors2 && noEduErrors);
        }else {
          this.form2Validation = true;
        }
      }
    });
  }

  formData(url?: string): void {
    let studentForm: StudentDetails = {...this.studentForm.value};
    let obj = {...this.studentForm.value};
    const coachId = this.kalamService.getCoachData().academyId ? this.kalamService.getCoachData().academyId?.replace("A","") : this.kalamService.getCoachData().kalamId;
    studentForm.dob = moment(obj.dob).format("MM/DD/YYYY");
    studentForm.underAge = this.underAgeCalc(studentForm.dob);
    if(url) {
      studentForm['imageUrl'] = url;
    }else if(!this.editAccess) {
      studentForm['imageUrl'] = "";
    }else if(this.editAccess) {
      studentForm['imageUrl'] = !this.imgSrc.includes("./assets/images/upload.png") ? this.imgSrc : '';
    }
    if(this.editAccess) {
      // Preserve system identifiers on edit
      studentForm.kalamId = this.studentDetails.kalamId;
      studentForm['coachId'] = this.studentDetails.coachId;
      studentForm['approved'] = this.studentDetails.approved;
      studentForm['doj'] = this.studentDetails.doj;
      studentForm['coachName'] = this.studentDetails.coachName;
      studentForm.id = this.studentDetails.id;
      this.kalamService.editStudentDetails(studentForm);
    }else {
      studentForm.kalamId = String(Date.now()).slice(-7);
      studentForm['coachId'] = coachId;
      studentForm['approved'] = false;
      studentForm['doj'] = moment().format("MM/DD/YYYY");
      studentForm['coachName'] = this.kalamService.getCoachData().name;
      if(this.kalamService.getCoachData().academyOwned == "Y") {
        studentForm['approved'] = true;
      }
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
    if(this.selectedImage) {
      var filePath = `student/${this.studentForm.value.name}_${this.studentForm.value.emailId}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.formData(url);
          });
        })
      ).subscribe();
    }else {
      this.formData();
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
