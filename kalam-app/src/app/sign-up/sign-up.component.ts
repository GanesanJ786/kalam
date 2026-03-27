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
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router, ActivatedRoute  } from '@angular/router';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition as MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition as MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';

import { KalamService } from '../kalam.service';
import * as moment from 'moment';
import { LoaderService } from '../loader.service';

export interface RegistrationDetails {
  id?:string;
  imageUrl: string;
  name: string;
  emailId: string;
  password: string;
  confirmPassword: string;
  dob: any;
  gender: string;
  whatsappNum: string;
  academyName: string;
  academyNum: string;
  toCoach: any;
  address: string;
  kalamId: string;
  academyOwned: string;
  academyId?: string;
  academyJoinCode?: string;
  approved?: boolean;
  logoUrl?: string;
}

interface Sports {
  sportName: string;
  sportValue: string;
}

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
    standalone: false
})
export class SignUpComponent implements OnInit {

  @ViewChild('fileUploader', { static: false })
  fileUploader!: any;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private kalamService: KalamService,
    private loaderService: LoaderService,
    private storage: AngularFireStorage, 
    private _snackBar: MatSnackBar) {
    this.registerDeatils = {} as RegistrationDetails;
   }
  registrationForm!: UntypedFormGroup;
  registerDeatils: RegistrationDetails
  sports:Sports[] = [
    {sportName: 'Football', sportValue: 'football'},
    {sportName: 'Badminton', sportValue: 'badminton'},
    {sportName: 'Volleyball', sportValue: 'volleyball'},
    {sportName: 'Cricket', sportValue: 'cricket'},
    {sportName: 'Hockey', sportValue: 'hockey'},
  ]
  selectedImage: any = null;
  imgSrc: string = "./assets/images/upload.png";
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  academyList: any = [];
  ownerList: any = [];
  ownerData: any = null;
  editAccess: boolean = false;
  profileImg:boolean = false;
  logoImg: boolean = false;
  selectLogo: any = null;
  logoUrl: string = "";
  logoSrc: string = "./assets/images/upload.png";
  title: string = "REGISTRATION FORM";
  owner: boolean = true;

  ngOnInit(): void {

    this.activatedRoute.queryParams
      .subscribe((params:any) => {
        if(params.source == 'edit') {
          this.owner = this.kalamService.getCoachData().academyId ? false : true;
          this.title = "Edit Profile"
          this.editAccess = true;
          this.registerDeatils = {...this.registerDeatils, ...this.kalamService.getCoachData()};
          this.registerDeatils.dob = new Date(this.registerDeatils.dob)
          if(this.registerDeatils.imageUrl) {
           // this.fileUploader.click();
            //this.selectedImage = true;
            this.imgSrc = this.registerDeatils.imageUrl;
            this.profileImg = true;
            //this.registrationForm.get("imageUrl")?.patchValue(year);
          }
          if(this.registerDeatils.logoUrl) {
            this.logoSrc = this.registerDeatils.logoUrl;
            this.logoImg = true;
            this.logoUrl = this.registerDeatils.logoUrl;
          }
        }
      }
    );

    this.registrationForm = new UntypedFormGroup({
      logoUrl: new UntypedFormControl("", []),
      imageUrl: new UntypedFormControl("", []),
      name: new UntypedFormControl(this.registerDeatils.name,[Validators.required]),
      dob: new UntypedFormControl(this.registerDeatils.dob, [Validators.required]),
      password: new UntypedFormControl(this.registerDeatils.password,[Validators.required]),
      confirmPassword: new UntypedFormControl(this.registerDeatils.confirmPassword,[Validators.required]),
      gender: new UntypedFormControl(this.registerDeatils.gender, [Validators.required]),
      emailId: new UntypedFormControl(this.registerDeatils.emailId, [Validators.required, Validators.email,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
      whatsappNum: new UntypedFormControl(this.registerDeatils.whatsappNum, [Validators.required]),
      academyName: new UntypedFormControl(this.registerDeatils.academyName,[Validators.required]),
      academyNum: new UntypedFormControl(this.registerDeatils.academyNum, []),
      toCoach: new UntypedFormControl(this.registerDeatils.toCoach,[Validators.required]),
      address: new UntypedFormControl(this.registerDeatils.address, [Validators.required]),
      academyOwned: new UntypedFormControl(this.registerDeatils.academyOwned, [Validators.required]),
      academyId: new UntypedFormControl(this.registerDeatils.academyId, []),
      academyJoinCode: new UntypedFormControl(this.registerDeatils.academyJoinCode || '', [])
    });

    this.setRoleBasedValidators();

    if(this.editAccess) {
      this.registrationForm.updateValueAndValidity({ onlySelf: false, emitEvent: true })
    }
  }

  private setRoleBasedValidators() {
    const isOwner = this.registrationForm.value.academyOwned === 'Y';
    const academyNameControl = this.registrationForm.get('academyName');
    const addressControl = this.registrationForm.get('address');
    const academyJoinCodeControl = this.registrationForm.get('academyJoinCode');

    if (isOwner) {
      academyNameControl?.setValidators([Validators.required]);
      addressControl?.setValidators([Validators.required]);
      academyJoinCodeControl?.clearValidators();
    } else {
      academyNameControl?.clearValidators();
      addressControl?.clearValidators();
      academyJoinCodeControl?.setValidators([Validators.required]);
    }

    academyNameControl?.updateValueAndValidity({ emitEvent: false });
    addressControl?.updateValueAndValidity({ emitEvent: false });
    academyJoinCodeControl?.updateValueAndValidity({ emitEvent: false });
  }

  async verifyJoiningCode(): Promise<boolean> {
    const enteredCode = String(this.registrationForm.value.academyJoinCode || '').trim().toUpperCase();
    this.registrationForm.patchValue({ academyJoinCode: enteredCode }, { emitEvent: false });

    if (!enteredCode) {
      this.ownerData = null;
      this.registrationForm.patchValue({
        academyName: '',
        address: '',
        academyId: ''
      });
      return false;
    }

    const res: any = await firstValueFrom(this.kalamService.getAcademyByJoiningCode(enteredCode));
    const owners = res
      .map((document: any) => ({
        id: document.payload.doc.id,
        ...(document.payload.doc.data() as {})
      }))
      .filter((coach: any) => coach.academyOwned === 'Y');

    if (!owners.length) {
      this.ownerData = null;
      this.registrationForm.patchValue({
        academyName: '',
        address: '',
        academyId: ''
      });
      return false;
    }

    this.ownerData = owners[0];
    this.registrationForm.patchValue({
      academyName: this.ownerData.academyName,
      address: this.ownerData.address,
      academyId: `A${this.ownerData.kalamId}`
    });
    return true;
  }

  private async generateUniqueAcademyJoinCode(academyName: string): Promise<string> {
    const prefix = (academyName || 'KALAM')
      .toUpperCase()
      .replace(/[^A-Z0-9]/g, '')
      .slice(0, 4)
      .padEnd(4, 'X');

    while (true) {
      const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
      const code = `${prefix}-${randomPart}`;
      const res: any = await firstValueFrom(this.kalamService.getAcademyByJoiningCode(code));
      if (!res.length) {
        return code;
      }
    }
  }

  academyOwnedSelection() {
    this.ownerData = null;
    this.registrationForm.patchValue({
      academyName: "",
      address: "",
      academyId: "",
      academyJoinCode: ""
    });
    this.setRoleBasedValidators();
  }

  async onSubmit(){
    if (this.registrationForm.invalid) {
      for (const control of Object.keys(this.registrationForm.controls)) {
        this.registrationForm.controls[control].markAsTouched();
      }
      return;
    }

    if(this.registrationForm.value.password !== this.registrationForm.value.confirmPassword) {
      this.openSnackBar('passwordNotMatch');
      return;
    }

    this.loaderService.show();

    if(this.registrationForm.value.academyOwned === 'N' && !this.editAccess) {
      const validCode = await this.verifyJoiningCode();
      if(!validCode) {
        this._snackBar.open('Invalid academy joining code. Please enter a valid code from academy admin.', '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 6000,
          panelClass: ['red-snackbar']
        });
        this.loaderService.hide();
        return;
      }
    }

    if(!this.editAccess) {
      try {
        const profileExists = await this.isCoachProfileAlreadyExists(this.registrationForm.value.emailId);
        if (profileExists) {
          this._snackBar.open('This email is already registered. Please login.', '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 6000,
            panelClass: ['red-snackbar']
          });
          await this.kalamService.logoutFromFirebase();
          this.loaderService.hide();
          return;
        }

        await this.ensureAccountCreatedAndVerificationSent();
      } catch (error: any) {
        let msg = this.getFirebaseSignupErrorMessage(error?.code);
        this._snackBar.open(msg, '', {
          horizontalPosition: 'center',
          verticalPosition: 'top',
          duration: 6000,
          panelClass: ['red-snackbar']
        });
        this.loaderService.hide();
        return;
      }
    }

    this.submitData();
  }

  submitData() {
    if(this.selectedImage) {
      var filePath = `coach/${this.registrationForm.value.name}_${this.registrationForm.value.emailId}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.formData(url);
          });
        })
      ).subscribe({
        error: () => {
          this.loaderService.hide();
          this._snackBar.open('Unable to upload profile image. Please try again.', '', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 6000,
            panelClass: ['red-snackbar']
          });
        }
      });
    }else {
      this.formData();
    }
  }

  async formData(url?:string) {
    try {
      let coachForm: RegistrationDetails = {...this.registrationForm.value};
      let obj = {...this.registrationForm.value}
      coachForm.kalamId = String(Date.now()).slice(-7);
      coachForm.password = '';
      coachForm.confirmPassword = '';
      if(url) {
        coachForm['imageUrl'] = url;
      }else if(!this.editAccess) {
        coachForm['imageUrl'] = "";
      }
      
      coachForm.dob = moment(obj.dob).format("MM/DD/YYYY");
      if(this.ownerData) {
        coachForm.approved = false;
      }else {
        coachForm.approved = true;
      }
      if(this.editAccess) {
        //coachForm['imageUrl'] = obj.imageUrl;
        coachForm.id = this.registerDeatils.id;
        if(this.logoUrl) {
          coachForm.logoUrl = this.logoUrl;
        }else {
          coachForm.logoUrl = "";
        }
        if(!this.imgSrc.includes("./assets/images/upload.png")) {
          coachForm.imageUrl = this.imgSrc;
        }else {
          coachForm.imageUrl = "";
        }
        await this.kalamService.editCoachDetails(coachForm)
      }else {
        if (coachForm.academyOwned === 'Y') {
          coachForm.academyJoinCode = await this.generateUniqueAcademyJoinCode(coachForm.academyName);
          await this.kalamService.setCoachProfile(coachForm);
        } else {
          coachForm.academyJoinCode = this.ownerData?.academyJoinCode || coachForm.academyJoinCode;
          await this.kalamService.setCoachProfile(coachForm);
        }
      }
      this.selectedImage = null;
      this.imgSrc = "./assets/images/upload.png";
      if(this.editAccess) {
        this.kalamService.cacheCoachData(coachForm);
        this.router.navigate([`/home`]);
      }else {
        await this.kalamService.logoutFromFirebase();
        this.openSnackBar('profileRegisted');
        this.sendMailer();
        this.router.navigate([`/login`], { queryParams: { signup: 'success' } });
      }
    } catch {
      this._snackBar.open('Unable to complete signup. Please try again.', '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 6000,
        panelClass: ['red-snackbar']
      });
    } finally {
      this.loaderService.hide();
    }
    
  }

  sendMailer() {
    if(this.ownerData) {
      const request = {
        "to": `${this.ownerData.emailId}`,
        "subject": "New coach requesting",
        "ownerName": `${this.ownerData.name}`,
        "coachName": `${this.registrationForm.value.name}`
      }
      this.kalamService.sendEmailer(request).subscribe((res:any) => {
        console.log("email sent to the owner");
      })
    }
  }

  openSnackBar(_type: string) {
    let duration: number = 5000;
    let msg: string = "";
    if(_type == "passwordNotMatch") {
      this.horizontalPosition = "end";
      this.verticalPosition = "top";
      msg = 'Password & Confirm Password fields are not matched!';
    }else if(_type == "profileRegisted") {
      this.horizontalPosition = "center";
      this.verticalPosition = "top";
      duration = 7000;
      msg = 'You will receive a confirmation email. After you can login.';
    }else if(_type == "emailVerificationSent") {
      this.horizontalPosition = "center";
      this.verticalPosition = "top";
      duration = 9000;
      msg = 'Verification email sent. Please verify your email first, then click Create again to complete signup.';
    }

    this._snackBar.open(msg, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: duration,
    });
    
  }

  async copyJoinCode(): Promise<void> {
    const joinCode = this.registrationForm.value.academyJoinCode;
    if (!joinCode) {
      return;
    }

    try {
      await navigator.clipboard.writeText(joinCode);
      this._snackBar.open('Academy joining code copied.', '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 2500,
      });
    } catch {
      this._snackBar.open(`Join code: ${joinCode}`, '', {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 4000,
      });
    }
  }

  dateSelected(type: string, event: MatDatepickerInputEvent<Date>) {

  }

  back(){
    if(this.editAccess) {
      this.router.navigate([`/home`]);
    }else {
      this.router.navigate([`/login`]);
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

  showPreviewLogo(event:any) {
    if(event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e:any) => this.logoSrc = e.target.result;
      reader.readAsDataURL(event.target.files[0]);
      this.selectLogo = event.target.files[0];
      var filePath = `academy/logo/${this.registrationForm.value.name}_${this.registrationForm.value.emailId}_${new Date().getTime()}`;
      const fileRef = this.storage.ref(filePath);
      this.loaderService.show();
      this.storage.upload(filePath,this.selectLogo).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.loaderService.hide();
            this.logoUrl = url;
          });
        })
      ).subscribe();
    }else {
      this.logoSrc = "./assets/images/upload.png";
      this.selectLogo = null;
    }
  }

  btnText() {
    return this.editAccess ? "UPDATE" : "CREATE";
  }

  private async ensureAccountCreatedAndVerificationSent(): Promise<void> {
    const email = this.registrationForm.value.emailId;
    const password = this.registrationForm.value.password;

    await this.kalamService.createFirebaseAccount(email, password);
    await this.kalamService.sendEmailVerification();
    this.openSnackBar('emailVerificationSent');
  }

  private async isCoachProfileAlreadyExists(email: string): Promise<boolean> {
    const res: any = await firstValueFrom(this.kalamService.getCoachByEmail(email));
    return !!res?.length;
  }

  private getFirebaseSignupErrorMessage(code?: string): string {
    switch (code) {
      case 'auth/email-already-in-use':
        return 'This email is already in use. Please login or use forgot password.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/weak-password':
        return 'Password is too weak. Please use at least 6 characters.';
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Invalid email or password. Please check your credentials.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      default:
        return 'Unable to create account. Please try again.';
    }
  }
  // deleteImg() {
  //   let pictureRef = this.storage.refFromURL("https://firebasestorage.googleapis.com/v0/b/kalam-in.appspot.com/o/academy%2Flogo%2FGanesan%20J_1234-5678-9123_1680353306850?alt=media&token=d39d31ab-1d64-4fbd-8171-900dfa62077f");
  //   pictureRef.delete()
  //     .subscribe((res) => {
  //       alert("Picture is deleted successfully!");
  //     })
  // };
}
