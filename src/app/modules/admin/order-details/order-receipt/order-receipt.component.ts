import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FuseCardComponent } from '@fuse/components/card';
import { OrderReceipt } from '../order-details.types';

@Component({
    selector: 'app-order-receipt',
    templateUrl: './order-receipt.component.html',
    styleUrls: ['../order-details.component.scss'],
    standalone: true,
    imports: [CommonModule, MatIconModule, MatDividerModule, FuseCardComponent,]
})
export class OrderReceiptComponent {
    @Input() receipt: OrderReceipt;
    @Output() formatCurrency = new EventEmitter<number>();
}