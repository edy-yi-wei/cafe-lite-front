import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { PurchasingService } from '../../service/purchasing.service';
import { Router } from '@angular/router';
import { MaterialService } from '../../service/material.service';
import { Material } from '../../model/material';
import { SupplierService } from '../../service/supplier.service';
import { Supplier } from '../../model/supplier';
import { PurchasingDetail } from '../../model/purchasing-detail';
import { Purchasing } from '../../model/purchasing';


@Component({
  templateUrl: 'purchasing.component.html'
})
export class PurchasingComponent implements OnInit {
  purchasingForm: FormGroup;
  // details: FormArray = new FormArray([]);
  totalMaterials: number = 1;
  currentMaterialPage = new FormControl(1);
  mode = new FormControl('new');
  search: string = '';
  list_material: Material[] = [];
  list_supplier: Supplier[] = [];

  constructor(public purchasingService: PurchasingService, public materialService: MaterialService, public supplierService: SupplierService,
    private fb: FormBuilder, private router: Router) {

    this.purchasingForm = this.fb.group({
      purchasing: this.fb.group(new Purchasing()),
      supplier: this.fb.group(new Supplier()),
      purchasing_details: fb.array([])
    });

  }

  ngOnInit() {
    this.getSupplier();
    this.getMaterial();
    var supplier = this.purchasingForm.get("supplier");
    supplier.get("address").disable();
    supplier.get("phone").disable();
    

  }

  addNew(){
    if (confirm("Apakah Anda yakin akan membatalkan semua pembelian?")) {
      this.resetForm();
    }
  }

  getSupplier() {
    this.list_supplier = [];
    this.supplierService.selectSupplier(0, null).subscribe(
      data => {
        var list = data.content;
        this.list_supplier = list;
      }
    )
  }

  loadSupplier(supplierId: number){
    this.supplierService.getSupplier(supplierId).subscribe(
      data => {
       var supplier = data;
       this.purchasingForm.get("supplier").patchValue(supplier);
      },
      error => {
        alert(error);
      }
    )
    // var supplier = this.suppliers.find(x => x.supplierId == supplierId);
    // this.supplierForm.patchValue(supplier);
    // this.mode.setValue('edit');
  }

  resetForm() {
    this.purchasingForm.reset();
    var formHeader = this.purchasingForm.get("purchasing").value;
    formHeader.amount = 0;
    formHeader.netto = 0;
    this.purchasingForm.get("purchasing").setValue(formHeader);
    this.resetChild();
    this.ngOnInit()
  }

  resetChild() {
    let row = this.purchasingForm.get("purchasing_details") as FormArray;
    while (row != null && row.length != 0) {
      (this.purchasingForm.get("purchasing_details") as FormArray).removeAt(0);
    }
  }

  saveTransaction() {
    var purch = this.purchasingForm.get("purchasing").value;
    var supp = this.purchasingForm.get("supplier").value;
    var det = this.purchasingForm.get("purchasing_details").value;

    var purchasing = new Purchasing();
    var supplier = new Supplier();
    var details : PurchasingDetail[];

    purchasing = purch;
    supplier = supp;
    details = det;

    purchasing.supplier = supplier;
    purchasing.details = details;
    purchasing.discount = purch.discount ? purch.discount : 0;

    var allowed = true;
    var formDetails = (this.purchasingForm.get("purchasing_details") as FormArray);
    for (var i = 0; i < formDetails.length; i++) {
      var quantity = formDetails.controls[i].get("quantity").value;
      var price = formDetails.controls[i].get("price").value;
      var total = quantity * price;
      if(total == 0){
        allowed = false;
        break;
      }
    }


    if (purchasing.supplier.supplierId && purchasing.details.length > 0 && allowed) {
      if (confirm("Simpan transaksi ini ?")) {
        this.purchasingService.saveTransaction(purch).subscribe(
          data => {
            alert(data);
            this.resetForm();
          },
          error => {
            alert(error);
          }
        )
      }
    } else {
      alert("Mohon lengkapi form terlebih dahulu");
    }
  }

