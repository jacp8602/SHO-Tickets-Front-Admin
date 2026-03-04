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
// import { MatDivider } from "@angular/material/divider";
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

import { AdministratorSummaryService } from '../../../core/administrator-summary/administrator-summary.service';
import { AdministratorSummaryItem } from '../../../core/administrator-summary/administrator-summary.types';

@Component({
    selector: 'app-administrator-summary',
    templateUrl: './administrator-summary.component.html',
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
        // MatDivider,
    ],
})
export class AdministratorSummaryComponent implements OnInit, OnDestroy {
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
    items: AdministratorSummaryItem[] = [];
    filteredItems: AdministratorSummaryItem[] = [];
    
    // Paginación
    totalItems: number = 0;
    pageSize: number = 10;
    pageIndex: number = 1;
    Math = Math;

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
        { value: 'pending', label: 'Pending' }
    ];

    paymentMethodOptions = [
        { value: 'all', label: 'All Methods' },
        { value: 'credit_card', label: 'Credit Card' },
        { value: 'cash', label: 'Cash' }
    ];

    // Unsubscribe
    private _unsubscribeAll: Subject<void> = new Subject<void>();

    constructor(
        private _administratorSummaryService: AdministratorSummaryService,
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

        this._administratorSummaryService.getAdministratorSummary()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    if (response.success) {
                        this.items = response.data.items;
                        this.applyFilters();
                    }
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading data:', error);
                    this.alert = {
                        type: 'error',
                        message: 'Failed to load data. Please try again.',
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
        this.filteredItems = [...this.items];
        this.totalItems = this.filteredItems.length;
    }

    /**
     * Obtener items de la página actual
     */
    get currentPageItems(): AdministratorSummaryItem[] {
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
}