import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FuseCardComponent } from '@fuse/components/card';
import { PurchaserInfo } from '../order-details.types';

@Component({
    selector: 'app-purchaser-info',
    templateUrl: './purchaser-info.component.html',
    styleUrls: ['../order-details.component.scss'],
    standalone: true,
    imports: [CommonModule, MatIconModule, MatButtonModule, FuseCardComponent,]
})
export class PurchaserInfoComponent {
    @Input() purchaserInfo: PurchaserInfo;

    get fullName(): string {
        return `${this.purchaserInfo.firstName} ${this.purchaserInfo.lastName}`;
    }

    get fullAddress(): string {
        const parts = [
            this.purchaserInfo.address,
            this.purchaserInfo.addressLine2 !== '-' ? this.purchaserInfo.addressLine2 : null,
            `${this.purchaserInfo.city}, ${this.purchaserInfo.state} ${this.purchaserInfo.zipCode}`,
            this.purchaserInfo.country
        ].filter(part => part && part !== '-');
        
        return parts.join(', ');
    }
}