import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { ReportService } from '../../service/report.service';


@Component({
  templateUrl: 'purchasing-report.component.html'
})
export class PurchasingReportComponent implements OnInit{  
  reportForm: FormGroup;  
  purchasings: any = [];  
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

  generateReport(){
    var startDate = new Date(this.reportForm.get('startDate').value).toDateString();
    var endDate = new Date(this.reportForm.get('endDate').value).toDateString();
    this.reportService.selectPurchasing(startDate, endDate, this.currentPage.value).subscribe(
      data => {
        this.purchasings = data.content;
        this.totalItems = data.totalElements;
      }
    )
  }
  
  pageChanged(event: any): void {
    this.currentPage.setValue(event.page);
    this.generateReport();
  }
  
}
