import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AngularFirestore } from '@angular/fire/compat/firestore';
import { StudentData, UserLogin } from './login/login.component';
import { RegistrationDetails } from './sign-up/sign-up.component';
import { StudentPerformance, ChessPerformance } from './student-performance/student-performance.component';
import { StudentDetails } from './student-form/student-form.component'; 
import { environment } from 'src/environments/environment';
import { CommonObject } from './constant';

@Injectable({
  providedIn: 'root'
})
export class KalamService {

  constructor(private fireStore: AngularFirestore, private http: HttpClient) { 
    let obj = (CommonObject as any)[environment.siteNameObj];
    this.siteName = obj.siteName ? `${obj.siteName}/` : "";
  }

  getCoachInfo: RegistrationDetails = {} as RegistrationDetails;
  //apiUrl: string = "https://kalam-nodemailer.onrender.com"
  sendEmailUrl: string = "https://us-central1-kalam-in.cloudfunctions.net/sendMailOverHTTP";
  sendEmailAttachementUrl: string = "https://us-central1-kalam-in.cloudfunctions.net/sendMailOverHTTPAttachment";
  getNewCoaches: any = [];
  getNewStudent: any = [];
  editStudentData: any = [];
  paidStudentList: any = [];
  getCoachesAttendance: any = [];
  siteName = "";

  convertToISO(dateString: string) {
    // Split the MM-DD-YYYY string into parts
    const [month, day, year] = dateString.split('-');

    // Rearrange to ISO format YYYY-MM-DD
    const isoDate = `${year}-${month}-${day}`;

    return isoDate;
  }

  

  generateUniqueId() {
    const now = new Date();
    const date = now.getFullYear().toString() + 
                 (now.getMonth() + 1).toString().padStart(2, '0') + 
                 now.getDate().toString().padStart(2, '0');
    const time = now.getHours().toString().padStart(2, '0') + 
                 now.getMinutes().toString().padStart(2, '0') + 
                 now.getSeconds().toString().padStart(2, '0') + 
                 now.getMilliseconds().toString().padStart(3, '0');
    const random = Math.floor(Math.random() * 100000); // Adding randomness for uniqueness
    
    return `${date}-${time}-${random}`;
  }

  resetAll() {
    this.getCoachesAttendance = [];
  }

  addChessPerformace(chessPerformance: ChessPerformance) {
    this.fireStore.collection(`${this.siteName}studentsPerformance`).add({...chessPerformance});
  }

  getStudentPerformance(kalamId: string) {
    return this.fireStore.collection(`${this.siteName}studentsPerformance`, ref => ref.where('kalamId', '==', `${kalamId}`)).snapshotChanges();
  }

  getAllApprovedStudent(coachId: any) {
    return this.fireStore.collection(`${this.siteName}studentDetails`, ref => ref.where('coachId', '==', `${coachId}`).where("approved", "==", true)).snapshotChanges();
  }

  getAllInactiveStudents(coachId: any) {
    return this.fireStore.collection(`${this.siteName}studentDetails`, ref => ref.where('coachId', '==', `${coachId}`).where("inActive", "==", true)).snapshotChanges();
  }

  getStudentDetails(coachId: any) {
    return this.fireStore.collection(`${this.siteName}studentDetails`, ref => ref.where('coachId', '==', `${coachId}`)).snapshotChanges();
  }

  setStudentDetails(list: StudentDetails) {
    this.fireStore.collection(`${this.siteName}studentDetails`).add({...list});
  }

  editStudentDetails(item: StudentDetails) {
    this.fireStore.doc(`${this.siteName}studentDetails/`+item.id).update(item);
  }

  editCoachDetails(item: RegistrationDetails) {
    this.fireStore.doc(`${this.siteName}coachDetails/`+item.id).update(item);
  }

  deleteStudentDetails(item: StudentDetails) {
    this.fireStore.doc(`${this.siteName}studentDetails/`+item.id).delete();
  }

  setCoachProfile(profile: RegistrationDetails) {
    this.fireStore.collection(`${this.siteName}coachDetails`).add({...profile});
  }

  loginDetails(query:UserLogin) {
    return this.fireStore.collection(`${this.siteName}coachDetails`, ref => ref.where('emailId', '==', `${query.username}`).where("password", "==", `${query.password}`)).snapshotChanges();
  }

  getCoachData() {
    let coachDetails: any = sessionStorage.getItem(`coachDetails`);
    if (coachDetails) {
        let coachProfile = JSON.parse(coachDetails)
        return coachProfile;
    }else {
      return null;
    }
  }

