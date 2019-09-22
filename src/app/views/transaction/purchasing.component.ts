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
  totalItems: number = 1;
  currentPage = new FormControl(1);
  mode = new FormControl('new');
  search: string = '';
  list_material: Material[] = [];
  list_supplier: Supplier[] = [];

  constructor(public purchasingService: PurchasingService, public materialService: MaterialService, public supplierService: SupplierService,
    private fb: FormBuilder, private router: Router) {
    var purchasing = this.fb.group({
      purchasingId: 0,
      purchasingNumber: '',
      purchasingDate: Date,
      supplierId: 0,
      supplierCode: 0,
      amount: 0,
      discount: 0,
      netto: 0
    });
    this.purchasingForm = this.fb.group({
      purchasing: purchasing,
      purchasing_details: fb.array([])
    });

  }

  ngOnInit() {
    this.getSupplier();
    this.getMaterial();

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

    // var purchasing = this.purchasingForm.get("purchasing").value;
    var formHeader = this.purchasingForm.get("purchasing").value;
    var purchasing = new Purchasing();
    purchasing = formHeader;
    var details = this.purchasingForm.get("purchasing_details").value;
    var supplier = new Supplier();
    supplier.supplierId = formHeader.supplierId;
    purchasing.supplier = supplier;
    purchasing.details = details;
    purchasing.discount = formHeader.discount ? formHeader.discount : 0;

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
      this.purchasingService.saveTransaction(purchasing).subscribe(
        data => {
          alert(data);
          this.resetForm();
        },
        error => {
          alert(error);
        }
      )
    } else {
      alert("Mohon lengkapi form terlebih dahulu");
    }
  }

  addMaterial() {
    let rows = this.purchasingForm.get("purchasing_details") as FormArray;
    if (rows.length < this.list_material.length) {
      var material = new Material();


      var row = this.fb.group({
        quantity: 0,
        price: 0,
        total: 0,
        material: this.fb.group(material)
      });

      (this.purchasingForm.get("purchasing_details") as FormArray).push(row);
      this.calculateSubTotal();
    } else {
      alert("Tidak ada material yang tersedia");
    }

  }

  deleteMaterial(index) {
    if (confirm("Apakah Anda yakin akan menghapus baris " + (index + 1))) {
      (this.purchasingForm.get("purchasing_details") as FormArray).removeAt(index);
      this.calculateSubTotal();
    }
  }

  getMaterial() {
    this.list_material = [];
    this.materialService.getMaterialParent().subscribe(
      data => {
        this.list_material = data;
        // this.list_material = list.filter(x => x.details.length > 0);
        // console.log(this.list_material);
      }
    )
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




}
