import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { ModuleService } from '../../service/module.service';
import { Module } from '../../model/module';


@Component({
  templateUrl: 'module.component.html'
})
export class ModuleComponent implements OnInit{  
  moduleForm: FormGroup;  
  modules: any = [];    
  totalItems: number = 1;
  currentPage = new FormControl(1);
  mode = new FormControl('new');
  search: string = '';

  constructor(public moduleService: ModuleService, private fb: FormBuilder) { 
    this.moduleForm = fb.group(new Module());
  }
  
  ngOnInit() {
    this.selectModule();

  }

  onSearchEnter(searchValue){
    this.search = searchValue;
    this.selectModule();
  }

  selectModule(){
    this.moduleService.selectModule(this.currentPage.value, this.search).subscribe(
      data => {
        // console.log(data);
        this.modules = data.content;        
        this.totalItems = data.totalElements;
      }
    )

  }

  saveModule(){
    // console.log(this.moduleForm.value);
    this.moduleService.saveModule(this.moduleForm.value).subscribe(
      data => {
        alert(data);
        this.addNew();
        this.selectModule();
      },
      error => {
        alert(error);
      }
    )
  }

  deleteModule(){
    if(confirm('Apakah Anda yakin akan menghapus modul terpilih?')){
      this.moduleService.deleteModule(this.moduleForm.controls['moduleId'].value).subscribe(
        data => {
          alert(data);
          this.selectModule();
        },
        error => {
          alert(error);
        }
      )
    }
  }

  showModule(id: number){
    var module = this.modules.find(x=> x.moduleId == id);
    this.moduleForm.patchValue(module);
    this.mode.setValue('edit');
  }

  pageChanged(event: any): void {
    this.currentPage.setValue(event.page);
    this.selectModule();
  }

  addNew(){
    this.moduleForm.reset();
    this.mode.setValue('new');
  }
}
