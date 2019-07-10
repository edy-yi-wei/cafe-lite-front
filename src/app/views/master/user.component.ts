import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Role } from '../../model/role';
import { RoleService } from '../../service/role.service';
import { UserService } from '../../service/user.service';


@Component({
  templateUrl: 'user.component.html'
})
export class UserComponent implements OnInit{  
  userForm: FormGroup;  
  users: any = [];      
  totalItems: number = 1;
  currentPage = new FormControl(1);
  mode = new FormControl('new');
  search: string = '';
  roles: Role[] = [];
  
  constructor(public userService: UserService, public roleService: RoleService, private fb: FormBuilder) { 
    this.userForm = fb.group({
      userId: 0,
      userName: '',
      userPassword: '',
      role: fb.group(new Role())
    });
  }
  
  ngOnInit() {
    this.selectUser();
    this.selectRole();
  }

  onSearchEnter(searchValue){
    this.search = searchValue;
    this.selectUser();
  }

  selectRole(){
    this.roleService.selectRole(0, null).subscribe(
      data => {
        this.roles = data.content;        
      }
    )    
  }

  selectUser(){
    this.userService.selectUser(this.currentPage.value, this.search).subscribe(
      data => {
        this.users = data.content;
        this.totalItems = data.totalElements;
      }
    )
  }

  saveUser(){
    // console.log(this.userForm.value);
    this.userService.saveUser(this.userForm.value).subscribe(
      data => {
        alert(data);
        this.addNew();
        this.selectUser();
      },
      error => {
        alert(error);
      }
    )
  }

  deleteUser(){
    if(confirm('Apakah Anda yakin akan menghapus user terpilih?')){
      this.userService.deleteUser(this.userForm.controls['userId'].value).subscribe(
        data => {
          alert(data);
          this.selectUser();
        },
        error => {
          alert(error);
        }
      )
    }
  }

  showUser(id: number){
    var user = this.users.find(x=> x.userId == id);
    this.userForm.patchValue(user);
    this.mode.setValue('edit');
  }

  pageChanged(event: any): void {
    this.currentPage.setValue(event.page);
    this.selectUser();
  }

  addNew(){
    this.userForm.reset();
    this.mode.setValue('new');
  }
}
