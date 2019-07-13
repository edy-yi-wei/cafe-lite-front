import { Component, OnDestroy, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { navItems } from '../../_nav';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnInit, OnDestroy {
  public navItems = [];
  public tempNavItems = [];
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  loginUser = sessionStorage.getItem('userName');

  constructor(public userService: UserService, private router: Router, private route: ActivatedRoute, @Inject(DOCUMENT) _document?: any) {
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });

  }

  ngOnInit() {
    // this.internetChecker();
    this.generateMenu(this.loginUser);
  }
  

  generateMenu(userName) {
    var firstUrl = '';
    this.resetNavMenu();
    /*
    hack explanation
    set navItems to temporary object.
    clear navItems, then give a delay to re-set navItems object from temporary object.
    voilla!
    */
    this.tempNavItems = navItems;
    this.userService.getRoleUser(userName).subscribe(
      data => {
        let role = data;
        for (let mn of this.tempNavItems) {
          role.moduleList.forEach(element => {
            if (mn.name == element.module.parentName) {
              mn.children.push({
                name: element.module.moduleName,
                url: element.module.moduleUrl,
                icon: 'icon-star'
              });
              if (firstUrl == '') {
                firstUrl = element.module.moduleUrl;
              }
            }
          });
          
        }

        this.router.navigate([firstUrl]);
        
      }
    );
    //clear
    this.navItems = [];
    //re-assign
    setTimeout(() => {
      this.navItems = this.tempNavItems;
    }, 10);

    setTimeout(() => {
      if (this.navItems.length == 0) {
        this.logout();
      }
    }, 1000);

    
  }

  resetNavMenu() {
    this.navItems.forEach(element => {
      while(element.children.length>0){
        element.children.pop();
      }
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
  }

  changePassword(){
    
  }

  logout() {    
    this.userService.logout().subscribe(
      data => {
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userPassword');
        this.router.navigate(['/login']);
      },
      error => {        
        alert(error);
      }
    )    
    // location.reload();
  }

  private baseUrl = 'http://localhost:8080/cafelite';
  private isOnline = false;

  onlineCheck() {
    let xhr = new XMLHttpRequest();
    return new Promise((resolve, reject) => {
      xhr.onload = () => {
        // Set online status
        this.isOnline = true;
        resolve(true);
      };
      xhr.onerror = () => {
        // Set online status
        this.isOnline = false;
        reject(false);
      };
      xhr.open('GET', this.baseUrl, true);
      xhr.send();
    });
  }

  internetChecker() {
    this.onlineCheck().then(() => {
      // Has internet connection, carry on 
      this.generateMenu(this.loginUser);
    }).catch(() => {
      // Has no internet connection, let the user know
      alert('Sorry, cannot connect to server.');
      this.router.navigate(['/login']);
    });
  }

  
}
