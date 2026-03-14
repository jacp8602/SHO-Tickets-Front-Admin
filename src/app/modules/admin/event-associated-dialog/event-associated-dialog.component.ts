import { Component, Inject, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { EventAssociatedService } from '../../../core/event-associated/event-associated.service';
import { EventAssociated } from '../../../core/event-associated/event-associated.types';
import { MatDivider } from "@angular/material/divider";

export interface EventAssociatedDialogData {
    layoutId: string;
    eventCount: number;
}

@Component({
    selector: 'app-event-associated-dialog',
    templateUrl: './event-associated-dialog.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatTableModule,
    MatTooltipModule,
    MatDivider
],
})
export class EventAssociatedDialogComponent implements OnInit, OnDestroy {
    events: EventAssociated[] = [];
    displayedColumns: string[] = ['city', 'address', 'date', 'placeName', 'show', 'seats', 'actions'];
    isLoading: boolean = true;
    eventCount: number = 0;

    private _unsubscribeAll: Subject<void> = new Subject<void>();

    constructor(
        public dialogRef: MatDialogRef<EventAssociatedDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: EventAssociatedDialogData,
        private _eventAssociatedService: EventAssociatedService
    ) {
        this.eventCount = data.eventCount || 0;
    }

    ngOnInit(): void {
        this.loadEvents();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadEvents(): void {
        this.isLoading = true;
        
        this._eventAssociatedService.getEvents({ layoutId: this.data.layoutId })
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    if (response.success) {
                        this.events = response.data.events;
                    }
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading events:', error);
                    this.isLoading = false;
                }
            });
    }

    closeDialog(): void {
        this.dialogRef.close();
    }

    editEvent(event: EventAssociated): void {
        console.log('Edit event:', event);        
    }

    trackById(index: number, item: EventAssociated): string {
        return item.id;
    }
}