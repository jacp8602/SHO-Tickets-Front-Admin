import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatIconModule } from '@angular/material/icon';
import { inject, Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
// import { UntypedFormGroup,  UntypedFormBuilder, FormsModule, NgForm } from '@angular/forms';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';

import { fuseAnimations } from '@fuse/animations';
import { FilterOption } from '../users-table/users-table.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { forEach } from 'lodash';

// Interfaces para las order
export interface Order {
    id?: number;
    order_no: string;
    total_spend: number;
    paid_mt: string;
    purchaser: string;
    email: string;
    purchase_date: string;
    status: string;
}

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  standalone: true,    
  imports: [
    MatFormField, 
    MatLabel, 
    MatSelectModule, 
    FormsModule,
    ReactiveFormsModule,
    MatIconModule,
    PaginationComponent
  ],
})

export class OrdersComponent implements OnInit{
  @Input() description: string = 'Manage event types, shows, venues, event dates, seat types and layout assignments';
  // Form
  filterForm: UntypedFormGroup;  

// Opciones para los filtros (estos vendrían de un servicio en un caso real)
  statusOptions: FilterOption[] = [
      { value: 'created', label: 'Created' },
      { value: 'confirmed', label: 'Confirmed' },
      { value: 'failed', label: 'Payment Failed' }
  ];

  orders: Order[] = [
    {
        id: 1,
        order_no: "San Francisco",
        total_spend: 28.15,
        paid_mt: "Card",
        purchaser: "Floyd Miles",
        email: "floyd.miles@example.com",
        purchase_date: "13/02/2026 15:43",
        status: "created",
    },
    {
        id: 2,  
        order_no: "San Francisco",
        total_spend: 11.36,
        paid_mt: "Card",
        purchaser: "Kristin Watson",
        email: "kristin@example.com",
        purchase_date: "01/02/2026 08:43",
        status: "failed",
    },
    {
        id: 3,
        order_no: "San Francisco",
        total_spend: 19.20,
        paid_mt: "Apple Pay",
        purchaser: "Devon Lane",
        email: "devon.lane@example.com",
        purchase_date: "13/02/2026 15:43",
        status: "confirmed",
    }
  ]

  /**
   * Constructor
   */
  constructor(
      private _formBuilder: UntypedFormBuilder,
      private _router: Router
  ) {}

  /**
   * On init
   */
  ngOnInit(): void {
    // Create filter form with Production, Show and City filters
    this.filterForm = this._formBuilder.group({
        status: ['created'],
    });
    
  }

  getStatus(order: Order):string {
    for (let i = 0; i <= this.statusOptions.length; i++) {
      console.log(this.statusOptions[i]);
      if (order.status === this.statusOptions[i].value){
        return this.statusOptions[i].label;
      }
    }
    return "";
  }

  seeOrder(order: Order):  void {
    console.log("See order");
    this._router.navigate(['/order-details', order.id]);
  }

  refundOrder(order: Order):  void {
    console.log("See order");
    this._router.navigate(['/order-refund', order.id]);
  }

}
