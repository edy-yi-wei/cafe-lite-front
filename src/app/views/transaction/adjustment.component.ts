import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { AdjustmentService } from '../../service/adjustment.service';
import { Router } from '@angular/router';
import { MaterialService } from '../../service/material.service';
import { Material } from '../../model/material';
import { SupplierService } from '../../service/supplier.service';
import { Supplier } from '../../model/supplier';
import { AdjustmentDetail } from '../../model/adjustment-detail';
import { Adjustment } from '../../model/adjustment';


@Component({
  templateUrl: 'adjustment.component.html'
})
export class AdjustmentComponent implements OnInit {
  adjustmentForm: FormGroup;
  // details: FormArray = new FormArray([]);
  totalItems: number = 1;
  currentPage = new FormControl(1);
  mode = new FormControl('new');
  search: string = '';
  list_material: Material[] = [];
  list_supplier: Supplier[] = [];

  constructor(public adjustmentService: AdjustmentService, public materialService: MaterialService, public supplierService: SupplierService,
    private fb: FormBuilder, private router: Router) {
    var adjustment = this.fb.group({
      adjustmentId: 0,
      adjustmentNumber: '',
      adjustmentDate: Date
    });
    this.adjustmentForm = this.fb.group({
      adjustment: adjustment,
      adjustment_details: fb.array([])
    });

  }

  ngOnInit() {
    this.getMaterial();

  }

  resetForm() {
    this.adjustmentForm.reset();
    this.resetChild();
    this.ngOnInit()
  }

  resetChild() {
    let row = this.adjustmentForm.get("adjustment_details") as FormArray;
    while (row != null && row.length != 0) {
      (this.adjustmentForm.get("adjustment_details") as FormArray).removeAt(0);
    }
  }

  saveTransaction() {

    // var adjustment = this.adjustmentForm.get("adjustment").value;
    // var formHeader = this.adjustmentForm.get("adjustment").value;
    // var adjustment = new Adjustment();
    // adjustment = formHeader;
    // var details = this.adjustmentForm.get("adjustment_details").value;
    // var supplier = new Supplier();
    // supplier.supplierId = formHeader.supplierId;
    // adjustment.supplier = supplier;
    // adjustment.details = details;
    // adjustment.discount = formHeader.discount ? formHeader.discount : 0;

    // var allowed = true;
    // var formDetails = (this.adjustmentForm.get("adjustment_details") as FormArray);
    // for (var i = 0; i < formDetails.length; i++) {
    //   var quantity = formDetails.controls[i].get("quantity").value;
    //   var price = formDetails.controls[i].get("price").value;
    //   var total = quantity * price;
    //   if(total == 0){
    //     allowed = false;
    //     break;
    //   }
    // }

    // if (adjustment.supplier.supplierId && adjustment.details.length > 0 && allowed) {
    //   this.adjustmentService.saveTransaction(adjustment).subscribe(
    //     data => {
    //       alert(data);
    //       this.resetForm();
    //     },
    //     error => {
    //       alert(error);
    //     }
    //   )
    // } else {
    //   alert("Mohon lengkapi form terlebih dahulu");
    // }
  }

  addMaterial() {
    let rows = this.adjustmentForm.get("adjustment_details") as FormArray;
    if (rows.length < this.list_material.length) {
      var material = new Material();


      var row = this.fb.group({
        quantity: 0,
        notes: '',
        material: this.fb.group(material)
      });

      (this.adjustmentForm.get("adjustment_details") as FormArray).push(row);
    } else {
      alert("Tidak ada material yang tersedia");
    }

  }

  deleteMaterial(index) {
    if (confirm("Apakah Anda yakin akan menghapus baris " + (index + 1))) {
      (this.adjustmentForm.get("adjustment_details") as FormArray).removeAt(index);
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
    var form = (this.adjustmentForm.get("adjustment_details") as FormArray).controls[index];
    form.get("material").get("materialCode").setValue(mat.materialCode);
    form.get("material").get("uom").setValue(mat.uom);
  }


  

  resetMaterial() {
    let row = this.adjustmentForm.get("adjustment_details") as FormArray;
    while (row != null && row.length != 0) {
      (this.adjustmentForm.get("adjustment_details") as FormArray).removeAt(0);
    }
  }




}
