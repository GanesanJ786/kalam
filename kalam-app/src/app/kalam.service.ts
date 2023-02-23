import { Injectable } from '@angular/core';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { StudentDetails } from './student-form/student-form.component'; 

@Injectable({
  providedIn: 'root'
})
export class KalamService {

  constructor(private fireStore: AngularFirestore) { }

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
}
