import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, finalize } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';

import { ShowMenuComponent } from '../../shared/show-menu/show-menu.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

import { ShowTicketsService } from '../../../core/show-tickets/show-tickets.service';
import { ShowTicketItem } from '../../../core/show-tickets/show-tickets.types';

@Component({
    selector: 'app-show-tickets',
    templateUrl: './show-tickets.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        FuseAlertComponent,
        PaginationComponent,
        ShowMenuComponent
    ],
})
export class ShowTicketsComponent implements OnInit, OnDestroy {
    // Alert properties
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;

    // Loading state
    isLoading: boolean = true;
    isSaving: boolean = false;

    // ID del show desde la URL
    showId: string = '1';

    // Tickets data
    tickets: ShowTicketItem[] = [];

    // Paginación
    totalItems: number = 0;
    pageSize: number = 10;
    pageIndex: number = 1;
    Math = Math;

    // Unsubscribe
    private _unsubscribeAll: Subject<void> = new Subject<void>();

    constructor(
        private _showticketsService: ShowTicketsService,
        private _router: Router,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {        
        // Obtener el ID del show de la URL
        this.getShowIdFromUrl();
        
        // Cargar tickets
        this.loadTickets();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Obtener el ID del show de la URL
     */
    private getShowIdFromUrl(): void {
        const urlSegments = this._router.url.split('/');
        const showIndex = urlSegments.indexOf('shows/tickets');
        if (showIndex !== -1 && showIndex + 1 < urlSegments.length) {
            this.showId = urlSegments[showIndex + 1];
        }
    }

    /**
     * Cargar tickets desde el servicio
     */
    private loadTickets(): void {
        this.isLoading = true;
        this.showAlert = false;

        this._showticketsService.getTickets(this.showId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    if (response.success && response.data) {
                        this.tickets = response.data.tickets;
                        this.totalItems = this.tickets.length;
                    }
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading tickets:', error);
                    this.alert = {
                        type: 'error',
                        message: 'Failed to load tickets. Please try again.',
                    };
                    this.showAlert = true;
                    this.isLoading = false;
                }
            });
    }

    /**
     * Add new ticket
     */
    addNewTicket(): void {
        const newTicket: Omit<ShowTicketItem, 'id'> = {
            name: 'New Ticket',
            quantity: 0,
            price: 0,
            type: 'general',
            enabled: true
        };
        
        this._showticketsService.addTicket(this.showId, newTicket)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    if (response.success && response.data) {
                        this.tickets = response.data.tickets;
                        this._snackBar.open('New ticket added', 'Close', {
                            duration: 2000,
                        });
                    }
                },
                error: (error) => {
                    console.error('Error adding ticket:', error);
                    this._snackBar.open('Error adding ticket', 'Close', {
                        duration: 2000,
                    });
                }
            });
    }

    /**
     * Delete ticket
     */
    deleteTicket(ticket: ShowTicketItem): void {
        if (confirm(`Are you sure you want to delete "${ticket.name}"?`)) {
            this._showticketsService.deleteTicket(this.showId, ticket.id)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe({
                    next: (response) => {
                        if (response.success && response.data) {
                            this.tickets = response.data.tickets;
                            this._snackBar.open('Ticket deleted', 'Close', {
                                duration: 2000,
                            });
                        }
                    },
                    error: (error) => {
                        console.error('Error deleting ticket:', error);
                        this._snackBar.open('Error deleting ticket', 'Close', {
                            duration: 2000,
                        });
                    }
                });
        }
    }

    /**
     * Save changes
     */
    saveChanges(): void {
        this.isSaving = true;
        this.showAlert = false;

        this._showticketsService.saveTickets(this.showId, this.tickets)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    if (response.success) {
                        this.isSaving = false;
                        this.alert = {
                            type: 'success',
                            message: 'Tickets saved successfully.',
                        };
                        this.showAlert = true;
                        
                        this._snackBar.open('Changes saved successfully', 'Close', {
                            duration: 3000,
                        });
                        
                        setTimeout(() => {
                            this.showAlert = false;
                        }, 3000);
                    }
                },
                error: (error) => {
                    console.error('Error saving tickets:', error);
                    this.isSaving = false;
                    this.alert = {
                        type: 'error',
                        message: 'Failed to save tickets.',
                    };
                    this.showAlert = true;
                }
            });
    }

    /**
     * Navigate back
     */
    onClose(): void {
        this._router.navigate(['/shows']);
    }

    /**
     * Format price
     */
    formatPrice(price: number = 0): string {
        if (price === undefined || price === null) return '-';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    }

    /**
     * Format quantity
     */
    formatQuantity(quantity: number = 0): string {
        if (quantity === undefined || quantity === null) return '-';
        return quantity.toString();
    }

    /**
     * Track by function
     */
    trackById(index: number, item: any): string {
        return item.id;
    }

    /**
     * Get total pages
     */
    get totalPages(): number {
        return Math.ceil(this.totalItems / this.pageSize);
    }

    /**
     * Toggle ticket enabled state
     */
    toggleTicket(ticket: ShowTicketItem): void {
        const originalState = ticket.enabled;
        ticket.enabled = !ticket.enabled;

        this._showticketsService.toggleTicket(this.showId, ticket.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                error: (error) => {
                    console.error('Error toggling ticket:', error);
                    ticket.enabled = originalState;
                    this._snackBar.open('Error updating ticket', 'Close', {
                        duration: 2000,
                    });
                }
            });
    }

    /**
     * Edit ticket
     */
    editTicket(ticket: ShowTicketItem): void {
        console.log('Edit ticket:', ticket);
        this._snackBar.open(`Edit: ${ticket.name}`, 'Close', {
            duration: 2000,
        });
    }

    /**
     * Obtener tickets de la página actual
     */
    get currentPageTickets(): ShowTicketItem[] {
        const start = (this.pageIndex - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.tickets.slice(start, end);
    }

    /**
     * Handle page change
     */
    onPageChange(page: number): void {
        this.pageIndex = page;
    }
}