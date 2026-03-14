import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Subject, takeUntil, debounceTime } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

import { VenueLayoutsService } from '../../../core/venue-layouts/venue-layouts.service';
import { VenueLayout } from '../../../core/venue-layouts/venue-layouts.types';
import { MatDialog } from '@angular/material/dialog';
import { EventAssociatedDialogComponent } from '../event-associated-dialog/event-associated-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-venue-layouts',
    templateUrl: './venue-layouts.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatTooltipModule,
        FuseAlertComponent,
        PaginationComponent,
        MatDialogModule,
    ],
})
export class VenueLayoutsComponent implements OnInit, OnDestroy {
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;
    isLoading: boolean = false;
    layouts: VenueLayout[] = [];
    totalItems: number = 0;

    filterForm: UntypedFormGroup;

    statusOptions = [
        { value: 'all', label: 'All Status' },
        { value: 'Published', label: 'Published' },
        { value: 'Draft', label: 'Draft' }
    ];

    productionOptions: { value: string; label: string }[] = [];

    pageSize: number = 10;
    pageIndex: number = 1;
    Math = Math;

    private _unsubscribeAll: Subject<void> = new Subject<void>();

    constructor(
        private _venueLayoutsService: VenueLayoutsService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _dialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.filterForm = this._formBuilder.group({
            status: ['all'],
            production: ['all'],
            search: ['']
        });

        this.loadProductionOptions();
        this.loadLayouts();

        this.filterForm.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300)
            )
            .subscribe(() => {
                this.pageIndex = 1;
                this.loadLayouts();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadProductionOptions(): void {
        this._venueLayoutsService.getProductionOptions()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(options => {
                this.productionOptions = options;
            });
    }

    loadLayouts(): void {
        this.isLoading = true;
        this.showAlert = false;

        const filters = {
            status: this.filterForm.get('status')?.value,
            production: this.filterForm.get('production')?.value,
            search: this.filterForm.get('search')?.value
        };

        this._venueLayoutsService.getLayouts(filters)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    this.layouts = response.layouts;
                    this.totalItems = response.total;
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading layouts:', error);
                    this.alert = {
                        type: 'error',
                        message: 'Failed to load layouts.',
                    };
                    this.showAlert = true;
                    this.isLoading = false;
                }
            });
    }

    onPageChange(page: number): void {
        this.pageIndex = page;
    }

    get currentPageLayouts(): VenueLayout[] {
        const start = (this.pageIndex - 1) * this.pageSize;
        const end = start + this.pageSize;
        return this.layouts.slice(start, end);
    }

    newLayout(): void {
        console.log('New layout');
        // this._router.navigate(['/venue-layouts/new']);
    }

    editLayout(layout: VenueLayout): void {
        console.log('Edit layout:', layout);
        // this._router.navigate(['/venue-layouts', layout.id]);
    }

    copyLayout(layout: VenueLayout): void {
        console.log('Copy layout:', layout);
        // Lógica para duplicar
    }

    viewLayout(layout: VenueLayout): void {
        console.log('View layout:', layout);
        // Navegar a detalles
    }

    deleteLayout(layout: VenueLayout): void {
        if (confirm(`Are you sure you want to delete "${layout.name}"?`)) {
            this._venueLayoutsService.deleteLayout(layout.id)
                .pipe(takeUntil(this._unsubscribeAll))
                .subscribe({
                    next: (success) => {
                        if (success) {
                            this.loadLayouts();
                            this.alert = {
                                type: 'success',
                                message: 'Layout deleted successfully.',
                            };
                            this.showAlert = true;
                            setTimeout(() => this.showAlert = false, 3000);
                        }
                    },
                    error: (error) => {
                        console.error('Error deleting layout:', error);
                        this.alert = {
                            type: 'error',
                            message: 'Failed to delete layout.',
                        };
                        this.showAlert = true;
                    }
                });
        }
    }

    getStatusClass(status: string): string {
        switch(status) {
            case 'Published': return 'bg-green-100 text-green-800';
            case 'Draft': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    // Método para abrir el diálogo con el nuevo nombre
    openEventDialog(layout: VenueLayout): void {
        this._dialog.open(EventAssociatedDialogComponent, {
            width: '1200px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            disableClose: false,
            data: {
                layoutId: layout.id,
                eventCount: layout.events
            }
        });
    }
}