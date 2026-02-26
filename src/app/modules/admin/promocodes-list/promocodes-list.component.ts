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
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { finalize, Subject, takeUntil, debounceTime } from 'rxjs';

import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { PromoCodeDialogComponent } from '../promo-code-dialog/promo-code-dialog.component';
import { PromocodesService } from '../../../core/promocodes/promocodes.service';
import { PromoCode } from '../../../core/promocodes/promocodes.types';

@Component({
    selector: 'app-promocodes-list',
    templateUrl: './promocodes-list.component.html',
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
        MatProgressSpinnerModule,
        MatMenuModule,
        MatCheckboxModule,
        MatSelectModule,
        MatTooltipModule,
        FuseAlertComponent,
        PaginationComponent,
    ],
})
export class PromocodesListComponent implements OnInit, OnDestroy {
    // Alert properties
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;

    // Data
    promocodes: PromoCode[] = [];
    
    // Pagination
    totalItems: number = 0;
    pageSize: number = 10;
    pageIndex: number = 1;

    // Loading state
    isLoading: boolean = false;

    // Search form
    searchForm: UntypedFormGroup;

    // Unsubscribe
    private _unsubscribeAll: Subject<void> = new Subject<void>();

    constructor(
        private _promocodesService: PromocodesService,
        private _formBuilder: UntypedFormBuilder,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        // Create search form
        this.searchForm = this._formBuilder.group({
            keyword: ['']
        });

        // Load promocodes
        this._loadPromocodes();

        // Subscribe to search changes
        this.searchForm.get('keyword')?.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300)
            )
            .subscribe(() => {
                this.pageIndex = 1;
                this._loadPromocodes();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Load promocodes from server
     */
    private _loadPromocodes(): void {
        this.isLoading = true;
        this.showAlert = false;

        const apiPage = this.pageIndex - 1;
        const filters = {
            search: this.searchForm.get('keyword')?.value
        };

        this._promocodesService.getPromocodes(apiPage, this.pageSize, filters)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                })
            )
            .subscribe({
                next: (response) => {
                    this.promocodes = response.promocodes;
                    this.totalItems = response.total;
                },
                error: (error) => {
                    console.error('Error loading promocodes:', error);
                    this.alert = {
                        type: 'error',
                        message: 'Failed to load promocodes. Please try again.',
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
        this._loadPromocodes();
    }

    /**
     * Create new promo code
     */
    createPromocode(): void {
        const dialogRef = this._dialog.open(PromoCodeDialogComponent, {
            width: '800px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            disableClose: true,
            data: { mode: 'create' }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log('Promo code creado:', result);
                this._loadPromocodes();
                
                this.alert = {
                    type: 'success',
                    message: 'Promo code created successfully.',
                };
                this.showAlert = true;
                
                setTimeout(() => {
                    this.showAlert = false;
                }, 3000);
            }
        });
    }

    /**
     * Edit promo code
     */
    editPromocode(promocode: PromoCode): void {
        const dialogRef = this._dialog.open(PromoCodeDialogComponent, {
            width: '800px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            disableClose: true,
            data: { mode: 'edit', promocode: promocode }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log('Promo code actualizado:', result);
                this._loadPromocodes();
                
                this.alert = {
                    type: 'success',
                    message: 'Promo code updated successfully.',
                };
                this.showAlert = true;
                
                setTimeout(() => {
                    this.showAlert = false;
                }, 3000);
            }
        });
    }

    /**
     * Delete promo code
     */
    deletePromocode(promocode: PromoCode): void {
        if (confirm(`Are you sure you want to delete ${promocode.promoCodeName}?`)) {
            this.isLoading = true;
            
            this._promocodesService.deletePromocode(promocode.id)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    finalize(() => {
                        this.isLoading = false;
                    })
                )
                .subscribe({
                    next: () => {
                        this._loadPromocodes();
                        
                        this.alert = {
                            type: 'success',
                            message: 'Promo code deleted successfully.',
                        };
                        this.showAlert = true;
                        
                        setTimeout(() => {
                            this.showAlert = false;
                        }, 3000);
                    },
                    error: (error) => {
                        console.error('Error deleting promocode:', error);
                        this.alert = {
                            type: 'error',
                            message: 'Failed to delete promo code.',
                        };
                        this.showAlert = true;
                    }
                });
        }
    }

    /**
     * Toggle active status
     */
    toggleActive(promocode: PromoCode, event: any): void {
        event.stopPropagation();
        
        const updated = { ...promocode, active: !promocode.active };
        
        this._promocodesService.updatePromocode(promocode.id, updated)
            .subscribe({
                next: () => {
                    this._loadPromocodes();
                },
                error: (error) => {
                    console.error('Error updating status:', error);
                }
            });
    }

    /**
     * Get status badge class
     */
    getStatusClass(status: string): string {
        switch(status) {
            case 'Available':
                return 'bg-green-100 text-green-800';
            case 'Disable':
                return 'bg-red-100 text-red-800';
            case 'Expired':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }
}