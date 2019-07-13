import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { navItems } from '../../_nav';

@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  loginForm: FormGroup;   
  public navItems = navItems;

  constructor(public userService: UserService, private fb: FormBuilder, private router: Router) { 
    this.loginForm = fb.group({
      userName: '',
      userPassword: ''
    })
  }

  login() {
    var nama = this.loginForm.get('userName').value;
    var pass = this.loginForm.get('userPassword').value;
    if(nama==''){
      alert('Anda belum memasukkan nama');
      return;
    }
    if(pass==''){
      alert('Anda belum memasukkan password');
      return;
    }
    this.userService.login(nama, pass).subscribe(
      data => {
        // alert(data);
        sessionStorage.setItem('userName', nama);
        sessionStorage.setItem('userPassword', pass);
        // this.generateMenu(nama);
        // console.log(url);
        this.router.navigate(['/master/menu']);
      },
      error => {        
        alert("User name atau password Anda salah!");
      }
    )
  }

  generateMenu(userName) {
    this.resetNavMenu();
    var firstUrl='';
    this.userService.getRoleUser(userName).subscribe(
      data => {
        let role = data;
        role.moduleList.forEach(element => {
          for(let mn of this.navItems){
            if(mn.name == element.module.parentName){
              mn.children.push({
                name: element.module.moduleName,
                url: element.module.moduleUrl,
                icon: 'icon-star'
              });
              if(firstUrl==''){
                firstUrl = element.module.moduleUrl;
              }
              break;
            }
          }
        });
        this.router.navigate([firstUrl]);
      }
    )

    for (let mn of this.navItems) {
      console.log(mn.name);
      console.log(mn.children);
      var child = [];
      child = mn.children;
      console.log(child);
    }
  }

  resetNavMenu() {
    this.navItems.forEach(element => {
      while(element.children.length>0){
        element.children.pop();
      }
    })
  }
}