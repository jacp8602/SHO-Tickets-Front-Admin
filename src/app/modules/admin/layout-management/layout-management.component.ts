import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, takeUntil, debounceTime, finalize } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';

import { LayoutsService } from '../../../core/layouts/layouts.service';
import { Layout, LayoutFilters } from '../../../core/layouts/layouts.types';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { ProductionMenuComponent } from '../../shared/production-menu/production-menu.component';
import { MatDivider } from "@angular/material/divider";

@Component({
    selector: 'app-layout-management',
    templateUrl: './layout-management.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    FuseAlertComponent,
    PaginationComponent,
    ProductionMenuComponent,
    MatDivider
],
})
export class LayoutManagementComponent implements OnInit, OnDestroy {
    // Alert properties
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;

    // Data
    layouts: Layout[] = [];
    totalItems: number = 0;
    pageSize: number = 10;
    pageIndex: number = 1;
    isLoading: boolean = false;

    // Filters
    filterForm: UntypedFormGroup;

    // ID de producción (para el menú)
    productionId: string = '1'; // Valor por defecto

    // Status options
    statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'published', label: 'Published' },
        { value: 'draft', label: 'Draft' }
    ];

    // Unsubscribe
    private _unsubscribeAll: Subject<void> = new Subject<void>();

    constructor(
        private _layoutsService: LayoutsService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router
    ) {}

    ngOnInit(): void {
        // Obtener el ID de producción de la URL si existe
        this.getProductionIdFromUrl();

        // Create filter form
        this.filterForm = this._formBuilder.group({
            status: ['all']
            // El search fue eliminado
        });

        // Load layouts
        this._loadLayouts();

        // Subscribe to filter changes
        this.filterForm.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300)
            )
            .subscribe(() => {
                this.pageIndex = 1;
                this._loadLayouts();
            });
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
        const productionsIndex = urlSegments.indexOf('productions');
        if (productionsIndex !== -1 && productionsIndex + 1 < urlSegments.length) {
            this.productionId = urlSegments[productionsIndex + 1];
        }
    }

    /**
     * Load layouts from service
     */
    private _loadLayouts(): void {
        this.isLoading = true;
        this.showAlert = false;

        const filters: LayoutFilters = {
            status: this.filterForm.get('status')?.value,
            productionId: this.productionId
            // El search fue eliminado
        };

        const apiPage = this.pageIndex - 1;

        this._layoutsService.getLayouts(apiPage, this.pageSize, filters)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                })
            )
            .subscribe({
                next: (response) => {
                    this.layouts = response.layouts;
                    this.totalItems = response.total;
                },
                error: (error) => {
                    console.error('Error loading layouts:', error);
                    this.alert = {
                        type: 'error',
                        message: 'Failed to load layouts. Please try again.',
                    };
                    this.showAlert = true;
                }
            });
    }

    /**
     * Handle page change
     */
    onPageChange(page: number): void {
        this.pageIndex = page;
        this._loadLayouts();
    }

    /**
     * Navigate back
     */
    onClose(): void {
        this._router.navigate(['/productions']);
    }

    /**
     * Get status badge class
     */
    getStatusClass(status: string): string {
        switch(status) {
            case 'Published':
                return 'bg-green-100 text-green-800';
            case 'Draft':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }

    /**
     * Clear filters
     */
    clearFilters(): void {
        this.filterForm.reset({
            status: 'all'
        });
    }
}