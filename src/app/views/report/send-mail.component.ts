import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { ReportService } from '../../service/report.service';


@Component({
  templateUrl: 'send-mail.component.html'
})
export class SendMailComponent implements OnInit{  
  reportForm: FormGroup;  

  constructor(public reportService: ReportService, private fb: FormBuilder) { 
    this.reportForm = fb.group({
      startDate: '',
      endDate: ''
    });
  }
  
  ngOnInit() {
  }

  sendMail(){
    var startDate = new Date(this.reportForm.get('startDate').value).toDateString();
    var endDate = new Date(this.reportForm.get('endDate').value).toDateString();
    this.reportService.sendMail(startDate, endDate).subscribe(
      data => {
        // console.log(data);
        alert(data[0]);
      }
    )
  }
  
}
