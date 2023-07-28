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

  excelHeaderRow = ["Coach Name", "Ground Name", "Login Date", "Login Time", "LogOff Data & Time", "Topics", "Notes", "Login Address", "Logout Address"]

  // End Excel

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
  }

  reset() {
    this.idle.watch();
    this.idleState = 'Started.';
    this.timedOut = false;
  }

  exportToExcel() {
    let coachView = [];
    let stopLoop = false;
    const query = {
      academyId: `718906821407`,
      inCoachId: "216038235025"
    }
    const dateRange = {
      start: "06-01-2023",
      end: "06-30-2023"
    }

    
      this.kalamService.getAllCoachAttendanceData(query, dateRange).subscribe((coach: any) => {
        if(!stopLoop) {
          let coachData = coach.map((document: any) => {
            return {
              id: document.payload.doc.id,
              ...document.payload.doc.data() as {}
            }
          });
    
          let sortCoach = _.sortBy(coachData, ["loginDate", "loginTime", "groundName"]);
          let inCoach = sortCoach.filter((v: any) => v.status == "IN");
          let outCoach = sortCoach.filter((v: any) => v.status == "OUT");
          let leaveData = sortCoach.filter((v: any) => v.status == "LEAVE");
          outCoach = _.sortBy(outCoach, ["logoffDate", "logoffTime", "groundName"]);
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
            coachView = _.sortBy(inCoach, ["loginDate"]);
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
          coachData.forEach((val:any) => {
            this.kalamService.deleteCoachesAttendance(val.id);
          })
          stopLoop = true; 
        }
      });
    
  }
}
