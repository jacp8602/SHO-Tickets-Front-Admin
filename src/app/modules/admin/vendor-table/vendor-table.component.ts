import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import {
    FormsModule,
    NgForm,
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
import { finalize, Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

// Importar el componente de paginación
import { PaginationComponent } from '../../shared/pagination/pagination.component';

import { VendorListItem } from '../../../core/vendors/vendors.types';
import { VendorsService, VendorsResponse } from '../../../core/vendors/vendors.service';
// import { UserEditDialogComponent } from '../user-edit-dialog/user-edit-dialog.component';

@Component({
    selector: 'app-vendors-table',
    templateUrl: './vendor-table.component.html',
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
        PaginationComponent, // Importar el componente de paginación
    ],
})
export class VendorTableComponent implements OnInit, OnDestroy {
    // @Input() title: string = '';
    @Input() description: string = 'Manage event types, shows, venues, event dates, seat types and layout assignments';
    @Output() vendorCreated = new EventEmitter<void>();
    @Output() vendorEdited = new EventEmitter<VendorListItem>();
    @Output() vendorDeleted = new EventEmitter<VendorListItem>();

    @ViewChild('usersTableNgForm') usersTableNgForm: NgForm;

    // Alert properties
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;

    // Data
    vendors: VendorListItem[] = [];
    displayedColumns: string[] = ['source', 'name', 'description', 'id', 'actions'];
    
    // Pagination - Estas propiedades se pasarán al componente hijo
    totalVendors: number = 0;
    pageSize: number = 4;
    pageIndex: number = 1;

    // Selection
    selectAll: boolean = false;
    selectedVendors: Set<string> = new Set();

    // Loading state
    isLoading: boolean = false;

    // Form
    searchForm: UntypedFormGroup;

    // Unsubscribe
    private _unsubscribeAll: Subject<void> = new Subject<void>();

    /**
     * Constructor
     */
    constructor(
        private _vendorsService: VendorsService,
        private _formBuilder: UntypedFormBuilder,
        private _dialog: MatDialog // Añadir esto
    ) {}

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Create search form with Production, Show and City filters
        this.searchForm = this._formBuilder.group({
            production: ['all'],
            show: ['all'],
            city: ['all']
        });

        // Load users
        // this._loadUsers();
        this.loadTestVendors();

        // Subscribe to filter changes with debounce
        this.searchForm.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged((prev, curr) => 
                    prev.production === curr.production && 
                    prev.show === curr.show && 
                    prev.city === curr.city
                )
            )
            .subscribe(() => {
                this.pageIndex = 1; // Reset to first page when filters change
                this._loadVendors();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Load users from server
     */
    private _loadVendors(): void {
        // this.isLoading = true;
        // this.showAlert = false;

        // const apiPage = this.pageIndex - 1;
        // const filters = {
        //     production: this.searchForm.get('production').value !== 'all' ? this.searchForm.get('production').value : null,
        //     show: this.searchForm.get('show').value !== 'all' ? this.searchForm.get('show').value : null,
        //     city: this.searchForm.get('city').value !== 'all' ? this.searchForm.get('city').value : null,
        // };

        // this._vendorsService.getVendors(apiPage, this.pageSize, filters)
        //     .pipe(
        //         takeUntil(this._unsubscribeAll),
        //         finalize(() => {
        //             this.isLoading = false;
        //         })
        //     )
        //     .subscribe({
        //         next: (response: VendorsResponse) => {
        //             this.vendors = response.vendors;
        //             this.totalVendors = response.total;
        //             this._clearSelection();
        //         },
        //         error: (error) => {
        //             console.error('Error loading vendors:', error);
        //             this.alert = {
        //                 type: 'error',
        //                 message: 'Failed to load vendors. Please try again.',
        //             };
        //             this.showAlert = true;
        //         }
        //     });
    }

    /**
     * Clear selection
     */
    private _clearSelection(): void {
        this.selectedVendors.clear();
        this.selectAll = false;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Handle page change from pagination component
     */
    onPageChange(page: number): void {
        this.pageIndex = page;
        this._loadVendors();
    }

    /**
     * Create new vendor
     */
    createVendor(): void {
        this.vendorCreated.emit();
    }

    /**
     * Edit vendor
     */
    editVendor(vendor: VendorListItem): void {
        console.log(vendor);
        // const dialogRef = this._dialog.open(UserEditDialogComponent, {
        //     width: '700px',
        //     maxWidth: '95vw',
        //     disableClose: true,
        //     data: { user: user }
        // });

        // dialogRef.afterClosed().subscribe((updatedUser: VendorListItem) => {
        //     if (updatedUser) {
        //         console.log('Usuario actualizado:', updatedUser);
        //         this.userEdited.emit(updatedUser);
                
        //         // Mostrar mensaje de éxito
        //         this.alert = {
        //             type: 'success',
        //             message: 'User updated successfully.',
        //         };
        //         this.showAlert = true;
                
        //         // Recargar usuarios si es necesario
        //         this._loadUsers();
                
        //         // Ocultar alerta después de 3 segundos
        //         setTimeout(() => {
        //             this.showAlert = false;
        //         }, 3000);
        //     }
        // });
    }

    /**
     * Delete vendor
     */
    deleteVendor(vendor: VendorListItem): void {
        console.log(vendor);
        // if (confirm(`Are you sure you want to delete ${user.name}?`)) {
        //     this.isLoading = true;
            
        //     this._vendorsService.deleteUser(user.id)
        //         .pipe(
        //             takeUntil(this._unsubscribeAll),
        //             finalize(() => {
        //                 this.isLoading = false;
        //             })
        //         )
        //         .subscribe({
        //             next: () => {
        //                 this.alert = {
        //                     type: 'success',
        //                     message: 'User deleted successfully.',
        //                 };
        //                 this.showAlert = true;
        //                 this._loadUsers();
        //                 this.userDeleted.emit(user);
                        
        //                 // Hide alert after 3 seconds
        //                 setTimeout(() => {
        //                     this.showAlert = false;
        //                 }, 3000);
        //             },
        //             error: (error) => {
        //                 console.error('Error deleting user:', error);
        //                 this.alert = {
        //                     type: 'error',
        //                     message: 'Failed to delete user. Please try again.',
        //                 };
        //                 this.showAlert = true;
        //             }
        //         });
        // }
    }

    /**
     * Delete selected vendors
     */
    deleteSelectedVendors(): void {
        console.log('deleteSelectedVendors');
        // if (this.selectedUsers.size === 0) return;

        // const message = this.selectedUsers.size === 1 
        //     ? 'Are you sure you want to delete the selected user?' 
        //     : `Are you sure you want to delete ${this.selectedUsers.size} users?`;

        // if (confirm(message)) {
        //     this.isLoading = true;
            
        //     // Aquí implementarías la lógica para eliminar múltiples usuarios
        //     // Por ahora solo emitimos el evento
        //     this.userDeleted.emit();
            
        //     setTimeout(() => {
        //         this.isLoading = false;
        //         this._clearSelection();
        //         this._loadUsers();
        //     }, 1000);
        // }
    }

    /**
     * Toggle select all users
     */
    toggleSelectAll(): void {
        this.selectAll = !this.selectAll;
        
        if (this.selectAll) {
            this.vendors.forEach(vendor => {
                if (vendor.id) {
                    this.selectedVendors.add(vendor.id);
                }
            });
        } else {
            this._clearSelection();
        }
    }

    /**
     * Toggle select user
     */
    toggleSelectVendor(vendor: VendorListItem): void {
        if (!vendor.id) return;
        
        if (this.selectedVendors.has(vendor.id)) {
            this.selectedVendors.delete(vendor.id);
        } else {
            this.selectedVendors.add(vendor.id);
        }
        
        this.selectAll = this.vendors.length > 0 && 
                        this.vendors.every(u => u.id && this.selectedVendors.has(u.id));
    }

    /**
     * Check if user is selected
     */
    isSelected(vendor: VendorListItem): boolean {
        return vendor.id ? this.selectedVendors.has(vendor.id) : false;
    }

    /**
     * Get total pages (para compatibilidad con el template)
     */
    get totalPages(): number {
        return Math.ceil(this.totalVendors / this.pageSize);
    }

    /**
     * Get selected count
     */
    get selectedCount(): number {
        return this.selectedVendors.size;
    }

    /**
     * Refresh table
     */
    refreshTable(): void {
        this._loadVendors();
    }

    /**
     * Carga datos de prueba con 3 usuarios para verificar la visualización
     */
    loadTestVendors(): void {
        this.vendors = [
            {
                id: '563226JJKS',
                name: 'POS',
                description: 'POS WEB',
                source: 'WEB'
            },
            {
                id: '8953352AAGG',
                name: 'EXPEDIA',
                description: 'TOURS COMSSIONER',
                source: 'WEB'
            }
        ];
        
        this.totalVendors = 2;
        this.isLoading = false;
        console.log('✅ Datos de prueba cargados: 3 vendor');
    }

}