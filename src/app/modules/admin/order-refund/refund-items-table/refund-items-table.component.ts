import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RefundItem, PaginationInfo } from '../order-refund.types';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';

@Component({
    selector: 'app-refund-items-table',
    templateUrl: './refund-items-table.component.html',
    // styleUrls: ['./refund-items-table.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatCheckboxModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        PaginationComponent
    ]
})
export class RefundItemsTableComponent implements OnInit {
    @Input() items: RefundItem[] = [];
    @Input() pagination: PaginationInfo;
    @Output() itemsSelected = new EventEmitter<RefundItem[]>();
    @Output() selectAllChanged = new EventEmitter<boolean>();
    @Output() pageChange = new EventEmitter<number>();

    selectedItems: Set<string> = new Set();
    selectAll: boolean = false;

    ngOnInit(): void {
        // Inicializar items seleccionables
        this.items.forEach(item => {
            if (item.isRefundable === undefined) {
                item.isRefundable = item.status === 'Active';
            }
        });
    }

    /**
     * Toggle selección de un item
     */
    toggleItem(item: RefundItem): void {
        if (!item.isRefundable) return;

        if (this.selectedItems.has(item.id)) {
            this.selectedItems.delete(item.id);
        } else {
            this.selectedItems.add(item.id);
        }

        this.updateSelectAll();
        this.emitSelection();
    }

    /**
     * Toggle seleccionar todos
     */
    toggleSelectAll(): void {
        if (this.selectAll) {
            // Deseleccionar todos
            this.selectedItems.clear();
        } else {
            // Seleccionar todos los refundables
            this.items.forEach(item => {
                if (item.isRefundable) {
                    this.selectedItems.add(item.id);
                }
            });
        }
        
        this.selectAll = !this.selectAll;
        this.selectAllChanged.emit(this.selectAll);
        this.emitSelection();
    }

    /**
     * Actualizar estado de select all
     */
    private updateSelectAll(): void {
        const refundableItems = this.items.filter(item => item.isRefundable);
        const selectedCount = refundableItems.filter(item => this.selectedItems.has(item.id)).length;
        
        this.selectAll = refundableItems.length > 0 && selectedCount === refundableItems.length;
    }

    /**
     * Emitir items seleccionados
     */
    private emitSelection(): void {
        const selected = this.items.filter(item => this.selectedItems.has(item.id));
        this.itemsSelected.emit(selected);
    }

    /**
     * Verificar si un item está seleccionado
     */
    isSelected(item: RefundItem): boolean {
        return this.selectedItems.has(item.id);
    }

    /**
     * Obtener clase de estado
     */
    getStatusClass(status: string): string {
        const classes = {
            'Active': 'bg-green-100 text-green-800',
            'Refunded': 'bg-red-100 text-red-800',
            'Pending': 'bg-yellow-100 text-yellow-800',
            'Cancelled': 'bg-gray-100 text-gray-800'
        };
        return classes[status] || 'bg-gray-100 text-gray-800';
    }

    /**
     * Formatear asiento
     */
    formatSeat(item: RefundItem): string {
        return `Section:${item.section} | Row:${item.row} Seat:${item.seat}`;
    }

    /**
     * Formatear moneda
     */
    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    }
}