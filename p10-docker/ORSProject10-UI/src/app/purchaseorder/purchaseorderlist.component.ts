import { Component, OnInit } from '@angular/core';
import { BaseListCtl } from '../base-list.component';
import { ServiceLocatorService } from '../service-locator.service';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-purchaseorderlist',
  templateUrl: './purchaseorderlist.component.html',
  styleUrls: ['./purchaseorderlist.component.css']
})
export class PurchaseorderlistComponent  extends BaseListCtl implements OnInit {

   
  public form = {
    error: false,
    message: null,
    preload: {
      categoryList: [] 
     
    },
    data: { id: null },
   
    searchParams: {
   
      totalQuantity: null,
      orderDate: '',
      productId: null, 
      totalCost:''
      
    },
    searchMessage: null,
    list: [],
    pageNo: 0
  };
 


  constructor(public locator: ServiceLocatorService, public route: ActivatedRoute, private httpClient: HttpClient) {
    super(locator.endpoints.PURCHASEORDER, locator, route);
  }

  ngOnInit() {
    super.ngOnInit();
  }


  validateMobileInput(event: KeyboardEvent) {
    const values = (event.target as HTMLInputElement).value + event.key;
    if (!/^[6-9][0-9]{0,9}$/.test(values)) {
        event.preventDefault();
    }

     }
     validateNumericInput(event: KeyboardEvent) {
      
      const str = event.key ;
      console.log(str);
      if (!/^\d$/.test(str)) {
        event.preventDefault();
      }
    }
  
  
  
  validateAlphabetInput(event: KeyboardEvent) {
    console.log(event);
    const str = event.key ;
    
    console.log(str);
    if (!/^[a-zA-Z\s]*$/.test(str)) {
      event.preventDefault();
    }
  }
 
  submit() {
   
    this.form.pageNo = 0;
    
    this.search();
  }


 
  search() {
   
    this.form.searchMessage = null;
    
    super.search();
  }
}

