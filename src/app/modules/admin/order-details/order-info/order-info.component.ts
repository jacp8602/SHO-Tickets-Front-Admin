import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FuseCardComponent } from '@fuse/components/card';
import { OrderInfo } from '../order-details.types';
import { BarcodeComponent } from '../../../shared/barcode/barcode.component';

@Component({
    selector: 'app-order-info',
    templateUrl: './order-info.component.html',
    styleUrls: ['../order-details.component.scss'],
    standalone: true,
    imports: [CommonModule, MatIconModule, MatDividerModule, FuseCardComponent, BarcodeComponent,]
})
export class OrderInfoComponent {
    @Input() orderInfo: OrderInfo;
    @Output() formatCurrency = new EventEmitter<number>();

    getStatusClass(status: string): string {
        const statusClasses = {
            'Confirmed': 'bg-green-100 text-green-800 border-green-200',
            'Pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
            'Failed': 'bg-red-100 text-red-800 border-red-200',
            'Refunded': 'bg-gray-100 text-gray-800 border-gray-200'
        };
        return statusClasses[status] || 'bg-gray-100 text-gray-800 border-gray-200';
    }
}