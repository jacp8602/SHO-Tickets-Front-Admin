import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
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
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { finalize, Subject, takeUntil, debounceTime } from 'rxjs';

import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { ProductionsService } from '../../../core/productions/productions.service';
import { ProductionsResponse, ProductionFilters, Production } from '../../../core/productions/productions.types';
import { ProductionCreateDialogComponent } from '../production-create-dialog/production-create-dialog.component';

@Component({
    selector: 'app-production-list',
    templateUrl: './production-list.component.html',
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
        MatTooltipModule,
        MatDialogModule,
        FuseAlertComponent,
        PaginationComponent,
    ],
})
export class ProductionListComponent implements OnInit, OnDestroy {
    @Input() description: string = 'Manage your productions and their associated shows, venues, and events';
    @Output() productionCreated = new EventEmitter<void>();
    @Output() productionEdited = new EventEmitter<Production>();

    // Alert properties
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;

    // Data
    productions: Production[] = [];

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
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _productionsService: ProductionsService,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        // Create search form
        this.searchForm = this._formBuilder.group({
            keyword: ['']
        });

        // Load productions from API
        this._loadProductions();

        // Subscribe to search changes
        this.searchForm.get('keyword')?.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300)
            )
            .subscribe(() => {
                this.pageIndex = 1;
                this._loadProductions();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Load productions from server
     */
    private _loadProductions(): void {
        this.isLoading = true;
        this.showAlert = false;

        const apiPage = this.pageIndex - 1;
        const filters: ProductionFilters = {};

        // Apply search filter if exists
        const keyword = this.searchForm.get('keyword')?.value;
        if (keyword) {
            filters.search = keyword;
        }

        this._productionsService.getProductions(apiPage, this.pageSize, filters)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                })
            )
            .subscribe({
                next: (response: ProductionsResponse) => {
                    this.productions = response.productions;
                    this.totalItems = response.total;
                },
                error: (error) => {
                    console.error('[ProductionList] Error loading productions:', error);
                    this.alert = {
                        type: 'error',
                        message: 'Failed to load productions. Please try again.',
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
        this._loadProductions();
    }

    /**
     * Create new production - Open dialog
     */
    createProduction(): void {
        const dialogRef = this._dialog.open(ProductionCreateDialogComponent, {
            width: '600px',
            maxWidth: '95vw',
            disableClose: false,
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log('[ProductionList] Production created:', result);
                this.productionCreated.emit(result);

                // Reload productions list
                this._loadProductions();

                // Show success message
                this.alert = {
                    type: 'success',
                    message: 'Production created successfully.',
                };
                this.showAlert = true;

                // Hide alert after 3 seconds
                setTimeout(() => {
                    this.showAlert = false;
                }, 3000);
            }
        });
    }

    /**
     * Edit production - Navigate to detail
     */
    editProduction(production: Production): void {
        this._router.navigate(['/productions', production.id]);
    }

    /**
     * Refresh table
     */
    refreshTable(): void {
        this._loadProductions();
    }
}