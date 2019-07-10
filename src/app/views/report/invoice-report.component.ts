import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { ReportService } from '../../service/report.service';


@Component({
  templateUrl: 'invoice-report.component.html'
})
export class InvoiceReportComponent implements OnInit{  
  reportForm: FormGroup;  
  invoices: any = [];  
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

  selectInvoice(){
    var startDate = new Date(this.reportForm.get('startDate').value).toDateString();
    var endDate = new Date(this.reportForm.get('endDate').value).toDateString();
    this.reportService.selectInvoice(startDate, endDate, this.currentPage.value).subscribe(
      data => {
        console.log(data);
        if(data[0]!=null){
          this.invoices = data[0].content;
          this.totalItems = data[0].totalElements;
          this.total = data[1];
        } else {
          this.invoices = [];
          this.totalItems = 0;
          this.total = 0;
        }
      }
    )
  }
  
  pageChanged(event: any): void {
    this.currentPage.setValue(event.page);
    this.selectInvoice();
  }
  
}
