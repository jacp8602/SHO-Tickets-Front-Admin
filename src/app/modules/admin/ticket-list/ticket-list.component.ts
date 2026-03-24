import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { TicketItem } from 'app/core/tickets/tickets.types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { TicketEditDialogComponent } from './ticket-edit-dialog/ticket-edit-dialog.component';


@Component({
    selector: 'app-ticket-list',
    templateUrl: './ticket-list.component.html',
    styleUrls: ['./ticket-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatSlideToggleModule,
        MatTooltipModule,
        MatProgressSpinnerModule,
        // PaginationComponent
    ]
})
export class TicketListComponent implements OnChanges {
    @Input() tickets: TicketItem[] = [];
    @Input() isLoading: boolean = false;
    @Input() showAddButton: boolean = true;
    @Input() showSaveButton: boolean = true;
    @Input() showPagination: boolean = true;
    @Input() pageSize: number = 10;
    @Input() emptyStateMessage: string = 'No tickets found';
    @Input() emptyStateIcon: string = 'confirmation_number';
    @Input() title: string = 'Tickets';
    @Input() description: string = 'Manage tickets for this show';
    
    @Output() addTicket = new EventEmitter<void>();
    @Output() editTicket = new EventEmitter<TicketItem>();
    @Output() deleteTicket = new EventEmitter<TicketItem>();
    @Output() toggleTicket = new EventEmitter<TicketItem>();
    @Output() saveChanges = new EventEmitter<void>();
    
    // Paginación
    totalItems: number = 0;
    pageIndex: number = 1;
    Math = Math;

    constructor(
        private _dialog: MatDialog,
        private _snackBar: MatSnackBar
    ) {}

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['tickets']) {
            this.totalItems = this.tickets?.length || 0;
            // Resetear página si es necesario
            if (this.pageIndex > this.totalPages && this.totalPages > 0) {
                this.pageIndex = this.totalPages;
            }
        }
    }

    /**
     * Obtener tickets de la página actual
     */
    get currentPageTickets(): TicketItem[] {
        if (!this.tickets || !this.showPagination) return this.tickets || [];
        
        const start = (this.pageIndex - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.tickets.slice(start, end);
    }

    /**
     * Obtener total de páginas
     */
    get totalPages(): number {
        return Math.ceil(this.totalItems / this.pageSize);
    }

    /**
     * Manejar cambio de página
     */
    onPageChange(page: number): void {
        this.pageIndex = page;
    }

    /**
     * Formatear precio
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
     * Formatear cantidad
     */
    formatQuantity(quantity: number = 0): string {
        if (quantity === undefined || quantity === null) return '-';
        return quantity.toString();
    }

    /**
     * Obtener color del círculo según tipo de ticket
     */
    getTicketColor(type: string): string {
        const colors: Record<string, string> = {
            'general': 'bg-blue-500',
            'reserved': 'bg-green-500',
            'vip': 'bg-purple-500',
            'bo': 'bg-orange-500',
            'addon': 'bg-gray-400'
        };
        return colors[type] || 'bg-gray-300';
    }

    /**
     * Obtener tooltip según tipo de ticket
     */
    getTicketTooltip(type: string): string {
        const tooltips: Record<string, string> = {
            'general': 'General Admission',
            'reserved': 'Reserved Seating',
            'vip': 'VIP',
            'bo': 'Box Office',
            'addon': 'Add-On'
        };
        return tooltips[type] || 'Other';
    }

    /**
     * Manejar toggle de ticket
     */
    onToggleTicket(ticket: TicketItem): void {
        this.toggleTicket.emit(ticket);
    }

    /**
     * Manejar edición de ticket
     */
    onEditTicket(ticket: TicketItem): void {
        // Aquí iría la lógica para editar (abrir modal, etc.)
        console.log('Edit ticket:', ticket);
        this.editTicketTest(ticket);
        this.editTicket.emit(ticket);
    }

    /**
     * Editar ticket - Abre el modal
     */
    editTicketTest(ticket: TicketItem): void {
        const dialogRef = this._dialog.open(TicketEditDialogComponent, {
            width: '850px',
            maxWidth: '95vw',
            disableClose: true,
            panelClass: 'ticket-edit-dialog-panel',
            data: {
                ticket: { ...ticket },
                mode: 'edit',

            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result?.success && result?.ticket) {
                // Actualizar el ticket en la lista
                const index = this.tickets.findIndex(t => t.id === ticket.id);
                if (index !== -1) {
                    this.tickets[index] = result.ticket;
                    this.tickets = [...this.tickets];
                    // this._snackBar.open('Ticket updated successfully', 'Close', {
                    //     duration: 2000
                    // });
                }
            }
        });
    }

    /**
     * Manejar eliminación de ticket
     */
    onDeleteTicket(ticket: TicketItem): void {
        this.deleteTicket.emit(ticket);
    }

    /**
     * Manejar adición de ticket
     */
    onAddTicket(): void {
        this.createTicket();
        this.addTicket.emit();
    }

    /**
     * Crear nuevo ticket - Abre el modal
     */
    createTicket(): void {
        const newTicket: TicketItem = {
            id: '',
            name: '',
            description: '',
            quantity: 0,
            price: 0,
            type: 'general',
            enabled: true
        };
        
        const dialogRef = this._dialog.open(TicketEditDialogComponent, {
            width: '850px',
            maxWidth: '95vw',
            disableClose: true,
            panelClass: 'ticket-edit-dialog-panel',
            data: {
                ticket: newTicket,
                mode: 'create'
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result?.success && result?.ticket) {  
                this.tickets[-1] = result?.ticket;
                this.tickets = [...this.tickets];
                // this._snackBar.open('Ticket created successfully', 'Close', {
                //     duration: 2000
                // });
                      
                // this._ticketsService.addTicket(result.ticket).subscribe({
                //     next: (response) => {
                //         if (response.success && response.data) {
                //             this.tickets = [...this.tickets, response.data];
                //             this._snackBar.open('Ticket created successfully', 'Close', {
                //                 duration: 2000
                //             });
                //         }
                //     },
                //     error: (error) => {
                //         console.error('Error creating ticket:', error);
                //         this._snackBar.open('Error creating ticket', 'Close', {
                //             duration: 3000
                //         });
                //     }
                // });
            }
        });
    }

    /**
     * Manejar guardado de cambios
     */
    onSaveChanges(): void {
        this.saveChanges.emit();
    }

    /**
     * Track by function para optimizar renderizado
     */
    trackById(index: number, item: TicketItem): string {
        return item.id;
    }
}