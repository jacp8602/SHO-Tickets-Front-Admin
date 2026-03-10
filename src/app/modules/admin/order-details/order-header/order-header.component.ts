import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { EventInfo } from '../order-details.types';
import { SearchComponent } from 'app/layout/common/search/search.component';

@Component({
    selector: 'app-order-header',
    templateUrl: './order-header.component.html',
    styleUrls: ['../order-details.component.scss'],
    standalone: true,
    imports: [CommonModule, MatIconModule, SearchComponent]
})
export class OrderHeaderComponent {
    @Input() orderNumber: string;
    @Input() eventInfo: EventInfo;

    get formattedHeader(): string {
        return `#${this.orderNumber} ${this.eventInfo.location} on ${this.eventInfo.date} at ${this.eventInfo.time}`;
    }
}