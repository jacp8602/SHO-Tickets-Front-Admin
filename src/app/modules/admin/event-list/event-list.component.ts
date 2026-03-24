import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

import { EventAssociated } from '../../../core/event-associated/event-associated.types';
import { Router } from '@angular/router';

@Component({
    selector: 'app-event-list',
    templateUrl: './event-list.component.html',
    // styleUrls: ['./event-list.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        MatIconModule,
        MatTooltipModule,
        MatButtonModule
    ]
})
export class EventListComponent {
    @Input() events: EventAssociated[] = [];
    @Input() isLoading: boolean = true;
    @Output() editEventClicked = new EventEmitter<EventAssociated>();

    displayedColumns: string[] = ['city', 'address', 'date', 'placeName', 'show', 'seats', 'actions'];

    /**
       * Constructor
       */
      constructor(
          private _router: Router
      ) {}

    trackById(index: number, item: EventAssociated): string {
        return item.id;
    }

    onEditEvent(event: EventAssociated): void {
        this.editEventClicked.emit(event);
        this._router.navigate(['/venue-details', event.id]);
    }
}
