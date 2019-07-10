import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MenuService } from '../../service/menu.service';
import { Menu } from '../../model/menu';
import { Router } from '@angular/router';


@Component({
  templateUrl: 'menu.component.html'
})
export class MenuComponent implements OnInit{  
  menuForm: FormGroup;  
  menus: any = [];  
  totalItems: number = 1;
  currentPage = new FormControl(1);
  mode = new FormControl('new');
  search: string = '';
  
  constructor(public menuService: MenuService, private fb: FormBuilder, private router: Router) { 
    this.menuForm = fb.group(new Menu());    
  }
  
  ngOnInit() {
    this.selectMenu();
  }

  onSearchEnter(searchValue){
    this.search = searchValue;
    this.selectMenu();
  }

  selectMenu(){
    this.menuService.selectMenu(this.currentPage.value, this.search).subscribe(
      data => {
        this.menus = data.content;
        this.totalItems = data.totalElements;
      },
      error => {
        this.router.navigate(['/login']);
      }
    )
  }
  
  saveMenu(){    
    this.menuService.saveMenu(this.menuForm.value).subscribe(
      data => {
        alert(data);
        this.addNew();
        this.selectMenu();
      },
      error => {
        alert(error);
      }
    )
  }

  deleteMenu(){
    if(confirm('Apakah Anda yakin akan menghapus menu ini?')){
      this.menuService.deleteMenu(this.menuForm.controls['menuId'].value).subscribe(
        data => {
          alert(data);
          this.selectMenu();
        },
        error => {
          alert(error);
        }
      )
    }
  }

  showMenu(id: number){
    var menu = this.menus.find(x=> x.menuId == id);
    this.menuForm.patchValue(menu);
    this.mode.setValue('edit');
  }

  pageChanged(event: any): void {
    this.currentPage.setValue(event.page);
    this.selectMenu();
  }

  addNew(){
    this.menuForm.reset();
    this.mode.setValue('new');
  }
}
