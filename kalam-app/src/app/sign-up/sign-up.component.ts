import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Router } from '@angular/router';
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
  imageUrl: string;
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
  toCoach: any;
  address: string;
  kalamId: string;
  academyOwned: string;
  academyId?: string;
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

  constructor(private router: Router,
    private kalamService: KalamService,
    private loaderService: LoaderService,
    private storage: AngularFireStorage, 
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
  ]
  selectedImage: any = null;
  imgSrc: string = "./assets/images/upload.png";
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  academyList: any = [];
  ownerList: any = [];

  ngOnInit(): void {
    this.registrationForm = new FormGroup({
      imageUrl: new FormControl(this.registerDeatils.imageUrl, []),
      name: new FormControl(this.registerDeatils.name,[Validators.required]),
      dob: new FormControl(this.registerDeatils.dob, [Validators.required]),
      password: new FormControl(this.registerDeatils.password,[Validators.required]),
      confirmPassword: new FormControl(this.registerDeatils.confirmPassword,[Validators.required]),
      gender: new FormControl(this.registerDeatils.gender, [Validators.required]),
      aadharNum: new FormControl(this.registerDeatils.aadharNum,[Validators.required]),
      emailId: new FormControl(this.registerDeatils.emailId, [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]),
      whatsappNum: new FormControl(this.registerDeatils.whatsappNum, [Validators.required]),
      academyName: new FormControl(this.registerDeatils.academyName,[Validators.required]),
      academyNum: new FormControl(this.registerDeatils.academyNum, []),
      toCoach: new FormControl(this.registerDeatils.toCoach,[Validators.required]),
      address: new FormControl(this.registerDeatils.address, [Validators.required]),
      academyOwned: new FormControl(this.registerDeatils.academyOwned, [Validators.required]),
      academyId: new FormControl(this.registerDeatils.academyId, [])
    });
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
    const ownerData = this.ownerList.filter((res:any) => res.academyName == this.registrationForm.value.academyName)[0];
    this.registrationForm.patchValue({
      address: ownerData.address,
      academyId: `A${ownerData.kalamId}`
    })
  }

  academyOwnedSelection() {
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
    if(this.selectedImage) {
      var filePath = `coach/${this.registrationForm.value.name}_${this.registrationForm.value.aadharNum}_${new Date().getTime()}`;
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

  formData(url?:string) {
    let coachForm: RegistrationDetails = {...this.registrationForm.value};
    let obj = {...this.registrationForm.value}
    coachForm.kalamId = obj.aadharNum.replaceAll("-",'');
    coachForm['imageUrl'] = url ? url : '';
    coachForm.dob = moment(obj.dob).format("MM/DD/YYYY");
    this.kalamService.setCoachProfile(coachForm);
    this.selectedImage = null;
    this.imgSrc = "./assets/images/upload.png";
    this.openSnackBar('profileRegisted');
    this.loaderService.hide();
    this.router.navigate([`/login`]);
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
    this.router.navigate([`/login`]);
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

}
