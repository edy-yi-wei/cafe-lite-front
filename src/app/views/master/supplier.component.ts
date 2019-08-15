import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { SupplierService } from '../../service/supplier.service';
import { Supplier } from '../../model/supplier';
import { Router } from '@angular/router';


@Component({
    templateUrl: 'supplier.component.html'
})
export class SupplierComponent implements OnInit {
    supplierForm: FormGroup;
    suppliers: any = [];
    totalItems: number = 1;
    currentPage = new FormControl(1);
    mode = new FormControl('new');
    search: string = '';

    constructor(public supplierService: SupplierService, private fb: FormBuilder, private router: Router) {
        this.supplierForm = fb.group(new Supplier());
    }

    ngOnInit() {
        this.selectSupplier();
    }

    onSearchEnter(searchValue) {
        this.search = searchValue;
        this.selectSupplier();
    }

    selectSupplier() {
        this.supplierService.selectSupplier(this.currentPage.value, this.search).subscribe(
            data => {
                this.suppliers = data.content;
                this.totalItems = data.totalElements;
            },
            error => {
                this.router.navigate(['/login']);
            }
        )

    }

    saveSupplier() {
        this.supplierService.saveSupplier(this.supplierForm.value).subscribe(
            data => {
                alert(data);
                this.addNew();
                this.selectSupplier();
            },
            error => {
                alert(error);
            }
        )
    }

    deleteSupplier() {
        if (confirm('Apakah Anda yakin akan menghapus data ini?')) {
            this.supplierService.deleteSupplier(this.supplierForm.controls['supplierId'].value).subscribe(
                data => {
                    alert(data);
                    this.selectSupplier();
                    this.addNew();
                },
                error => {
                    alert(error);
                }
            ) 
        }
    }


    showSupplier(id: number) {
        var supplier = this.suppliers.find(x => x.supplierId == id);
        this.supplierForm.patchValue(supplier);
        this.mode.setValue('edit');
    }

    pageChanged(event: any): void {
        this.currentPage.setValue(event.page);
        this.selectSupplier();
    }

    addNew() {
        this.supplierForm.reset();
        this.mode.setValue('new');
    }
}
