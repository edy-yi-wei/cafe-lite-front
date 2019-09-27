import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MaterialService } from '../../service/material.service';
import { Material } from '../../model/material';
import { Router } from '@angular/router';
import { MaterialDetail } from '../../model/material-details';


@Component({
    templateUrl: 'material.component.html'
})
export class MaterialComponent implements OnInit {
    materialForm: FormGroup;
    materials: any = [];
    materialFormArray: FormArray = new FormArray([]);
    totalItems: number = 1;
    currentPage = new FormControl(1);
    mode = new FormControl('new');
    search: string = '';
    selectedMaterial: Material;
    // selectedValues: number[] = [];

    list_material: Material[] = [];
    currentMaterialPage = new FormControl(1);
    totalMaterials: number = 1;


    constructor(public materialService: MaterialService, private fb: FormBuilder, private router: Router) {
        // this.materialForm = fb.group(new Material());
        // this.materialDetails = fb.array([]);


        this.materialForm = this.fb.group({
            material: this.fb.group(new Material()),
            materialDetails: this.materialFormArray
        });


    }


    ngOnInit() {
        this.selectMaterial();
        this.getMaterial();
    }

    onSearchEnter(searchValue) {
        this.search = searchValue;
        this.selectMaterial();
    }

    selectMaterial() {
        this.materialService.selectMaterial(this.currentPage.value, this.search).subscribe(
            data => {
                this.materials = data.content;
                this.totalItems = data.totalElements;
            },
            error => {
                this.router.navigate(['/login']);
            }
        )

    }


    saveMaterial() {
        var details = this.materialForm.get("materialDetails").value;
        this.materialForm.get("material").get("details").setValue(details);
        var material = this.materialForm.get("material").value;

        if (material.materialCode != "" && material.materialName != "" && material.uom != "") {
            this.materialService.saveMaterial(material).subscribe(
                data => {
                    alert(data);
                    this.addNew();
                    this.selectMaterial();
                    this.resetChild();
                },
                error => {
                    alert(error);
                }
            )
        } else {
            alert("Mohon lengkapi form terlebih dahulu");
        }

    }

    deleteMaterial() {
        if (confirm('Apakah Anda yakin akan menghapus data ini?')) {
            this.materialService.deleteMaterial(this.materialForm.get("material").value.materialId).subscribe(
                data => {
                    alert(data);
                    this.selectMaterial();
                    this.resetChild();
                    this.addNew();
                },
                error => {
                    alert(error);
                }
            )
        }
    }


    showMaterial(id: number) {
        this.selectedMaterial = this.materials.find(x => x.materialId == id);
        this.resetChild();

        for (let element of this.selectedMaterial.details) {
            var row = this.fb.group({
                conversionQuantity: element.conversionQuantity,
                material: this.fb.group(element.material)
            });

            this.materialFormArray.push(row);
        }


        this.materialForm = this.fb.group({
            material: this.fb.group(this.selectedMaterial),
            materialDetails: this.materialFormArray
        });

        this.mode.setValue('edit');

        // console.log(this.materialFormArray.controls[0].value.material.materialName);
    }

    resetChild() {
        let row = this.materialForm.get("materialDetails") as FormArray;
        while (row != null && row.length != 0) {
            (this.materialForm.get("materialDetails") as FormArray).removeAt(0);
        }
    }

    pageChanged(event: any): void {
        this.currentPage.setValue(event.page);
        this.selectMaterial();
    }

    addNew() {
        this.materialForm.reset();
        this.mode.setValue('new');
        this.resetChild();
    }


    // loadDetail(index, value) {

    //     // this.selectedValues.push(value);
    //     var mat = this.list_material.find(x => x.materialId == value && x.details.length == 0);

    //     var form = (this.materialForm.get("materialDetails") as FormArray).controls[index];
    //     form.get("conversionQuantity").setValue(0);
    //     form.get("material").get("materialCode").setValue(mat.materialCode);
    //     form.get("material").get("uom").setValue(mat.uom);

    //     // var selected_list = this.list_material.filter(x => this.selectedValues.includes(x.materialId));

    //     // // this.list_material = selected_list;

    //     // // this.list_material.filter(x => !this.selectedValues.includes(x.materialId));

    // }


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

            let material_detail = new MaterialDetail();
            let material = new Material();
            material = this.list_material.find(x => x.materialId == materialId);
            material_detail.material = material;
            let detail = this.fb.group(material_detail);


            rows.push(detail);



        } else {
            alert("Material sudah dipilih");
        }

    }

    deleteChild(index) {
        if (confirm("Apakah Anda yakin akan menghapus baris " + (index + 1))) {
            (this.materialFormArray as FormArray).removeAt(index);
        }
    }

    onModalShow() {
        this.filterListMaterial();
    }

    filterListMaterial() {
        let rows = this.materialFormArray as FormArray;
        let details: MaterialDetail[];
        details = rows.value;
        for (var i = 0; i < this.list_material.length; i++) {
            let mat = this.list_material[i];
            let matExist = details.find(x => x.material.materialId == mat.materialId);
            if (matExist) {
                this.list_material[i].deleted = true;
            } else {
                this.list_material[i].deleted = false;
            }
        }
    }


    searchMaterial(searchValue) {
        this.search = searchValue;
        this.getMaterial();
    }


    getMaterial() {
        this.list_material = [];

        this.materialService.selectStock(this.currentMaterialPage.value, this.search).subscribe(
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
