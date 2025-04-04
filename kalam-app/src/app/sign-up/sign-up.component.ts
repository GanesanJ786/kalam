import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router, ActivatedRoute  } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';

import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

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
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  @ViewChild('fileUploader', { static: false })
  fileUploader!: any;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private kalamService: KalamService,
    private loaderService: LoaderService,
    private storage: AngularFireStorage, 
    private afAuth: AngularFireAuth,
    private _snackBar: MatSnackBar) {
    this.registerDeatils = {} as RegistrationDetails;
    this.getAcademyNames();
    
   }
  registrationForm!: FormGroup;
  registerDeatils: RegistrationDetails
  sports:Sports[] = [
    {sportName: 'Football', sportValue: 'football'},
    {sportName: 'Badminton', sportValue: 'badminton'},
    {sportName: 'Volleyball', sportValue: 'volleyball'},
    {sportName: 'Cricket', sportValue: 'cricket'},
    {sportName: 'Hockey', sportValue: 'hockey'},
    {sportName: 'Chess', sportValue: 'chess'}
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
  otpSent: boolean = false;
  verificationId: string = '';

  ngOnInit(): void {
    this.sports = this.sports.sort((a, b) => a.sportName.localeCompare(b.sportName));
    this.activatedRoute.queryParams
      .subscribe((params:any) => {
        if(params.source == 'edit') {
          this.owner = this.kalamService.getCoachData().academyOwned === 'Y' ? true : false;
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

    this.registrationForm = new FormGroup({
      logoUrl: new FormControl("", []),
      imageUrl: new FormControl("", []),
      name: new FormControl(this.registerDeatils.name,[Validators.required]),
      dob: new FormControl(this.registerDeatils.dob, [Validators.required]),
      password: new FormControl(this.registerDeatils.password,[Validators.required]),
      confirmPassword: new FormControl(this.registerDeatils.confirmPassword,[Validators.required]),
      gender: new FormControl(this.registerDeatils.gender, [Validators.required]),
      emailId: new FormControl(this.registerDeatils.emailId, [Validators.required, Validators.email,Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]),
      whatsappNum: new FormControl(this.registerDeatils.whatsappNum, [Validators.required]),
      academyName: new FormControl(this.registerDeatils.academyName,[Validators.required]),
      academyNum: new FormControl(this.registerDeatils.academyNum, []),
      toCoach: new FormControl(this.registerDeatils.toCoach,[Validators.required]),
      address: new FormControl(this.registerDeatils.address, [Validators.required]),
      academyOwned: new FormControl(this.registerDeatils.academyOwned, [Validators.required]),
      academyId: new FormControl(this.registerDeatils.academyId, []),
      kalamId: new FormControl(this.registerDeatils.kalamId, []),
      otp: new FormControl("", []),
    });

    if(this.editAccess) {
      this.registrationForm.updateValueAndValidity({ onlySelf: false, emitEvent: true })
    }
  }

  getAcademyNames() {
    this.kalamService.getAllAcademy().subscribe((res: any) => {
      let data = res.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      //console.log(data);
      this.academyList = [];
      this.ownerList = data.filter((res: any) => res.academyOwned == 'Y');
      this.ownerList.forEach((element:any) => {
        let obj = {
          value:element.academyName,
          key:element.academyName
        }
        this.academyList.push(obj);
      });
    });
  }

  academySelection() {
    this.ownerData = this.ownerList.filter((res:any) => res.academyName == this.registrationForm.value.academyName)[0];
    console.log(this.ownerData)
    this.registrationForm.patchValue({
      address: this.ownerData.address,
      academyId: `A${this.ownerData.kalamId}`
    })
  }

  academyOwnedSelection() {
    this.ownerData = null;
    this.registrationForm.patchValue({
      academyName: "",
      address: "",
      academyId: ""
    })
  }

  onSubmit(){
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
    this.submitData();
  }

  submitData() {
    let uniqId = "";
    if(!this.editAccess) {
      uniqId = this.kalamService.generateUniqueId();
    }else {
      uniqId = this.registrationForm.value.kalamId;
    }
    
    if(this.selectedImage) {
      var filePath = `coach/${this.registrationForm.value.academyId.split("-").splice(1,2).join("-")}/${uniqId.split("-").splice(1,2).join("-")}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(filePath,this.selectedImage).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.formData(url, uniqId);
          });
        })
      ).subscribe();
    }else {
      this.formData("", uniqId);
    }
  }

  formData(url:string, uniqId: string) {
    let coachForm: RegistrationDetails = {...this.registrationForm.value};
    let obj = {...this.registrationForm.value}
    coachForm.kalamId = uniqId;
    if(!coachForm.academyId) {
      coachForm.academyId = `A${coachForm.kalamId}`
    }
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
      this.kalamService.editCoachDetails(coachForm)
    }else {
      //this.kalamService.setCoachProfile(coachForm);
    }
    this.selectedImage = null;
    this.imgSrc = "./assets/images/upload.png";
    
    if(this.editAccess) {
      this.loaderService.hide();
      sessionStorage.setItem('coachDetails', JSON.stringify(coachForm));
      this.router.navigate([`/home`]);
    }else {
      //this.openSnackBar('profileRegisted');
      //this.sendMailer();
      this.authEmailSender(coachForm);
      //this.router.navigate([`/login`]);
    }
    
  }

  authEmailSender(coachForm: any) {
    this.afAuth.createUserWithEmailAndPassword(this.registrationForm.value.emailId, this.registrationForm.value.confirmPassword)
      .then((userCredential) => {
        this.loaderService.hide();
        const user = userCredential.user;
        user?.sendEmailVerification().then(() => {
          this.kalamService.setCoachProfile(coachForm);
          console.log('Verification email sent!');
          this.router.navigate([`/login`]);
          this.openSnackBar('profileRegisted');
          sessionStorage.removeItem("coachDetails");
        }).catch((error) => {
          console.error('Error sending verification email:', error);
          alert(error.message);
        });
      })
      .catch((error) => {
        this.loaderService.hide();
        console.error('Error during registration:', error);
        alert(error.message);
      });
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
      //msg = 'You will receive a confirmation email. After you can login.';
      msg = 'A verification email has been sent to your email address.'
    }

    this._snackBar.open(msg, '', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: duration,
    });
    
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
      var filePath = `academy/logo/${this.registrationForm.value.academyId.split("-").splice(1,2).join("-")}/${this.registrationForm.value.kalamId.split("-").splice(1,2).join("-")}`;
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

  // register() {
  //   this.afAuth.createUserWithEmailAndPassword(this.registrationForm.value.emailId, this.registrationForm.value.confirmPassword)
  //     .then((userCredential) => {
  //       const user = userCredential.user;
  //       user?.sendEmailVerification().then(() => {
  //         console.log('Verification email sent!');
  //       }).catch((error) => {
  //         console.error('Error sending verification email:', error);
  //       });
  //     })
  //     .catch((error) => {
  //       console.error('Error during registration:', error);
  //     });

  //     // this.afAuth.authState.subscribe((user) => {
  //     //   if (user?.emailVerified) {
  //     //     alert('Email is verified!');
  //     //   } else {
  //     //     alert('Email is not verified.');
  //     //   }
  //     // });
  // }


  // deleteImg() {
  //   let pictureRef = this.storage.refFromURL("https://firebasestorage.googleapis.com/v0/b/kalam-in.appspot.com/o/academy%2Flogo%2FGanesan%20J_1234-5678-9123_1680353306850?alt=media&token=d39d31ab-1d64-4fbd-8171-900dfa62077f");
  //   pictureRef.delete()
  //     .subscribe((res) => {
  //       alert("Picture is deleted successfully!");
  //     })
  // };

  // Send OTP to the provided phone number
  // sendOtp() {
  //   const appVerifier = new firebase.auth.RecaptchaVerifier(
  //     'recaptcha-container',
  //     {
  //       size: 'invisible',
  //     }
  //   );

  //   console.log(appVerifier);

  //   this.afAuth
  //     .signInWithPhoneNumber("+91" + this.registrationForm.value.whatsappNum.replace(/\s+/g, ""), appVerifier)
  //     .then((confirmationResult) => {
  //       this.otpSent = true;
  //       this.verificationId = confirmationResult.verificationId;
  //      alert('OTP sent successfully!');
  //     })
  //     .catch((error) => {
  //       alert(error);
  //     });
  // }

  // // Verify the entered OTP
  // verifyOtp() {
  //   const credential = firebase.auth.PhoneAuthProvider.credential(
  //     this.verificationId,
  //     this.registrationForm.value.otp
  //   );

  //   this.afAuth
  //     .signInWithCredential(credential)
  //     .then((result) => {
  //       alert('User signed in');
  //     })
  //     .catch((error) => {
  //       alert('Error verifying OTP');
  //     });
  // }
}
