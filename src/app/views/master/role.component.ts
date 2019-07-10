import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { ModuleService } from '../../service/module.service';
import { Module } from '../../model/module';
import { RoleService } from '../../service/role.service'; 


@Component({
  templateUrl: 'role.component.html'
})
export class RoleComponent implements OnInit{  
  roleForm: FormGroup;  
  moduleForm: FormGroup;
  listModul: FormArray;
  roles: any = [];  
  totalItems: number = 1;
  currentPage = new FormControl(1);
  mode = new FormControl('new');
  search: string = '';
  modules: Module[] = [];
  
  constructor(public roleService: RoleService, public moduleService: ModuleService, private fb: FormBuilder) { 
    this.roleForm = fb.group({
      roleId: 0,
      roleName: '',
      notes: '',
      moduleList: fb.array([])
    });
    this.moduleForm = fb.group({moduleList: fb.array([])});
  }
  
  ngOnInit() {
    this.selectRole();
    this.selectModule();
  }

  onSearchEnter(searchValue){
    this.search = searchValue;
    this.selectRole();
  }

  createModule(data: Module) {
    return this.fb.group({
      moduleId: data.moduleId,
      moduleName: data.moduleName,
      readOnly: false,
      active: false
    });
  }

  createSavedModule(data: any){
    return this.fb.group({
      module: this.fb.group({
        moduleId: data.get('moduleId')
      }),
      readOnly: data.get('readOnly'),
      active: data.get('active')
    });
  }

  selectRole(){
    this.roleService.selectRole(this.currentPage.value, this.search).subscribe(
      data => {
        console.log(data.content);
        this.roles = data.content;
        this.totalItems = data.totalElements;
      }
    )
  }

  selectModule() {
    this.moduleService.selectModule(0, null).subscribe(
      data => {
        this.modules = data.content;        
        if(this.modules!=null){
          this.listModul = this.moduleForm.get('moduleList') as FormArray;
          while(this.listModul.length!=0){
            this.listModul.removeAt(0);
          }
          this.modules.forEach(element => {
            this.listModul.push(this.createModule(element));
          });
        }
      }
    )
  }

  saveRole(){    
    this.listModul = this.moduleForm.get('moduleList') as FormArray;
    var mList = this.roleForm.get('moduleList') as FormArray;    
    while(mList!=null && mList.length!=0){
      mList.removeAt(0);
    }    
    if(this.listModul!=null){
      for(let m of this.listModul.controls){
        var aktif = m.get('active').value;
        if(aktif==true){
          mList.push(this.createSavedModule(m));
        }
      }
    }
    this.roleService.saveRole(this.roleForm.value).subscribe(
      data => {
        alert(data);
        this.addNew();
        this.selectRole();
      },
      error => {
        alert(error);
      }
    )
  }

  deleteRole(){
    if(confirm('Apakah Anda yakin akan menghapus role terpilih?')){
      this.roleService.deleteRole(this.roleForm.controls['roleId'].value).subscribe(
        data => {
          alert(data);
          this.selectRole();
        },
        error => {
          alert(error);
        }
      )
    }
  }

  showRole(id: number){
    // var role = this.roles.find(x=> x.roleId == id);
    this.clearCheckboxes();
    var role = this.roleService.getRole(id).subscribe(
      data => {
        console.log(data);
        this.roleForm.patchValue(data);
        if(data.moduleList!=null){
          this.listModul = this.moduleForm.get('moduleList') as FormArray;
          for(let element of data.moduleList){
            for(let m of this.listModul.controls){            
            // data.moduleList.forEach(element => {
              // console.log(element.module.moduleId + " - " + m.get('moduleId').value);
              if(element.module.moduleId==m.get('moduleId').value){
                m.get('readOnly').setValue(element.readOnly);
                m.get('active').setValue(element.active);
                break;
              }
            }
          }          
        }
      }
    )    
    this.mode.setValue('edit');
  }

  pageChanged(event: any): void {
    this.currentPage.setValue(event.page);
    this.selectRole();
  }

  addNew(){
    this.roleForm.get('roleId').setValue(0);
    this.roleForm.get('roleName').setValue('');
    this.roleForm.get('notes').setValue('');
    this.listModul = this.roleForm.get('moduleList') as FormArray;
    while(this.listModul.length!=0){
      this.listModul.removeAt(0);
    }
    this.clearCheckboxes();
    this.mode.setValue('new');
  }

  clearCheckboxes(){
    var mList = this.moduleForm.get('moduleList') as FormArray;
    for(let m of mList.controls){
      m.get('readOnly').setValue(false);
      m.get('active').setValue(false);
    }
  }
}
