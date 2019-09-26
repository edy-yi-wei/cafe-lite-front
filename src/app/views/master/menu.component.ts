import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MenuService } from '../../service/menu.service';
import { Menu } from '../../model/menu';
import { Router } from '@angular/router';
import { Material } from '../../model/material';
import { MaterialService } from '../../service/material.service';


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
  list_material: Material[] = [];
  currentMaterialPage = new FormControl(1);
  totalMaterials: number = 1;
  
  constructor(public menuService: MenuService, public materialService: MaterialService, private fb: FormBuilder, private router: Router) { 
    this.menuForm = fb.group(new Menu());    
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

  addMaterial(materialId) {
    // let rows = this.adjustmentForm.get("adjustment_details") as FormArray;
    // let is_exist = false;

    // for (var i = 0; i < rows.length; i++) {
    //   var form = (this.adjustmentForm.get("adjustment_details") as FormArray).controls[i];
    //   var mat = form.get("material").value;
    //   if (mat.materialId == materialId) {
    //     is_exist = true;
    //     break;
    //   }
    // }

    // if (!is_exist) {

    //   var adjustment_detail = new AdjustmentDetail();
    //   var material = new Material();
    //   material = this.list_material.find(x => x.materialId == materialId);
    //   adjustment_detail.material = material;

    //   var detail = this.fb.group(adjustment_detail);


    //   rows.push(detail);

    // } else {
    //   alert("Material sudah dipilih");
    // }

  }

  onModalShow() {
    this.filterListMaterial();
  }

  filterListMaterial() {
    // let rows = this.adjustmentForm.get("adjustment_details") as FormArray;
    // for (var i = 0; i < this.list_material.length; i++) {
    //   var material = this.list_material[i];
    //   var matExist = rows.value.find(x => x.material.materialId == material.materialId);
    //   if (matExist) {
    //     this.list_material[i].deleted = true;
    //     // var temp_list = this.list_material.filter(x => x.materialId !== matExist.material.materialId);
    //     // this.list_material = [];
    //     // this.list_material = temp_list;
    //   } else {
    //     this.list_material[i].deleted = false;
    //   }
    // }
  }

  deleteMaterial(index) {
    if (confirm("Apakah Anda yakin akan menghapus baris " + (index + 1))) {
      // (this.adjustmentForm.get("adjustment_details") as FormArray).removeAt(index);
    }
  }

  searchMaterial(searchValue) {
    this.search = searchValue;
    this.getMaterial();
  }


  getMaterial() {
    this.list_material = [];

    this.materialService.selectMaterial(this.currentMaterialPage.value, this.search).subscribe(
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
}
