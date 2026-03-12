import { Component, OnInit, ViewEncapsulation, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { fuseAnimations } from '@fuse/animations';

import { OrderHeaderComponent } from './order-header/order-header.component';
import { OrderInfoComponent } from './order-info/order-info.component';
import { PurchaserInfoComponent } from './purchaser-info/purchaser-info.component';
import { OrderReceiptComponent } from './order-receipt/order-receipt.component';
import { OrderDetails } from './order-details.types';

@Component({
    selector: 'app-order-details',
    templateUrl: './order-details.component.html',
    styleUrls: ['./order-details.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatDividerModule,
        MatCardModule,
        OrderHeaderComponent,
        OrderInfoComponent,
        PurchaserInfoComponent,
        OrderReceiptComponent
    ]
})
export class OrderDetailsComponent implements OnInit {
    @Input() orderDetails: OrderDetails;

    // Datos de ejemplo basados en la imagen
    readonly mockOrderDetails: OrderDetails = {
        orderNumber: '5236256',
        eventInfo: {
            location: 'San Francisco, CA',
            date: '10/10/2025',
            time: '2:00 PM'
        },
        orderInfo: {
            amount: 171.15,
            date: 'Dec 12, 2025 - 12:45 PM',
            transactionMethod: 'Apple Pay',
            transactionStatus: 'Confirmed',
            processor: 'Square E-Commerce',
            source: 'Site',
            placedBy: 'Acacia Coffey'
        },
        purchaserInfo: {
            firstName: 'Acacia',
            lastName: 'Coffey',
            email: 'Acaciamob@gmail.com',
            phone: '+11347486 2146',
            address: '9865 logo drive',
            addressLine2: '-',
            country: 'United States',
            city: 'boynton beach',
            state: 'Florida',
            zipCode: '33472'
        },
        receipt: {
            items: [
                { 
                    name: 'Child General Admission/Free Child', 
                    quantity: 3, 
                    price: 65.00,
                    description: 'x3'
                },
                { 
                    name: 'Face Painting', 
                    quantity: 3, 
                    price: 42.00,
                    description: 'x3'
                }
            ],
            subtotal: 147.00,
            refunds: 0.00,
            serviceFee: 21.00,
            facilityFee: 3.15,
            taxes: 3.15,
            total: 171.15
        }
    };

    constructor() {
        // Usar datos de mock por defecto
        this.orderDetails = this.mockOrderDetails;
    }

    ngOnInit(): void {}

    /**
     * Formatear número de orden
     */
    getFormattedOrderNumber(): string {
        return `#${this.orderDetails.orderNumber}`;
    }

    /**
     * Formatear moneda
     */
    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(amount);
    }
}