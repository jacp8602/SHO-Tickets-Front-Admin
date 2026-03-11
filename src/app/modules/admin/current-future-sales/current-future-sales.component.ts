import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

import { CurrentFutureSalesService } from '../../../core/current-future-sales/current-future-sales.service';
import { CurrentFutureSalesItem } from '../../../core/current-future-sales/current-future-sales.types';
import { MatDivider } from "@angular/material/divider";

@Component({
    selector: 'app-current-future-sales',
    templateUrl: './current-future-sales.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatFormFieldModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        FuseAlertComponent,
        PaginationComponent,
        MatDivider
    ],
})
export class CurrentFutureSalesComponent implements OnInit, OnDestroy {
    // Alert properties
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;

    // Loading state
    isLoading: boolean = true;

    // Formulario de filtros
    filterForm: UntypedFormGroup;

    // Data
    items: CurrentFutureSalesItem[] = [];
    filteredItems: CurrentFutureSalesItem[] = [];
    
    // Paginación
    totalItems: number = 0;
    filteredTotalItems: number = 0;
    totalPages: number = 11;
    pageSize: number = 10;
    pageIndex: number = 1;
    Math = Math;

    // Opciones para selects
    adminUserOptions = [
        { value: 'all', label: 'All Users' },
        { value: 'adrian', label: 'Adrian User' }
    ];

    eventOptions = [
        { value: 'all', label: 'All Events' },
        { value: 'west-palm', label: 'West Palm Beach' },
        { value: 'north-port', label: 'North Port' }
    ];

    orderStatusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'completed', label: 'Completed' },
        { value: 'pending', label: 'Pending' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    paymentMethodOptions = [
        { value: 'all', label: 'All Methods' },
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'cash', label: 'Cash' },
        { value: 'gift_card', label: 'Gift Card' }
    ];

    // Unsubscribe
    private _unsubscribeAll: Subject<void> = new Subject<void>();

    constructor(
        private _currentFutureSalesService: CurrentFutureSalesService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _snackBar: MatSnackBar
    ) {
        this.filterForm = this._formBuilder.group({
            orderDate: [''],
            adminUser: ['all'],
            event: ['all'],
            orderStatus: ['all'],
            paymentMethod: ['all']
        });
    }

    ngOnInit(): void {
        this.loadData();
        
        // Suscribirse a cambios en los filtros
        this.filterForm.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.pageIndex = 1;
                this.applyFilters();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Cargar datos
     */
    private loadData(): void {
        this.isLoading = true;
        this.showAlert = false;

        this._currentFutureSalesService.getSalesReport()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    if (response.success) {
                        this.items = response.data.items;
                        this.totalItems = response.data.totalItems;
                        this.totalPages = response.data.totalPages;
                        this.applyFilters();
                    }
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading data:', error);
                    this.alert = {
                        type: 'error',
                        message: 'Failed to load sales report. Please try again.',
                    };
                    this.showAlert = true;
                    this.isLoading = false;
                }
            });
    }

    /**
     * Aplicar filtros - IMPLEMENTACIÓN REAL
     */
    private applyFilters(): void {
        const filters = this.filterForm.value;
        
        this.filteredItems = this.items.filter(item => {
            // Filtro: Event (busca en el campo 'event' que contiene venue + fecha)
            if (filters.event && filters.event !== 'all') {
                const eventMatch = {
                    'west-palm': 'West Palm Beach',
                    'north-port': 'North Port'
                }[filters.event];
                
                if (eventMatch && !item.event.includes(eventMatch)) {
                    return false;
                }
            }
            
            // Filtro: Admin User (simulado - si tuvieras el campo en el item)
            if (filters.adminUser && filters.adminUser !== 'all') {
                // Ejemplo: if (item.adminUser !== filters.adminUser) return false;
                // Como el mock no tiene este campo, lo omitimos o lo simulamos
            }
            
            // Filtro: Order Status (simulado)
            if (filters.orderStatus && filters.orderStatus !== 'all') {
                // Ejemplo: if (item.status !== filters.orderStatus) return false;
            }
            
            // Filtro: Payment Method (simulado)
            if (filters.paymentMethod && filters.paymentMethod !== 'all') {
                // Ejemplo: if (item.paymentMethod !== filters.paymentMethod) return false;
            }
            
            // Filtro: Order Date (comparación básica)
            if (filters.orderDate) {
                const selectedDate = new Date(filters.orderDate);
                const itemDate = this.extractDateFromEvent(item.event);
                
                if (itemDate && itemDate.toDateString() !== selectedDate.toDateString()) {
                    return false;
                }
            }
            
            return true;
        });
        
        this.filteredTotalItems = this.filteredItems.length;
        this.pageIndex = 1; // Resetear a primera página al aplicar filtros
    }

    /**
     * Extraer fecha del string del evento
     * Ej: "West Palm Beach, FL - 4:30pm - 12/12/2025 - Friday" → Date(2025-12-12)
     */
    private extractDateFromEvent(eventString: string): Date | null {
        try {
            // Buscar patrón de fecha MM/DD/YYYY
            const dateMatch = eventString.match(/(\d{1,2}\/\d{1,2}\/\d{4})/);
            if (dateMatch) {
                return new Date(dateMatch[1]);
            }
            return null;
        } catch {
            return null;
        }
    }

    /**
     * Refrescar el reporte
     */
    refreshReport(): void {
        this.loadData();
        this._snackBar.open('Report refreshed', 'Close', {
            duration: 2000,
        });
    }

    /**
     * Exportar reporte
     */
    exportReport(): void {
        this._snackBar.open('Exporting report...', 'Close', {
            duration: 2000,
        });
    }

    /**
     * Obtener items de la página actual
     */
    get currentPageItems(): CurrentFutureSalesItem[] {
        const start = (this.pageIndex - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.filteredItems.slice(start, end);
    }

    /**
     * Manejar cambio de página
     */
    onPageChange(page: number): void {
        this.pageIndex = page;
    }

    /**
     * Formatear moneda
     */
    formatCurrency(value: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    /**
     * Formatear número con separadores de miles
     */
    formatNumber(value: number): string {
        return new Intl.NumberFormat('en-US').format(value);
    }

    /**
     * Track by function
     */
    trackById(index: number, item: any): string {
        return item.id || index.toString();
    }

    /**
     * Manejar click en fila - Navegar a purchase-items
     */
    onRowClick(item: CurrentFutureSalesItem): void {
        this._router.navigate(['/current-future/purchase-items'], {
            queryParams: {
                eventId: item.id,
                venue: item.venue,
                event: item.event
            }
        });
    }
}