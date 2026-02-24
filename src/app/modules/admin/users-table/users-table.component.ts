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
import { CommonModule } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { finalize, Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

// Importar el componente de paginación
import { PaginationComponent } from '../../shared/pagination/pagination.component';

import { UserListItem } from '../../../core/users/users.types';
import { UsersService, UsersResponse } from '../../../core/users/users.service';
import { MatDialog } from '@angular/material/dialog';
import { UserEditDialogComponent } from '../user-edit-dialog/user-edit-dialog.component';

// Interfaces para los filtros
export interface FilterOption {
    value: string;
    label: string;
}

@Component({
    selector: 'app-users-table',
    templateUrl: './users-table.component.html',
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
export class UsersTableComponent implements OnInit, OnDestroy {
    // @Input() title: string = '';
    @Input() description: string = 'Manage event types, shows, venues, event dates, seat types and layout assignments';
    @Output() userCreated = new EventEmitter<void>();
    @Output() userEdited = new EventEmitter<UserListItem>();
    @Output() userDeleted = new EventEmitter<UserListItem>();

    @ViewChild('usersTableNgForm') usersTableNgForm: NgForm;

    // Alert properties
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;

    // Data
    users: UserListItem[] = [];
    displayedColumns: string[] = ['select', 'name', 'email', 'status', 'actions'];
    
    // Pagination - Estas propiedades se pasarán al componente hijo
    totalUsers: number = 0;
    pageSize: number = 4;
    pageIndex: number = 1;

    // Selection
    selectAll: boolean = false;
    selectedUsers: Set<string> = new Set();

    // Loading state
    isLoading: boolean = false;

    // Form
    filterForm: UntypedFormGroup;

    // Opciones para los filtros (estos vendrían de un servicio en un caso real)
    productionOptions: FilterOption[] = [
        { value: 'all', label: 'All Productions' },
        { value: 'nuclear-circus', label: 'Nuclear Circus' },
        { value: 'broadway-show', label: 'Broadway Show' },
        { value: 'rock-concert', label: 'Rock Concert' },
        { value: 'comedy-night', label: 'Comedy Night' }
    ];

    showOptions: FilterOption[] = [
        { value: 'all', label: 'All Shows' },
        { value: 'the-lion-king', label: 'The Lion King' },
        { value: 'phantom-opera', label: 'The Phantom of the Opera' },
        { value: 'hamilton', label: 'Hamilton' },
        { value: 'wicked', label: 'Wicked' }
    ];

    cityOptions: FilterOption[] = [
        { value: 'all', label: 'All Cities' },
        { value: 'new-york', label: 'New York' },
        { value: 'miami', label: 'Miami' },
        { value: 'los-angeles', label: 'Los Angeles' },
        { value: 'chicago', label: 'Chicago' },
        { value: 'las-vegas', label: 'Las Vegas' }
    ];

    // Unsubscribe
    private _unsubscribeAll: Subject<void> = new Subject<void>();

    /**
     * Constructor
     */
    constructor(
        private _usersService: UsersService,
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
        // Create filter form with Production, Show and City filters
        this.filterForm = this._formBuilder.group({
            production: ['all'],
            show: ['all'],
            city: ['all']
        });

        // Load users
        // this._loadUsers();
        this.loadTestUsers();

        // Subscribe to filter changes with debounce
        this.filterForm.valueChanges
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
                this._loadUsers();
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
    private _loadUsers(): void {
        this.isLoading = true;
        this.showAlert = false;

        const apiPage = this.pageIndex - 1;
        const filters = {
            production: this.filterForm.get('production').value !== 'all' ? this.filterForm.get('production').value : null,
            show: this.filterForm.get('show').value !== 'all' ? this.filterForm.get('show').value : null,
            city: this.filterForm.get('city').value !== 'all' ? this.filterForm.get('city').value : null,
        };

        this._usersService.getUsers(apiPage, this.pageSize, filters)
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                })
            )
            .subscribe({
                next: (response: UsersResponse) => {
                    this.users = response.users;
                    this.totalUsers = response.total;
                    this._clearSelection();
                },
                error: (error) => {
                    console.error('Error loading users:', error);
                    this.alert = {
                        type: 'error',
                        message: 'Failed to load users. Please try again.',
                    };
                    this.showAlert = true;
                }
            });
    }

    /**
     * Clear selection
     */
    private _clearSelection(): void {
        this.selectedUsers.clear();
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
        this._loadUsers();
    }

    /**
     * Create new user
     */
    createUser(): void {
        this.userCreated.emit();
    }

    /**
     * Edit user
     */
    editUser(user: UserListItem): void {
        const dialogRef = this._dialog.open(UserEditDialogComponent, {
            width: '700px',
            maxWidth: '95vw',
            disableClose: true,
            data: { user: user }
        });

        dialogRef.afterClosed().subscribe((updatedUser: UserListItem) => {
            if (updatedUser) {
                console.log('Usuario actualizado:', updatedUser);
                this.userEdited.emit(updatedUser);
                
                // Mostrar mensaje de éxito
                this.alert = {
                    type: 'success',
                    message: 'User updated successfully.',
                };
                this.showAlert = true;
                
                // Recargar usuarios si es necesario
                this._loadUsers();
                
                // Ocultar alerta después de 3 segundos
                setTimeout(() => {
                    this.showAlert = false;
                }, 3000);
            }
        });
    }

    /**
     * Delete user
     */
    deleteUser(user: UserListItem): void {
        if (confirm(`Are you sure you want to delete ${user.name}?`)) {
            this.isLoading = true;
            
            this._usersService.deleteUser(user.id)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    finalize(() => {
                        this.isLoading = false;
                    })
                )
                .subscribe({
                    next: () => {
                        this.alert = {
                            type: 'success',
                            message: 'User deleted successfully.',
                        };
                        this.showAlert = true;
                        this._loadUsers();
                        this.userDeleted.emit(user);
                        
                        // Hide alert after 3 seconds
                        setTimeout(() => {
                            this.showAlert = false;
                        }, 3000);
                    },
                    error: (error) => {
                        console.error('Error deleting user:', error);
                        this.alert = {
                            type: 'error',
                            message: 'Failed to delete user. Please try again.',
                        };
                        this.showAlert = true;
                    }
                });
        }
    }

    /**
     * Delete selected users
     */
    deleteSelectedUsers(): void {
        if (this.selectedUsers.size === 0) return;

        const message = this.selectedUsers.size === 1 
            ? 'Are you sure you want to delete the selected user?' 
            : `Are you sure you want to delete ${this.selectedUsers.size} users?`;

        if (confirm(message)) {
            this.isLoading = true;
            
            // Aquí implementarías la lógica para eliminar múltiples usuarios
            // Por ahora solo emitimos el evento
            this.userDeleted.emit();
            
            setTimeout(() => {
                this.isLoading = false;
                this._clearSelection();
                this._loadUsers();
            }, 1000);
        }
    }

    /**
     * Toggle select all users
     */
    toggleSelectAll(): void {
        this.selectAll = !this.selectAll;
        
        if (this.selectAll) {
            this.users.forEach(user => {
                if (user.id) {
                    this.selectedUsers.add(user.id);
                }
            });
        } else {
            this._clearSelection();
        }
    }

    /**
     * Toggle select user
     */
    toggleSelectUser(user: UserListItem): void {
        if (!user.id) return;
        
        if (this.selectedUsers.has(user.id)) {
            this.selectedUsers.delete(user.id);
        } else {
            this.selectedUsers.add(user.id);
        }
        
        this.selectAll = this.users.length > 0 && 
                        this.users.every(u => u.id && this.selectedUsers.has(u.id));
    }

    /**
     * Check if user is selected
     */
    isSelected(user: UserListItem): boolean {
        return user.id ? this.selectedUsers.has(user.id) : false;
    }

    /**
     * Get total pages (para compatibilidad con el template)
     */
    get totalPages(): number {
        return Math.ceil(this.totalUsers / this.pageSize);
    }

    /**
     * Get selected count
     */
    get selectedCount(): number {
        return this.selectedUsers.size;
    }

    /**
     * Refresh table
     */
    refreshTable(): void {
        this._loadUsers();
    }

    /**
     * Carga datos de prueba con 3 usuarios para verificar la visualización
     */
    loadTestUsers(): void {
        this.users = [
            {
                id: '1',
                name: 'John Smith',
                username: 'john.smith',
                email: 'john.smith@example.com',
                phone: '22 629098',
                status: 'active',
                avatar: null,
                initials: ''
            },
            {
                id: '2',
                name: 'Maria Garcia',
                username: 'maria.garcia',
                email: 'maria.garcia@example.com',
                phone: '22 629098',
                status: 'pending',
                avatar: null,
                initials: ''
            },
            {
                id: '3',
                name: 'Robert Johnson',
                username: 'robert.johnson',
                email: 'robert.johnson@example.com',
                phone: '22 792783',
                status: 'inactive',
                avatar: null,
                initials: ''
            }
        ];
        
        this.totalUsers = 3;
        this.isLoading = false;
        console.log('✅ Datos de prueba cargados: 3 usuarios');
    }

}