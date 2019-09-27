import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MenuService } from '../../service/menu.service';
import { Menu } from '../../model/menu';
import { Router } from '@angular/router';
import { Material } from '../../model/material';
import { MaterialService } from '../../service/material.service';
import { MenuMaterial } from '../../model/menu-material';


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
  materialFormArray: FormArray = new FormArray([]);
  list_material: Material[] = [];
  currentMaterialPage = new FormControl(1);
  totalMaterials: number = 1;
  
  constructor(public menuService: MenuService, public materialService: MaterialService, private fb: FormBuilder, private router: Router) { 
    this.menuForm = fb.group(new Menu());    

    this.materialFormArray = fb.array([]);
  }
  
  ngOnInit() {
    this.selectMenu();
    this.getMaterial();
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
    
    let detail = this.materialFormArray.value;
    this.menuForm.controls['materials'].setValue(detail);
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
    let menu = this.menus.find(x=> x.menuId == id);
    this.menuForm.patchValue(menu);
    this.mode.setValue('edit');
    this.resetMaterial();

    for (let element of menu.materials) {
      this.materialFormArray.push(this.fb.group(element));
    }
  }

  pageChanged(event: any): void {
    this.currentPage.setValue(event.page);
    this.selectMenu();
  }

  addNew(){
    this.menuForm.reset();
    this.mode.setValue('new');
    this.resetMaterial();
  }

  addMaterial(materialId) {
    let rows = this.materialFormArray as FormArray;
    let is_exist = false;

    for (var i = 0; i < rows.length; i++) {
      let material = new Material();
      material = rows.controls[i].value.material;
      if (material.materialId == materialId) {
        is_exist = true;
        break;
      }
    }

    if (!is_exist) {

      let menuMaterial = new MenuMaterial();
      let material = new Material();
      material = this.list_material.find(x => x.materialId == materialId);
      menuMaterial.material = material;
      let detail = this.fb.group(menuMaterial);

      
      rows.push(detail);
      


    } else {
      alert("Material sudah dipilih");
    }

  }

  onModalShow() {
    this.filterListMaterial();
  }

  filterListMaterial() {
    let rows = this.materialFormArray as FormArray;
    let materials: MenuMaterial[];
    materials = rows.value;
    for (var i = 0; i < this.list_material.length; i++) {
      let mat = this.list_material[i];
      let matExist = materials.find(x => x.material.materialId == mat.materialId);
      if (matExist) {
        this.list_material[i].deleted = true;
      } else {
        this.list_material[i].deleted = false;
      }
    }
  }

  deleteMaterial(index) {
    if (confirm("Apakah Anda yakin akan menghapus baris " + (index + 1))) {
      (this.materialFormArray as FormArray).removeAt(index);
    }
  }

  searchMaterial(searchValue) {
    this.search = searchValue;
    this.getMaterial();
  }


  getMaterial() {
    this.list_material = [];

    this.materialService.selectStockable(true, this.currentMaterialPage.value, this.search).subscribe(
      data => {
        this.list_material = data.content;
        this.totalMaterials = data.totalElements;

        this.filterListMaterial();

      },
      error => {
        alert(error);
      }
    )
  }

  chooseMaterial(value) {
    this.addMaterial(value);
    this.filterListMaterial();
  }

  resetMaterial() {
    let rows = this.materialFormArray as FormArray;
    while (rows != null && rows.length != 0) {
      (this.materialFormArray).removeAt(0);
    }
  }
}
