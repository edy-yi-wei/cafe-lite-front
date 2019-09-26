import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { AdjustmentService } from '../../service/adjustment.service';
import { Router } from '@angular/router';
import { MaterialService } from '../../service/material.service';
import { Material } from '../../model/material';
import { AdjustmentDetail } from '../../model/adjustment-detail';
import { Adjustment } from '../../model/adjustment';


@Component({
  templateUrl: 'adjustment.component.html'
})
export class AdjustmentComponent implements OnInit {
  adjustmentForm: FormGroup;
  // details: FormArray = new FormArray([]);
  totalMaterials: number = 1;
  currentMaterialPage = new FormControl(1);
  mode = new FormControl('new');
  search: string = '';
  list_material: Material[] = [];

  constructor(public adjustmentService: AdjustmentService, public materialService: MaterialService,
    private fb: FormBuilder, private router: Router) {

    this.adjustmentForm = this.fb.group({
      adjustment: this.fb.group(new Adjustment()),
      adjustment_details: fb.array([])
    });

  }

  ngOnInit() {
    this.getMaterial();
  }

  addNew() {
    if (confirm("Apakah Anda yakin akan membatalkan semua pembelian?")) {
      this.resetForm();
    }
  }


  resetForm() {
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
    var adjust = this.adjustmentForm.get("adjustment").value;
    var det = this.adjustmentForm.get("adjustment_details").value;

    var adjustment = new Adjustment();
    var details: AdjustmentDetail[];

    adjustment = adjust;
    details = det;
    adjustment.details = details;

    var allowed = true;
    var formDetails = (this.adjustmentForm.get("adjustment_details") as FormArray);
    for (var i = 0; i < formDetails.length; i++) {
      var quantity = formDetails.controls[i].get("quantity").value;
      if (quantity == 0) {
        allowed = false;
        break;
      }
    }


    if (adjustment.details.length > 0 && allowed) {
      if (confirm("Simpan transaksi ini ?")) {
        this.adjustmentService.saveTransaction(adjust).subscribe(
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
    let rows = this.adjustmentForm.get("adjustment_details") as FormArray;
    let is_exist = false;

    for (var i = 0; i < rows.length; i++) {
      var form = (this.adjustmentForm.get("adjustment_details") as FormArray).controls[i];
      var mat = form.get("material").value;
      if (mat.materialId == materialId) {
        is_exist = true;
        break;
      }
    }

    if (!is_exist) {

      var adjustment_detail = new AdjustmentDetail();
      var material = new Material();
      material = this.list_material.find(x => x.materialId == materialId);
      adjustment_detail.material = material;

      var detail = this.fb.group(adjustment_detail);


      rows.push(detail);

    } else {
      alert("Material sudah dipilih");
    }

  }

  onModalShow() {
    this.filterListMaterial();
  }

  filterListMaterial() {
    let rows = this.adjustmentForm.get("adjustment_details") as FormArray;
    for (var i = 0; i < this.list_material.length; i++) {
      var material = this.list_material[i];
      var matExist = rows.value.find(x => x.material.materialId == material.materialId);
      if (matExist) {
        this.list_material[i].deleted = true;
        // var temp_list = this.list_material.filter(x => x.materialId !== matExist.material.materialId);
        // this.list_material = [];
        // this.list_material = temp_list;
      }else{
        this.list_material[i].deleted = false;
      }
    }
  }

  deleteMaterial(index) {
    if (confirm("Apakah Anda yakin akan menghapus baris " + (index + 1))) {
      (this.adjustmentForm.get("adjustment_details") as FormArray).removeAt(index);
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

  // loadDetail(index, value) {
  //   var mat = this.list_material.find(x => x.materialId == value);
  //   var form = (this.adjustmentForm.get("adjustment_details") as FormArray).controls[index];
  //   form.get("material").get("materialCode").setValue(mat.materialCode);
  //   form.get("material").get("uom").setValue(mat.uom);
  // }


  resetMaterial() {
    let row = this.adjustmentForm.get("adjustment_details") as FormArray;
    while (row != null && row.length != 0) {
      (this.adjustmentForm.get("adjustment_details") as FormArray).removeAt(0);
    }
  }

  pageChanged(event: any): void {
    this.currentMaterialPage.setValue(event.page);
    this.getMaterial();
  }




}
