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

import { SalesReportService } from '../../../core/sales-report/sales-report.service';
import { GrandSummary, SalesReportItem, VenueSummary } from '../../../core/sales-report/sales-report.types';

export interface GroupedVenueData {
    venue: string;
    summary: VenueSummary;
    items: SalesReportItem[];
    displayItems: SalesReportItem[]; // Items a mostrar en la página actual
    expanded?: boolean;
}

@Component({
    selector: 'app-sales-report',
    templateUrl: './sales-report.component.html',
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
    ],
})
export class SalesReportComponent implements OnInit, OnDestroy {
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
    grandSummary: GrandSummary | null = null;
    items: SalesReportItem[] = [];
    venueSummaries: VenueSummary[] = [];
    
    // Datos agrupados
    groupedVenues: GroupedVenueData[] = [];
    paginatedGroups: GroupedVenueData[] = [];
    
    // Paginación
    totalGroups: number = 0;
    pageSize: number = 3; // Número de venues por página
    pageIndex: number = 1;
    Math = Math;

    // Opciones para selects
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

    adminUserOptions = [
        { value: 'all', label: 'All Users' },
        { value: 'adrian', label: 'Adrian User' },
        { value: 'john', label: 'John Doe' },
        { value: 'jane', label: 'Jane Smith' }
    ];

    eventOptions = [
        { value: 'all', label: 'All Events' },
        { value: 'circus', label: 'Nuclear Circus' },
        { value: 'monster', label: 'Monster Truck' }
    ];

    // Unsubscribe
    private _unsubscribeAll: Subject<void> = new Subject<void>();

    constructor(
        private _salesReportService: SalesReportService,
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
        this.loadSalesReport();
        
        // Suscribirse a cambios en los filtros
        this.filterForm.valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.pageIndex = 1; // Reset a primera página al filtrar
                this.loadSalesReport();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Cargar el reporte de ventas
     */
    private loadSalesReport(): void {
        this.isLoading = true;
        this.showAlert = false;

        this._salesReportService.getSalesReport(this.filterForm.value)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    if (response.success) {
                        this.grandSummary = response.data.grandSummary;
                        this.items = response.data.items;
                        this.venueSummaries = response.data.venueSummaries;
                        this.groupItemsByVenue();
                        this.updatePaginatedGroups();
                    }
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading sales report:', error);
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
     * Agrupar items por venue
     */
    private groupItemsByVenue(): void {
        const venueMap = new Map<string, SalesReportItem[]>();
        
        // Agrupar items por venue
        this.items.forEach(item => {
            if (!venueMap.has(item.venue)) {
                venueMap.set(item.venue, []);
            }
            venueMap.get(item.venue)!.push(item);
        });
        
        // Crear estructura de datos agrupados
        this.groupedVenues = Array.from(venueMap.entries()).map(([venue, items]) => {
            const summary = this.venueSummaries.find(s => s.venue === venue);
            return {
                venue,
                summary: summary || {
                    venue,
                    orders: items.reduce((sum, i) => sum + i.orders, 0),
                    allTickets: items.reduce((sum, i) => sum + i.allTickets, 0),
                    tickets: items.reduce((sum, i) => sum + i.tickets, 0),
                    addOns: items.reduce((sum, i) => sum + i.addOns, 0),
                    totalFees: items.reduce((sum, i) => sum + i.totalFees, 0),
                    totalTaxes: items.reduce((sum, i) => sum + i.totalTaxes, 0),
                    amountPaid: items.reduce((sum, i) => sum + i.amountPaid, 0)
                },
                items,
                displayItems: [] // Se llenará en updatePaginatedGroups
            };
        });
        
        this.totalGroups = this.groupedVenues.length;
    }

    /**
     * Actualizar los grupos paginados
     */
    private updatePaginatedGroups(): void {
        const start = (this.pageIndex - 1) * this.pageSize;
        const end = start + this.pageSize;
        
        this.paginatedGroups = this.groupedVenues.slice(start, end).map(group => ({
            ...group,
            displayItems: group.items // Mostrar todos los items del grupo
        }));
    }

    /**
     * Manejar cambio de página
     */
    onPageChange(page: number): void {
        this.pageIndex = page;
        this.updatePaginatedGroups();
    }

    /**
     * Refrescar el reporte
     */
    refreshReport(): void {
        this.loadSalesReport();
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
     * Calcular el índice global de un item
     */
    getItemIndex(groupIndex: number, itemIndex: number): number {
        let baseIndex = 0;
        for (let i = 0; i < groupIndex; i++) {
            baseIndex += this.paginatedGroups[i].items.length;
        }
        return baseIndex + itemIndex + 1;
    }

    /**
     * Track by function para grupos
     */
    trackByVenue(index: number, item: any): string {
        return item.venue;
    }

    /**
     * Track by function para items
     */
    trackById(index: number, item: any): string {
        return item.id || index.toString();
    }
}