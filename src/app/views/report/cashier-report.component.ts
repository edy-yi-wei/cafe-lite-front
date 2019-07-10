import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { ReportService } from '../../service/report.service';


@Component({
  templateUrl: 'cashier-report.component.html'
})
export class CashierReportComponent implements OnInit{  
  reportForm: FormGroup;  
  sessions: any = [];  
  totalItems: number = 1;
  currentPage = new FormControl(1);
  mode = new FormControl('new');
  search: string = '';
  total: number = 0;

  constructor(public reportService: ReportService, private fb: FormBuilder) { 
    this.reportForm = fb.group({
      startDate: '',
      endDate: ''
    });
  }
  
  ngOnInit() {
  }

  selectSession(){
    var startDate = new Date(this.reportForm.get('startDate').value).toDateString();
    // console.log(startDate);
    var endDate = new Date(this.reportForm.get('endDate').value).toDateString();
    this.reportService.selectCashierSession(startDate, endDate, this.currentPage.value).subscribe(
      data => {
        console.log(data);
        if(data[0]!=null){
          this.sessions = data[0].content;
          this.totalItems = data[0].totalElements;
          this.total = data[1];
        } else {
          this.sessions = [];
          this.totalItems = 0;
          this.total = 0;
        }
      }
    )
  }
  
  pageChanged(event: any): void {
    this.currentPage.setValue(event.page);
    this.selectSession();
  }
  
}
