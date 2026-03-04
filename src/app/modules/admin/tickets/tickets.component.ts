import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil, finalize } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { ProductionMenuComponent } from '../../shared/production-menu/production-menu.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

import { TicketsService } from '../../../core/tickets/tickets.service';
import { TicketItem } from '../../../core/tickets/tickets.types';

@Component({
    selector: 'app-tickets',
    templateUrl: './tickets.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        FuseAlertComponent,
        ProductionMenuComponent,
        PaginationComponent,
    ],
})
export class TicketsComponent implements OnInit, OnDestroy {
    // Alert properties
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;

    // Loading state
    isLoading: boolean = true;
    isSaving: boolean = false;

    // ID de producción (para el menú)
    productionId: string = '1';

    // Tickets para la tabla
    tickets: TicketItem[] = [];
    
    // Paginación
    totalItems: number = 0;
    pageSize: number = 10;
    pageIndex: number = 1;
    Math = Math;

    // Unsubscribe
    private _unsubscribeAll: Subject<void> = new Subject<void>();

    constructor(
        private _ticketsService: TicketsService,
        private _router: Router,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        // Obtener el ID de producción de la URL
        this.getProductionIdFromUrl();
        
        // Cargar tickets
        this.loadTickets();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Obtener el ID de producción de la URL
     */
    private getProductionIdFromUrl(): void {
        const urlSegments = this._router.url.split('/');
        const productionsIndex = urlSegments.indexOf('productions/tickets');
        if (productionsIndex !== -1 && productionsIndex + 1 < urlSegments.length) {
            this.productionId = urlSegments[productionsIndex + 1];
        }
    }

    /**
     * Cargar tickets desde el servicio
     */
    private loadTickets(): void {
        this.isLoading = true;
        this.showAlert = false;

        this._ticketsService.getTickets(this.productionId)
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
     * Obtener tickets de la página actual
     */
    get currentPageTickets(): TicketItem[] {
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

    /**
     * Toggle ticket enabled state
     */
    toggleTicket(ticket: TicketItem): void {
        const originalState = ticket.enabled;
        ticket.enabled = !ticket.enabled;
        
        this._ticketsService.toggleTicket(this.productionId, ticket.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                error: (error) => {
                    console.error('Error toggling ticket:', error);
                    ticket.enabled = originalState; // Revertir en caso de error
                    this._snackBar.open('Error updating ticket', 'Close', {
                        duration: 2000,
                    });
                }
            });
    }

    /**
     * Guardar cambios
     */
    saveChanges(): void {
        this.isSaving = true;
        this.showAlert = false;

        this._ticketsService.saveTickets(this.productionId, this.tickets)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isSaving = false;
                })
            )
            .subscribe({
                next: (response) => {
                    if (response.success) {
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
                    this.alert = {
                        type: 'error',
                        message: 'Failed to save tickets.',
                    };
                    this.showAlert = true;
                }
            });
    }

    /**
     * Add new ticket
     */
    addNewTicket(): void {
        const newTicket: Omit<TicketItem, 'id'> = {
            name: 'New Ticket',
            quantity: 0,
            price: 0,
            type: 'general',
            enabled: true
        };
        
        this._ticketsService.addTicket(this.productionId, newTicket)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    if (response.success && response.data) {
                        this.tickets = response.data.tickets;
                        this.totalItems = this.tickets.length;
                        
                        // Ir a la última página para ver el nuevo ticket
                        this.pageIndex = Math.ceil(this.totalItems / this.pageSize);
                        
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
     * Edit ticket
     */
    editTicket(ticket: TicketItem): void {
        // Aquí iría la lógica para editar (abrir modal, etc.)
        console.log('Edit ticket:', ticket);
        this._snackBar.open(`Edit ticket: ${ticket.name}`, 'Close', {
            duration: 2000,
        });
    }

    /**
     * Delete ticket
     */
    deleteTicket(ticket: TicketItem): void {
        if (confirm(`Are you sure you want to delete "${ticket.name}"?`)) {
            this._ticketsService.deleteTicket(this.productionId, ticket.id)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe({
                    next: (response) => {
                        if (response.success && response.data) {
                            this.tickets = response.data.tickets;
                            this.totalItems = this.tickets.length;
                            
                            // Ajustar página si es necesario
                            if (this.pageIndex > Math.ceil(this.totalItems / this.pageSize)) {
                                this.pageIndex = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
                            }
                            
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
     * Navigate back
     */
    onClose(): void {
        this._router.navigate(['/productions']);
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
     * Get total pages
     */
    get totalPages(): number {
        return Math.ceil(this.totalItems / this.pageSize);
    }

    /**
     * Track by function for ngFor
     */
    trackById(index: number, item: any): string {
        return item.id;
    }
}