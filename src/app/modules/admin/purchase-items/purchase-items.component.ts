import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

import { PurchaseItemsService } from '../../../core/purchase-items/purchase-items.service';
import { PurchaseItem } from '../../../core/purchase-items/purchase-items.types';
import { MatDivider } from "@angular/material/divider";

@Component({
    selector: 'app-purchase-items',
    templateUrl: './purchase-items.component.html',
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
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        FuseAlertComponent,
        PaginationComponent,
        MatDivider
    ],
})
export class PurchaseItemsComponent implements OnInit, OnDestroy {
    // Alert properties
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;

    // Loading state
    isLoading: boolean = true;

    // Contexto del evento seleccionado
    eventContext: {
        id?: string;
        venue?: string;
        event?: string;
    } = {};

    // Formulario de filtros
    filterForm: UntypedFormGroup;

    // Data
    items: PurchaseItem[] = [];
    filteredItems: PurchaseItem[] = [];
    
    // Paginación
    totalItems: number = 0;  // ✅ INICIALIZAR EN 0, no hardcodear
    pageSize: number = 10;
    pageIndex: number = 1;
    Math = Math;

    // Opciones para selects
    viewDataFromOptions = [
        { value: 'all', label: 'All Time' },
        { value: 'today', label: 'Today' },
        { value: 'week', label: 'This Week' },
        { value: 'month', label: 'This Month' }
    ];

    // Unsubscribe
    private _unsubscribeAll: Subject<void> = new Subject<void>();

    constructor(
        private _purchaseItemsService: PurchaseItemsService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _route: ActivatedRoute,
        private _snackBar: MatSnackBar
    ) {
        this.filterForm = this._formBuilder.group({
            viewDataFrom: ['all'],
            search: ['']
        });
    }

    ngOnInit(): void {
        // Obtener parámetros de navegación del componente padre
        this._route.queryParams
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(params => {
                this.eventContext = {
                    id: params['eventId'],
                    venue: params['venue'],
                    event: params['event']
                };
                this.loadData();
            });
        
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

        const filters = {
            eventId: this.eventContext.id,
            venue: this.eventContext.venue,
            event: this.eventContext.event
        };

        this._purchaseItemsService.getPurchaseItems(filters)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    if (response.success) {
                        this.items = response.data.items;
                        // ✅ CORRECCIÓN: Usar totalItems de la respuesta, no hardcodear
                        this.totalItems = response.data.totalItems;
                        this.applyFilters();
                    }
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading ', error);
                    this.alert = {
                        type: 'error',
                        message: 'Failed to load purchase items. Please try again.',
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
        // ✅ CORRECCIÓN: Actualizar totalItems filtrado si es necesario
        // this.totalItems = this.filteredItems.length; // Descomentar si filtras en frontend
    }

    /**
     * Obtener items de la página actual
     */
    get currentPageItems(): PurchaseItem[] {
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
     * Track by function
     */
    trackById(index: number, item: any): string {
        return item._id || index.toString();
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
     * Buscar
     */
    search(): void {
        this.pageIndex = 1;
        this.applyFilters();
        this._snackBar.open('Searching...', 'Close', {
            duration: 2000,
        });
    }

    /**
     * Navegar atrás
     */
    goBack(): void {
        this._router.navigate(['/current-future']);
    }
}