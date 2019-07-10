import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { ReportService } from '../../service/report.service';


@Component({
  templateUrl: 'sold-menu-report.component.html'
})
export class SoldMenuReportComponent implements OnInit{  
  reportForm: FormGroup;  
  menus: any = [];  
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

  selectSoldMenu(){
    var startDate = new Date(this.reportForm.get('startDate').value).toDateString();
    // console.log(startDate);
    var endDate = new Date(this.reportForm.get('endDate').value).toDateString();
    this.reportService.selectSoldMenu(startDate, endDate, this.currentPage.value).subscribe(
      data => {
        // console.log(data);
        if(data[0]!=null){
          this.menus = data[0];          
        } else {
          this.menus = [];
        }
      }
    )
  }
  
  pageChanged(event: any): void {
    this.currentPage.setValue(event.page);
    this.selectSoldMenu();
  }
  
}