  setCoachData(coachInfo: RegistrationDetails) {
    this.getCoachInfo = coachInfo;
  }

  getNewCoachesList() {
    return this.getNewCoaches;
  }
  
  setNewCoachesList(coaches: any) {
    this.getNewCoaches = coaches;
  }

  getNewStudentsList() {
    return this.getNewStudent;
  }
  
  setNewStudentsList(students: any) {
    this.getNewStudent = students;
  }

  studentList(query:StudentData) {
    return this.fireStore.collection(`${this.siteName}studentDetails`, ref => ref.where('coachId', '==', `${query.coachId}`).where("underAge", "==", `${query.underAge}`).where("approved", "==", true).where("groundName", "==", `${query.groundName}`)).snapshotChanges();
  }

  studentListUnderAge(query:StudentData) {
    return this.fireStore.collection(`${this.siteName}studentDetails`, ref => ref.where('coachId', '==', `${query.coachId}`).where("underAge", "==", `${query.underAge}`).where("approved", "==", true)).snapshotChanges();
  }

  newStudentList(query:any) {
    return this.fireStore.collection(`${this.siteName}studentDetails`, ref => ref.where('coachId', '==', `${query.coachId}`).where("approved", "==", false)).snapshotChanges();
  }

  feesApprove(query:any) {
    return this.fireStore.collection(`${this.siteName}studentDetails`, ref => ref.where('coachId', '==', `${query.coachId}`).where("feesApproveWaiting", "==", true)).snapshotChanges();
  }

  getAllAcademy() {
    return this.fireStore.collection(`${this.siteName}coachDetails`).snapshotChanges();
  }

  addGroundDetails(ground: any) {
    this.fireStore.collection(`${this.siteName}groundDetails`).add({...ground});
  }

  getGroundDetails(academyId: any) {
    return this.fireStore.collection(`${this.siteName}groundDetails`, ref => ref.where('academyId', '==', `${academyId}`)).snapshotChanges();
  }

  getACoachAttendanceData(query:any, dateRange: any) {
    return this.fireStore.collection(`${this.siteName}coachAttendance`, ref => ref.where('academyId', '==', `${query.academyId}`)
    .where('inCoachId', '==', `${query.inCoachId}`)
    .where("activeDate", ">=", `${dateRange.start}`)
    .where("activeDate", "<=", `${dateRange.end}`)).snapshotChanges();
  }

  getAllCoachAttendanceData(query:any, dateRange: any) {
    return this.fireStore.collection(`${this.siteName}coachAttendance`, ref => ref.where('academyId', '==', `${query.academyId}`)
    .where("activeDate", ">=", `${dateRange.start}`)
    .where("activeDate", "<=", `${dateRange.end}`)).snapshotChanges();
  }

  coachAttendance(coachData: any) {
    this.fireStore.collection(`${this.siteName}coachAttendance`).add({...coachData});
  }

  getCoachAttendanceData(academyId: string | undefined) {
    return this.fireStore.collection(`${this.siteName}coachAttendance`, ref => ref.where('academyId', '==', `${academyId}`)).snapshotChanges();
  }

  getCurrentCoachIn(inCoachId: string | undefined, loginDate: string | undefined) {
    return this.fireStore.collection(`${this.siteName}coachAttendance`, ref => ref.where('inCoachId', '==', `${inCoachId}`).where("loginDate", "==", `${loginDate}`)).snapshotChanges();
  }

  getCurrentCoachOut(inCoachId: string | undefined, logoffDate: string | undefined) {
    return this.fireStore.collection(`${this.siteName}coachAttendance`, ref => ref.where('inCoachId', '==', `${inCoachId}`).where("logoffDate", "==", `${logoffDate}`)).snapshotChanges();
  }

  studentAttendance(stundent: any) {
    this.fireStore.collection(`${this.siteName}studentAttendance`).add({...stundent});
  }

  getStudentAttendanceData(academyId: string, loginDate: string) {
    return this.fireStore.collection(`${this.siteName}studentAttendance`, ref => ref.where('academyId', '==', `${academyId}`).where("loginDate", "==", `${loginDate}`)).snapshotChanges();
  }

  getAllStudentAttendanceData(academyId: string | undefined, ageType: string, groundName: string) {
    return this.fireStore.collection(`${this.siteName}studentAttendance`, ref => ref.where('academyId', '==', `${academyId}`).where("ageType", "==", `${ageType}`).where("groundName", "==", `${groundName}`)).snapshotChanges();
  }

