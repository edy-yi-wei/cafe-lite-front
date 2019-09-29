import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MaterialService } from '../../service/material.service';


@Component({
  templateUrl: 'stock-report.component.html'
})
export class StockReportComponent implements OnInit{  
  stocks: any = [];  
  totalItems: number = 1;
  currentPage = new FormControl(1);
  mode = new FormControl('new');
  search: string = '';
  total: number = 0;

  constructor(public materialService: MaterialService, private fb: FormBuilder) { 
  }
  
  ngOnInit() {
    this.generateReport();
  }

  generateReport(){
    this.materialService.selectStock(this.currentPage.value, this.search).subscribe(
      data => {
        this.stocks = data.content;
        this.totalItems = data.totalElements;
      },
      error => {
        alert(error);
      }
    )
  }
  
  pageChanged(event: any): void {
    this.currentPage.setValue(event.page);
    this.generateReport();
  }
  
}
