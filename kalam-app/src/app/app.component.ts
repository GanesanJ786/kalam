import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';
import { KalamService } from './kalam.service';
import { ExportToExcelService } from './export-to-excel.service';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'kalam-app';
  name = 'Kalam';
  idleState = 'Not started.';
  timedOut = false;
  lastPing?: any = null;

  // Export Excel

  dataForExcel: any = {};
  excelDate: string[];
  excelHeaderRow = ["Coach Name", "Ground Name", "Login Date", "Login Time", "LogOff Data & Time", "Topics", "Notes", "Login Address", "Logout Address"]
  excelStudentRow = ["Name"];
  
  // End Excel

  get attendanceExpEnable(): boolean{
    return this.kalamService.getCoachData()?.kalamId == "123456789123"
  }

  constructor(private idle: Idle, public ete: ExportToExcelService, private keepalive: Keepalive, private router: Router, private kalamService: KalamService) {
    // sets an idle timeout of 30 seconds, for testing purposes.
    idle.setIdle(7200);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    idle.setTimeout(5);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => this.idleState = 'No longer idle.');
    idle.onTimeout.subscribe(() => {
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.router.navigate([`/login`]);
      sessionStorage.removeItem("coachDetails");
      this.kalamService.resetAll();
    });
    idle.onIdleStart.subscribe(() => this.idleState = 'You\'ve gone idle!');
    idle.onTimeoutWarning.subscribe((countdown) => this.idleState = 'You will time out in ' + countdown + ' seconds!');

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.reset();
    let lastDateOfPreMonth = +moment().subtract(1,'months').endOf('month').format('DD')+1;
    this.excelDate = [...Array(lastDateOfPreMonth).keys()].slice(1).map(String);
    //console.log(moment().subtract(1,'months').startOf('month').format('MM-DD-YYYY'));
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  getAllStudentAttendance() {
    // const dateRange = {
    //   start: "03-01-2024",
    //   end: "03-31-2024"
    // }

    const dateRange = {
      start: moment().subtract(1,'months').startOf('month').format('MM-DD-YYYY'),
      end: moment().subtract(1,'months').endOf('month').format('MM-DD-YYYY')
    }

    this.kalamService.getAcademyAllStudentAttendanceData("718906821407", dateRange).subscribe((res: any) => {
      let data = res.map((document: any) => {
        return {
          id: document.payload.doc.id,
          ...document.payload.doc.data() as {}
        }
      });
      
      data = _.sortBy(data, ["name"]);
      const result = _.groupBy(data, 'name');
      console.log(result);

      let objFinal: any = [];
      let obj:any = [];
      Object.values(result).forEach((res: any) => {
        res = _.uniqBy(res, (lD:any) => lD.loginDate);
        obj = [res[0].name];
        this.excelDate.forEach((dateVal: any) => {
          let dateObj = res.filter((ddV:any) => dateVal == moment(ddV.loginDate).date() && ddV.status == "IN");
          if(!!dateObj.length) {
            obj.push(dateObj[0].groundName);
          }else{
            obj.push("");
          }
        });
        objFinal.push(obj);
      });

      console.log(objFinal)
  
      let reportData = {
        title: `Students Attendance Report - ${moment(dateRange.start, 'MM/DD/YYYY').format("MMM YYYY")}`,
        data: objFinal,
        headers: this.excelStudentRow.concat(this.excelDate),
        dateRange: `${dateRange.start} - ${dateRange.end}`
      }
  
      this.ete.exportStudentExcel(reportData, this.excelDate);
    
    });
  }

  exportToExcel() {
    let coachView = [];
    let stopLoop = false;
    const query = {
      academyId: `718906821407`,
      inCoachId: "216038235025"
    }
    // const dateRange = {
    //   start: "03-01-2024",
    //   end: "03-31-2024"
    // }

    const dateRange = {
      start: moment().subtract(1,'months').startOf('month').format('MM-DD-YYYY'),
      end: moment().subtract(1,'months').endOf('month').format('MM-DD-YYYY')
    }

    
      this.kalamService.getAllCoachAttendanceData(query, dateRange).subscribe((coach: any) => {
        if(!stopLoop) {
          let coachData = coach.map((document: any) => {
            return {
              id: document.payload.doc.id,
              ...document.payload.doc.data() as {}
            }
          });
    
          let sortCoach = _.sortBy(coachData, ["coachName","inCoachId","loginDate", "loginTime", "groundName"]);
          let inCoach = sortCoach.filter((v: any) => v.status == "IN");
          let outCoach = sortCoach.filter((v: any) => v.status == "OUT");
          let leaveData = sortCoach.filter((v: any) => v.status == "LEAVE");
          outCoach = _.sortBy(outCoach, ["coachName","inCoachId","logoffDate", "logoffTime", "groundName"]);
          outCoach.forEach(r => r.matched = false);
          inCoach.forEach((inC: any, i: any) => {
            let outCoachData = outCoach.find(r => r.logoffDate == inC.loginDate && !r.matched);
            if (outCoachData) {
              inC.logOffDataTime = `${outCoachData.logoffDate} ${outCoachData.logoffTime}`;
              inC.logoutAddress = outCoachData.logoutAddress ? outCoachData.logoutAddress : null;
              inC.notes = outCoachData.notes;
              outCoachData.matched = true;
            } else {
              inC.logOffDataTime = "-"
              inC.logoutAddress = null;
            }
          });
          if (leaveData.length > 0) {
            inCoach = inCoach.concat(leaveData);
            coachView = _.sortBy(inCoach, ["coachName","inCoachId","loginDate"]);
          } else {
            coachView = inCoach;
          }
    
          const result = _.groupBy(coachView, 'coachName');
         
          for (let [k, val] of Object.entries(result)) {
            let objItem:any = []
            val.forEach((row: any) => {
              let obj = {
                coachName: row.coachName,
                groundName: row.groundName,
                loginDate: row.loginDate,
                loginTime: row.loginTime,
                logOffDataTime: row.logOffDataTime,
                topics: row.topics,
                notes: row.notes,
                loginAddress: row.loginAddress,
                logoutAddress: row.logoutAddress
              }
              objItem.push(Object.values(obj))
            })
            this.dataForExcel[k] = objItem;
          }
    
          //console.log(this.dataForExcel);
    
    
          let reportData = {
            title: `Coaches Attendance Report - ${moment(dateRange.start, 'MM/DD/YYYY').format("MMM YYYY")}`,
            data: this.dataForExcel,
            headers: this.excelHeaderRow,
            dateRange: `${dateRange.start} - ${dateRange.end}`
          }
    
          this.ete.exportExcel(reportData);
          console.log(coachData)
          // coachData.forEach((val:any) => {
          //   this.kalamService.deleteCoachesAttendance(val.id);
          // })
          stopLoop = true; 
        }
      });
    
  }
}
