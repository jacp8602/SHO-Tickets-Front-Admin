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

import { OverviewTotalSalesService } from '../../../core/overview-total-sales/overview-total-sales.service';
import { 
    OverviewTotalSalesData,
    OverviewTotalSalesMetrics,
    TicketTypeData,
    PromoCodeData
} from '../../../core/overview-total-sales/overview-total-sales.types';

@Component({
    selector: 'app-overview-total-sales',
    templateUrl: './overview-total-sales.component.html',
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
    ],
})
export class OverviewTotalSalesComponent implements OnInit, OnDestroy {
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
    metrics: OverviewTotalSalesMetrics | null = null;
    ticketsByType: TicketTypeData[] = [];
    promoCodePerformance: PromoCodeData[] = [];
    
    // Opciones para selects
    adminUserOptions = [
        { value: 'all', label: 'All Users' },
        { value: 'adrian', label: 'Adrian User' },
        { value: 'andrew', label: 'Andrew' }
    ];

    eventOptions = [
        { value: 'all', label: 'All Events' },
        { value: 'circus', label: 'Nuclear Circus' },
        { value: 'monster', label: 'Monster Truck' }
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
        private _overviewTotalSalesService: OverviewTotalSalesService,
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

        this._overviewTotalSalesService.getOverviewTotalSales()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    if (response.success) {
                        this.metrics = response.data.metrics;
                        this.ticketsByType = response.data.ticketsByType;
                        this.promoCodePerformance = response.data.promoCodePerformance;
                    }
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading data:', error);
                    this.alert = {
                        type: 'error',
                        message: 'Failed to load overview. Please try again.',
                    };
                    this.showAlert = true;
                    this.isLoading = false;
                }
            });
    }

    /**
     * Aplicar filtros
     */
    private applyFilters(): void {
        // Aquí se aplicarían los filtros reales
        this.loadData();
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
     * Calcular el total de valores
     */
    private calculateTotal(data: { value: number }[]): number {
        return data.reduce((sum, item) => sum + item.value, 0);
    }

    /**
     * Calcular stroke-dasharray para gráficos circulares
     */
    calculateDashArray(value: number, data: { value: number }[]): string {
        const total = this.calculateTotal(data);
        const percentage = value / total;
        const circumference = 2 * Math.PI * 40; // r = 40
        const dashLength = circumference * percentage;
        return `${dashLength} ${circumference - dashLength}`;
    }

    /**
     * Calcular stroke-dashoffset para gráficos circulares
     */
    calculateDashOffset(index: number, data: { value: number }[]): string {
        const circumference = 2 * Math.PI * 40;
        let offset = 0;
        for (let i = 0; i < index; i++) {
            const percentage = data[i].value / this.calculateTotal(data);
            offset += circumference * percentage;
        }
        return offset.toString();
    }
}