  addMaterial(materialId) {
    let rows = this.purchasingForm.get("purchasing_details") as FormArray;
    let is_exist = false;

    for (var i = 0; i < rows.length; i++) {
      var form = (this.purchasingForm.get("purchasing_details") as FormArray).controls[i];
      var mat = form.get("material").value;
      if (mat.materialId == materialId) {
        is_exist = true;
        break;
      }
    }

    if (!is_exist) {

      var row = this.fb.group({
        quantity: 0,
        price: 0,
        total: 0,
        material: this.fb.group(new Material()),
      });

      row.controls.material.patchValue(this.list_material.find(x => x.materialId == materialId));

      rows.push(row);
      
      this.calculateSubTotal();
    } else {
      alert("Material sudah dipilih");
    }

  }

  onModalShow(){
    
  }

  filterListMaterial(){
    let rows = this.purchasingForm.get("purchasing_details") as FormArray;
    for (var i = 0; i < this.list_material.length; i++) {
      var material = this.list_material[i];
      var matExist = rows.value.find(x => x.material.materialId == material.materialId);
      if (matExist) {
        this.list_material[i].deleted = true;
        // var temp_list = this.list_material.filter(x => x.materialId !== matExist.material.materialId);
        // this.list_material = [];
        // this.list_material = temp_list;
      }
    }
  }

  deleteMaterial(index) {
    if (confirm("Apakah Anda yakin akan menghapus baris " + (index + 1))) {
      // var form = (this.purchasingForm.get("purchasing_details") as FormArray).controls[index];
      // var material = form.get("material").value;
      // this.list_material.push(material);
      (this.purchasingForm.get("purchasing_details") as FormArray).removeAt(index);
      this.calculateSubTotal();
    }
  }

  searchMaterial(searchValue){
    this.search = searchValue;
    this.getMaterial();
  }


  getMaterial() {
    this.list_material = [];

    this.materialService.getMaterialParent(this.currentMaterialPage.value, this.search).subscribe(
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

  chooseMaterial(value){
    this.addMaterial(value);
    this.filterListMaterial();
  }

  loadDetail(index, value) {
    var mat = this.list_material.find(x => x.materialId == value);
    var form = (this.purchasingForm.get("purchasing_details") as FormArray).controls[index];
    form.get("material").get("materialCode").setValue(mat.materialCode);
    form.get("material").get("uom").setValue(mat.uom);
  }


  calculateTotal(index) {
    var form = (this.purchasingForm.get("purchasing_details") as FormArray).controls[index];
    var quantity = form.get("quantity").value;
    var price = form.get("price").value;
    var total = quantity * price;
    form.get("total").setValue(total);
    this.calculateSubTotal();
  }


  calculateSubTotal() {
    var form = (this.purchasingForm.get("purchasing_details") as FormArray);
    var sub_total = 0;
    for (var i = 0; i < form.length; i++) {
      var quantity = form.controls[i].get("quantity").value;
      var price = form.controls[i].get("price").value;
      var total = quantity * price;
      sub_total += total;
    }

    var formHeader = this.purchasingForm.get("purchasing").value;
    formHeader.amount = sub_total;
    this.purchasingForm.get("purchasing").setValue(formHeader);

    this.calculateNetto();
  }

  calculateNetto() {
    var formHeader = this.purchasingForm.get("purchasing").value;
    var amount = formHeader.amount;
    var discount = formHeader.discount ? formHeader.discount : 0;
    var netto = amount - (amount * (discount / 100));
    formHeader.netto = netto;
    this.purchasingForm.get("purchasing").setValue(formHeader);
  }

  resetMaterial() {
    let row = this.purchasingForm.get("purchasing_details") as FormArray;
    while (row != null && row.length != 0) {
      (this.purchasingForm.get("purchasing_details") as FormArray).removeAt(0);
    }
  }

  pageChanged(event: any): void {
    this.currentMaterialPage.setValue(event.page);
    this.getMaterial();
  }




}
