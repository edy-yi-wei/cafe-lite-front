import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray } from '@angular/forms';
import { MenuService } from '../../service/menu.service';
import { InvoiceService } from '../../service/invoice.service';
import { Invoice } from '../../model/invoice';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';


@Component({
  templateUrl: 'invoice.component.html'
})
export class InvoiceComponent implements OnInit{  
  invoiceForm: FormGroup;  
  menus: any = [];
  details: FormArray = new FormArray([]);
  totalItems: number = 1;
  currentPage = new FormControl(1);
  mode = new FormControl('new');
  search: string = '';
  total = new FormControl(0);
  change: number = 0;
  notif: string = '';
  isSaved: number = 0;
  userName = new FormControl('');
  userPassword = new FormControl('');

  @ViewChild('paymentModal', {static: false}) public primaryModal: ModalDirective;
  @ViewChild('closeButton', {static: false}) closeButton: ElementRef;

  constructor(public invoiceService: InvoiceService, public menuService: MenuService, 
    private fb: FormBuilder, private router: Router) { 
    this.invoiceForm = fb.group({
      invoiceId: 0,
      invoiceNumber: '',
      invoiceDate: '',
      invoiceType: 'Makan',
      customerName: '',
      payment: 0,
      details: fb.array([])
    });
    this.details = fb.array([])
  }
  
  ngOnInit() {
    this.selectMenu();
  }

  insertDetail(data) {
    return this.fb.group({
      menuId: data.menuId,        
      menuName: data.menuName,        
      quantity: data.quantity,
      price: data.price
    })
  }

  createRinci(data) {
    return this.fb.group({
      menu: this.fb.group({
        menuId: data.menuId,        
      }),
      quantity: data.quantity,
      price: data.price
    });
  }

  onSearchMenuEnter(searchValue){
    this.search = searchValue;
    this.selectMenu();
  }

  selectMenu(){
    this.menuService.selectMenu(this.currentPage.value, this.search).subscribe(
      data => {
        this.menus = data.content;
        this.totalItems = data.totalElements;
      }
    )
  }
  
  chooseMenu(menuId) {
    var menu = this.menus.find(x=> x.menuId == menuId);
    var data = { 
      menuId: menuId,
      menuName: menu.menuName,
      price: menu.menuPrice,
      quantity: 1      
    }
    // this.details.push(this.insertDetail(data));
    this.addChoosenMenu(data);
  }

  addChoosenMenu(data){
    var quantity = 0;
    var found = false;
    for(let i of this.details.controls){
      if(i.get("menuId").value==data.menuId){
        quantity = i.get("quantity").value;
        quantity += data.quantity;
        i.get("quantity").setValue(quantity);
        found= true;
        break;
      }
    }
    if(!found){
      this.details.push(this.insertDetail(data));      
    }
    this.calculateTotal();
  }

  saveInvoice(){
    var rinci = this.invoiceForm.get("details") as FormArray;
    while(rinci.length>0){
      rinci.removeAt(0);
    }
    for(let i of this.details.controls){
      rinci.push(this.createRinci(i.value));
    }
    this.invoiceService.saveInvoice(this.invoiceForm.value).subscribe(
      data => {
        this.notif=data;
        this.isSaved = 1;
        this.invoiceForm.get('payment').disable();
        this.closeButton.nativeElement.focus();
        // this.primaryModal.hide();
        // this.addNew(false);
      },
      error => {
        alert(error);
      }
    )
  }

  pageChanged(event: any): void {
    this.currentPage.setValue(event.page);
    this.selectMenu();
  }

  addNew(isCancel){
    this.notif = '';
    this.isSaved = 0;
    this.invoiceForm.get('payment').enable();
    var konfirmasi = true;
    if(isCancel){
      konfirmasi = confirm("Apakah Anda yakin akan membatalkan semua pesanan ini?");
    }
    if(konfirmasi){
      this.invoiceForm.get("invoiceId").setValue(0);
      this.invoiceForm.get("invoiceNumber").setValue("");    
      this.invoiceForm.get("invoiceType").setValue("Makan");
      this.invoiceForm.get("customerName").setValue("");
      this.invoiceForm.get("payment").setValue(0);
      while(this.details.length>0){
        this.details.removeAt(0);
      }
      this.calculateTotal();
      this.change = 0;
      this.mode.setValue('new');
      this.search = '';
      this.selectMenu();
    }
  }

  removeMenu(id) {
    var quantity = 0;
    var iterator = 0;
    for(let i of this.details.controls){
      if(i.get("menuId").value==id){
        quantity = i.get("quantity").value;
        if(quantity==1){
          this.details.removeAt(iterator);
        } else {
          quantity -= 1;
          i.get("quantity").setValue(quantity);
        }        
        break;
      }
      iterator++;
    }
    this.calculateTotal();
  }

  calculateTotal() {
    var nilai = 0;
    for(let i of this.details.controls){
      nilai += i.get("quantity").value * i.get("price").value;
    }
    this.total.setValue(nilai);
  }

  calculateChange() {
    this.change = this.invoiceForm.get("payment").value - this.total.value;
    if(this.change>=0){
      this.saveInvoice();      
    } else {
      this.notif = 'Pembayaran kurang!';
    }
  }

  onModalHide() {
    if(this.isSaved==1){
      this.addNew(false);
    }
  }

  doClosing(){    
    var userName = this.userName.value;
    var userPassword = this.userPassword.value;
    this.invoiceService.doClosing(userName, userPassword).subscribe(
      data => {
        alert(data);
        this.router.navigate(['/login']);
      },
      error => {
        alert(error);
      }
    )
  }

  reprintInvoice(){
    var userName = sessionStorage.getItem('userName');
    this.invoiceService.reprintInvoice(userName).subscribe(
      data => {
        
      },
      error => {
        alert(error);
      }
    )
  }
}