  editStudentAttendance(item: any, id: string) {
    this.fireStore.doc(`${this.siteName}studentAttendance/`+id).update(item);
  }

  getAcademyCoaches(query:any) {
    return this.fireStore.collection(`${this.siteName}coachDetails`, ref => ref.where('academyId', '==', `${query.academyId}`)).snapshotChanges();
  }

  getHeadCoache(kalamId:any) {
    return this.fireStore.collection(`${this.siteName}coachDetails`, ref => ref.where('kalamId', '==', `${kalamId}`)).snapshotChanges();
  }

  approvedCoach(coach: any) {
    this.fireStore.doc(`${this.siteName}coachDetails/`+coach.id).update(coach);
  }

  deleteCoach(coach: any) {
    this.fireStore.doc(`${this.siteName}coachDetails/`+coach.id).delete();
  }

  approvedStudent(student: any) {
    this.fireStore.doc(`${this.siteName}studentDetails/`+student.id).update(student);
  }

  deleteStudent(student: any) {
    this.fireStore.doc(`${this.siteName}studentDetails/`+student.id).delete();
  }

  getAcademyAllStudentAttendanceData(academyId:string, dateRange: any) {
    return this.fireStore.collection(`${this.siteName}studentAttendance`, ref => ref.where('academyId', '==', `${academyId}`)
    .where("loginDate", ">=", `${dateRange.start}`)
    .where("loginDate", "<=", `${dateRange.end}`)).snapshotChanges();
  }

  getSingleStudentAttendanceData(query:StudentDetails, dateRange: any) {
    return this.fireStore.collection(`${this.siteName}studentAttendance`, ref => ref.where('kalamId', '==', `${query.kalamId}`)
    .where("name", "==", `${query.name}`)
    .where("loginDate", ">=", `${dateRange.start}`)
    .where("loginDate", "<=", `${dateRange.end}`)).snapshotChanges();
  }

  getStudentAttendanceByCoachDatewise(query:any) {
    return this.fireStore.collection(`${this.siteName}studentAttendance`, ref => ref.where('coachId', '==', `${query.inCoachId}`)
    .where("groundName", "==", `${query.groundName}`)
    .where("loginDate", "==", `${query.loginDate}`)).snapshotChanges();
  }

  getStudentAttendanceUpdate(query:any) {
    return this.fireStore.collection(`${this.siteName}studentAttendance`, ref => ref.where('coachId', '==', `${query.coachId}`)
    .where("name", "==", `${query.name}`)
    .where("kalamId", "==", `${query.kalamId}`)
    .where("loginDate", "==", `${query.loginDate}`)).snapshotChanges();
  }

  getStudentAttendanceUpdateEvening(query:any) {
    return this.fireStore.collection(`${this.siteName}studentAttendance`, ref => ref.where('coachId', '==', `${query.coachId}`)
    .where("name", "==", `${query.name}`)
    .where("kalamId", "==", `${query.kalamId}`)
    .where("evening", "==", true)
    .where("loginDate", "==", `${query.loginDate}`)).snapshotChanges();
  }

  deleteStudentAttendance(id: string) {
    this.fireStore.doc(`${this.siteName}studentAttendance/`+id).delete();
  }

  sendEmailer(request: any) {
    return this.http.post(this.sendEmailUrl, request);
  }

  sendEmailAttachement(request: any) {
    return this.http.post(this.sendEmailAttachementUrl, request);
  }

  deleteCoachesAttendance(id: string) {
    this.fireStore.doc(`${this.siteName}coachAttendance/`+id).delete();
  }

  // studentListScholar(query:StudentData) {
  //   return this.fireStore.collection(`${this.siteName}studentDetails`, ref => ref.where('coachId', '==', `${query.coachId}`).where("underAge", query.underAge !== 'all' ? "==" : "!=", `${query.underAge}`).where("approved", "==", true)
  //   .where("groundName", query.groundName !== 'all' ? "==" : "!=", `${query.groundName}`)
  //   .where("scholarship", query.scholarshipType !== 'no' ? "in" : "not-in", `${query.groundName}`)).snapshotChanges();
  // }

  getLocationAddress(data:any) {
   
    let params = `geocode/v1/json?q=${data.coords.latitude},${data.coords.longitude}&key=${environment.mapAuth}`;
    return this.http.get(environment.mapUrl+params);
  }

  // getAllStudents(coachId:string) {
  //   return this.fireStore.collection(`${this.siteName}studentDetails`, ref => ref.where('coachId', '==', `${coachId}`)).snapshotChanges();
  // }
}
