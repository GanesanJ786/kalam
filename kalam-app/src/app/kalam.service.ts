import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { StudentData, UserLogin } from './login/login.component';
import { RegistrationDetails } from './sign-up/sign-up.component';
import { StudentDetails } from './student-form/student-form.component'; 

@Injectable({
  providedIn: 'root'
})
export class KalamService {

  constructor(private fireStore: AngularFirestore) { }

  getCoachInfo: RegistrationDetails = {} as RegistrationDetails;

  getStudentDetails() {
    return this.fireStore.collection("studentDetails").snapshotChanges();
  }

  setStudentDetails(list: StudentDetails) {
    this.fireStore.collection("studentDetails").add({...list});
  }

  editStudentDetails(item: StudentDetails) {
    this.fireStore.doc("studentDetails/"+item.id).update(item);
  }

  deleteStudentDetails(item: StudentDetails) {
    this.fireStore.doc("studentDetails/"+item.id).delete();
  }

  setCoachProfile(profile: RegistrationDetails) {
    this.fireStore.collection("coachDetails").add({...profile});
  }

  loginDetails(query:UserLogin) {
    return this.fireStore.collection('coachDetails', ref => ref.where('emailId', '==', `${query.username}`).where("password", "==", `${query.password}`)).snapshotChanges();
  }

  getCoachData() {
    return this.getCoachInfo;
  }

  setCoachData(coachInfo: RegistrationDetails) {
    this.getCoachInfo = coachInfo;
  }

  studentList(query:StudentData) {
    return this.fireStore.collection('studentDetails', ref => ref.where('coachId', '==', `${query.coachId}`).where("underAge", "==", `${query.underAge}`)).snapshotChanges();
  }

  getAllAcademy() {
    return this.fireStore.collection('coachDetails').snapshotChanges();
  }
}
