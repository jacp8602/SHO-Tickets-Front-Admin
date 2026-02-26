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
import { ProductionMenuComponent } from '../../shared/production-menu/production-menu.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

import { AddonsService } from '../../../core/addons/addons.service';
import { AddonItem } from '../../../core/addons/addons.types';

@Component({
    selector: 'app-addons',
    templateUrl: './addons.component.html',
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
        ProductionMenuComponent,
        PaginationComponent,
    ],
})
export class AddonsComponent implements OnInit, OnDestroy {
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

    // Addons para la lista
    addons: AddonItem[] = [];
    
    // Paginación
    totalItems: number = 0;
    pageSize: number = 10;
    pageIndex: number = 1;
    Math = Math;

    // Búsqueda
    searchTerm: string = '';

    // Unsubscribe
    private _unsubscribeAll: Subject<void> = new Subject<void>();

    constructor(
        private _addonsService: AddonsService,
        private _router: Router,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        // Obtener el ID de producción de la URL
        this.getProductionIdFromUrl();
        
        // Cargar addons
        this.loadAddons();
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
     * Cargar addons desde el servicio
     */
    private loadAddons(): void {
        this.isLoading = true;
        this.showAlert = false;

        this._addonsService.getAddons(this.productionId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    if (response.success && response.data) {
                        this.addons = response.data.addons;
                        this.totalItems = this.addons.length;
                    }
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading addons:', error);
                    this.alert = {
                        type: 'error',
                        message: 'Failed to load addons. Please try again.',
                    };
                    this.showAlert = true;
                    this.isLoading = false;
                }
            });
    }

    /**
     * Obtener addons de la página actual (filtrados por búsqueda)
     */
    get currentPageAddons(): AddonItem[] {
        // Primero filtrar por búsqueda
        const filtered = this.searchTerm 
            ? this.addons.filter(a => 
                a.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                a.category.toLowerCase().includes(this.searchTerm.toLowerCase())
              )
            : this.addons;
        
        // Luego paginar
        const start = (this.pageIndex - 1) * this.pageSize;
        const end = start + this.pageSize;
        return filtered.slice(start, end);
    }

    /**
     * Obtener total de items filtrados (para la paginación)
     */
    get filteredTotalItems(): number {
        if (!this.searchTerm) {
            return this.totalItems;
        }
        return this.addons.filter(a => 
            a.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            a.category.toLowerCase().includes(this.searchTerm.toLowerCase())
        ).length;
    }

    /**
     * Handle page change
     */
    onPageChange(page: number): void {
        this.pageIndex = page;
    }

    /**
     * Toggle addon enabled state
     */
    toggleAddon(addon: AddonItem): void {
        const originalState = addon.enabled;
        addon.enabled = !addon.enabled;
        
        this._addonsService.toggleAddon(this.productionId, addon.id)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                error: (error) => {
                    console.error('Error toggling addon:', error);
                    addon.enabled = originalState;
                    this._snackBar.open('Error updating addon', 'Close', {
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

        this._addonsService.saveAddons(this.productionId, this.addons)
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
                            message: 'Addons saved successfully.',
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
                    console.error('Error saving addons:', error);
                    this.alert = {
                        type: 'error',
                        message: 'Failed to save addons.',
                    };
                    this.showAlert = true;
                }
            });
    }

    /**
     * Add new addon
     */
    addNewAddon(): void {
        const newAddon: Omit<AddonItem, 'id'> = {
            name: 'New Addon',
            category: 'Other',
            price: 0,
            quantity: 0,
            enabled: true
        };
        
        this._addonsService.addAddon(this.productionId, newAddon)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    if (response.success && response.data) {
                        this.addons = response.data.addons;
                        this.totalItems = this.addons.length;
                        
                        // Ir a la última página
                        this.pageIndex = Math.ceil(this.totalItems / this.pageSize);
                        
                        this._snackBar.open('New addon added', 'Close', {
                            duration: 2000,
                        });
                    }
                },
                error: (error) => {
                    console.error('Error adding addon:', error);
                    this._snackBar.open('Error adding addon', 'Close', {
                        duration: 2000,
                    });
                }
            });
    }

    /**
     * Edit addon
     */
    editAddon(addon: AddonItem): void {
        console.log('Edit addon:', addon);
        this._snackBar.open(`Configure: ${addon.name}`, 'Close', {
            duration: 2000,
        });
    }

    /**
     * Delete addon
     */
    deleteAddon(addon: AddonItem): void {
        if (confirm(`Are you sure you want to delete "${addon.name}"?`)) {
            this._addonsService.deleteAddon(this.productionId, addon.id)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe({
                    next: (response) => {
                        if (response.success && response.data) {
                            this.addons = response.data.addons;
                            this.totalItems = this.addons.length;
                            
                            // Ajustar página
                            if (this.pageIndex > Math.ceil(this.totalItems / this.pageSize)) {
                                this.pageIndex = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
                            }
                            
                            this._snackBar.open('Addon deleted', 'Close', {
                                duration: 2000,
                            });
                        }
                    },
                    error: (error) => {
                        console.error('Error deleting addon:', error);
                        this._snackBar.open('Error deleting addon', 'Close', {
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
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(price);
    }

    /**
     * Obtener color según categoría
     */
    getCategoryColor(category: string): string {
        switch(category) {
            case 'Food':
                return 'bg-amber-500';
            case 'Drink':
                return 'bg-sky-500';
            case 'Merchandise':
                return 'bg-fuchsia-500';
            case 'Experience':
                return 'bg-emerald-500';
            case 'Both':
                return 'bg-teal-500';
            default:
                return 'bg-gray-400';
        }
    }

    /**
     * Track by function
     */
    trackById(index: number, item: any): string {
        return item.id;
    }
}