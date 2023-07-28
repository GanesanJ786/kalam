import { Injectable } from '@angular/core';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { Logo } from './constant';
import { KalamService } from './kalam.service';

@Injectable({
  providedIn: 'root'
})
export class ExportToExcelService {

  constructor(private kalamService: KalamService) { }

  exportExcel(excelData: any) {

    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers
    const dataObj = excelData.data;
    const logo = Logo.logoUrl;
    const dateRange = excelData.dateRange;

    //Create a workbook with a worksheet
    let workbook = new Workbook();
    for (let [k, val] of Object.entries(dataObj)) {
      let data: any;
      data = val;
      let worksheet = workbook.addWorksheet(`${k}`);


      //Add Row and formatting
      worksheet.mergeCells('A1', 'F4');
      let titleRow = worksheet.getCell('C1');
      titleRow.value = title
      titleRow.font = {
        name: 'Calibri',
        size: 16,
        underline: 'single',
        bold: true,
        color: { argb: '0085A3' }
      }
      titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

      // Date
      worksheet.mergeCells('G1:I4');
      let d = new Date();
      let date = dateRange;
      let dateCell = worksheet.getCell('G1');
      dateCell.value = date;
      dateCell.font = {
        name: 'Calibri',
        size: 12,
        bold: true
      }
      dateCell.alignment = { vertical: 'middle', horizontal: 'center' }

      //Add Image
      // let myLogoImage = workbook.addImage({
      //   base64: logo,
      //   extension: 'png',
      // });
      // worksheet.mergeCells('A1:B4');
      // worksheet.addImage(myLogoImage, 'A1:B4');

      //Blank Row 
      worksheet.addRow([]);

      //Adding Header Row
      let headerRow = worksheet.addRow(header);
      headerRow.eachCell((cell, number) => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '4167B8' },
          bgColor: { argb: '' }
        }
        cell.font = {
          bold: true,
          color: { argb: 'FFFFFF' },
          size: 12
        }
      })

      // Adding Data with Conditional Formatting
      data.forEach((d: any) => {
        let row = worksheet.addRow(d);

        let sales: any = row.getCell(4);
        let color = 'FF99FF99';
        if (sales.value == "") {
          color = 'FF9999'
        }

        sales.fill = {

          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: color }
        }

      }
      );
      worksheet.getColumn(1).width = 20;
      worksheet.getColumn(2).width = 20;
      worksheet.getColumn(3).width = 20;
      worksheet.getColumn(4).width = 20;
      worksheet.getColumn(5).width = 20;
      worksheet.getColumn(6).width = 35;
      worksheet.getColumn(7).width = 35;
      worksheet.getColumn(8).width = 60;
      worksheet.getColumn(9).width = 60;
      worksheet.addRow([]);

      //Footer Row
      // let footerRow = worksheet.addRow(['Employee Sales Report Generated from example.com at ' + date]);
      // footerRow.getCell(1).fill = {
      //   type: 'pattern',
      //   pattern: 'solid',
      //   fgColor: { argb: 'FFB050' }
      // };

      // //Merge Cells
      // worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

    }



    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      // const request = {
      //   "to": `ganedhara786@gmail.com`,
      //   "subject": "Coaches attendance list",
      //   "ownerName": `Ganesan`,
      //   "buffer": `${data}`,
      //   "filename": "CoachesAttendanceList.xlsx"
      // }
      // this.kalamService.sendEmailAttachement(request).subscribe((res:any) => {
      //   console.log("email sent to the owner");
      // })
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    })

    

  }
}
