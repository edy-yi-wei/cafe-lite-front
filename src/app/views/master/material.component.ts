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
    list_material: Material[] = [];
    selectedMaterial: Material;
    // selectedValues: number[] = [];


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
        this.getMaterial(id);
        
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
        this.getMaterial();
    }

    getMaterial(materialId = null) {
        this.materialService.selectMaterial(0, null).subscribe(
            data => {
                var list = data.content;
                this.list_material = [];
                this.list_material = list.filter(x => x.details != null && x.details == 0);

                if(materialId != null){
                    this.list_material = this.list_material.filter(x => x.materialId != materialId);
                }
            }
        )
    }

    loadDetail(index, value) {

        // this.selectedValues.push(value);
        var mat = this.list_material.find(x => x.materialId == value && x.details.length == 0);

        var form = (this.materialForm.get("materialDetails") as FormArray).controls[index];
        form.get("conversionQuantity").setValue(0);
        form.get("material").get("materialCode").setValue(mat.materialCode);
        form.get("material").get("uom").setValue(mat.uom);

        // var selected_list = this.list_material.filter(x => this.selectedValues.includes(x.materialId));

        // // this.list_material = selected_list;

        // // this.list_material.filter(x => !this.selectedValues.includes(x.materialId));

    }

    addChild() {
        let rows = this.materialForm.get("materialDetails") as FormArray;
        if (rows.length < this.list_material.length) {
            var row = this.fb.group({
                conversionQuantity: 0,
                material: this.fb.group(new Material())
            });

            (this.materialForm.get("materialDetails") as FormArray).push(row);
        } else {
            alert("Tidak ada material yang tersedia");
        }

    }

    deleteChild(index) {
        if (confirm("Apakah Anda yakin akan menghapus baris " + (index + 1))) {
            (this.materialForm.get("materialDetails") as FormArray).removeAt(index);
        }

    }


}
