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
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { finalize, Subject, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs';

import { PaginationComponent } from '../../shared/pagination/pagination.component';

import { UserListItem } from '../../../core/users/users.types';
import { UsersService } from '../../../core/users/users.service';
import { MatDialog } from '@angular/material/dialog';
import { UserEditDialogComponent } from '../user-edit-dialog/user-edit-dialog.component';

export interface FilterOption {
    value: string;
    label: string;
}

@Component({
    selector: 'app-users-table',
    templateUrl: './users-table.component.html',
    styleUrl: './users-table.component.scss',
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
        MatSelectModule,
        MatTooltipModule,
        FuseAlertComponent,
        PaginationComponent,
    ],
})
export class UsersTableComponent implements OnInit, OnDestroy {
    @Input() description: string = 'Manage your users';
    @Output() userCreated = new EventEmitter<void>();
    @Output() userEdited = new EventEmitter<UserListItem>();
    @Output() userDeleted = new EventEmitter<UserListItem>();
    @Output() passwordReset = new EventEmitter<UserListItem>();
    @Output() statusToggled = new EventEmitter<UserListItem>();

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;

    // Current logged user ID - this should come from auth service in production
    currentUserId: string = '1';

    users: UserListItem[] = [];
    displayedColumns: string[] = ['photo', 'firstName', 'lastName', 'phone', 'email', 'role', 'status', 'actions'];
    
    // Mock users for testing - set useMock: false to use real API
    private useMock: boolean = true;

    totalUsers: number = 0;
    pageSize: number = 10;
    pageIndex: number = 1;

    isLoading: boolean = false;

    filterForm: UntypedFormGroup;

    searchQuery: string = '';
    statusFilter: string = 'status';
    statusDropdownOpen: boolean = false;

    statusOptions: FilterOption[] = [
        { value: 'status', label: 'Status' },
        { value: 'ACTIVE', label: 'Active' },
        { value: 'INACTIVE', label: 'Inactive' }
    ];

    toggleStatusDropdown(): void {
        this.statusDropdownOpen = !this.statusDropdownOpen;
    }

    selectStatus(value: string): void {
        this.statusFilter = value;
        this.statusDropdownOpen = false;
        this.filterForm.get('status')?.setValue(value);
    }

    getSelectedStatusLabel(): string {
        const option = this.statusOptions.find(o => o.value === this.statusFilter);
        return option ? option.label : 'Status';
    }

    clearFilters(): void {
        this.statusFilter = 'status';
        this.filterForm.reset({
            search: '',
            status: 'status'
        });
        this.searchQuery = '';
        this.pageIndex = 1;
        this._loadUsers();
    }

    private _unsubscribeAll: Subject<void> = new Subject<void>();

    constructor(
        private _usersService: UsersService,
        private _formBuilder: UntypedFormBuilder,
        private _dialog: MatDialog
    ) {
        // Initialize filterForm in constructor to fix TS error
        this.filterForm = this._formBuilder.group({
            search: [''],
            status: ['status']
        });
    }

    ngOnInit(): void {
        this.filterForm = this._formBuilder.group({
            search: [''],
            status: ['status']
        });

        this.filterForm.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe((value) => {
                this.searchQuery = value.search || '';
                this.statusFilter = value.status || 'status';
                this.pageIndex = 1;
                this._loadUsers();
            });

        this._loadUsers();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    private _loadUsers(): void {
        this.isLoading = true;
        this.showAlert = false;

        // Use mock data for testing - set useMock: false to use real API
        if (this.useMock) {
            this._loadMockUsers();
            return;
        }

        this._usersService.getAllUsers()
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                })
            )
            .subscribe({
                next: (backendUsers) => {
                    let users = backendUsers.map(user => this._usersService.transformUser(user));

                    if (this.searchQuery) {
                        const query = this.searchQuery.toLowerCase();
                        users = users.filter(user => 
                            (user.firstname?.toLowerCase().includes(query) || 
                             user.lastname?.toLowerCase().includes(query) ||
                             user.phone?.includes(query))
                        );
                    }

                    if (this.statusFilter !== 'status') {
                        users = users.filter(user => user.status === this.statusFilter);
                    }

                    this.users = users;
                    this.totalUsers = users.length;
                },
                error: (error) => {
                    console.error('Error loading users:', error);
                    this.alert = {
                        type: 'error',
                        message: 'Failed to load users. Please try again.',
                    };
                    this.showAlert = true;
                    this.isLoading = false;
                }
            });
    }

    onPageChange(page: number): void {
        this.pageIndex = page;
        this._loadUsers();
    }

    createUser(): void {
        this.userCreated.emit();
    }

    editUser(user: UserListItem): void {
        const dialogRef = this._dialog.open(UserEditDialogComponent, {
            width: '700px',
            maxWidth: '95vw',
            disableClose: true,
            data: { user: user }
        });

        dialogRef.afterClosed().subscribe((result) => {
            if (result) {
                console.log('[UsersTable] User updated successfully:', result);
                this.userEdited.emit(result);
                this._loadUsers();

                this.alert = {
                    type: 'success',
                    message: 'User updated successfully.',
                };
                this.showAlert = true;

                setTimeout(() => {
                    this.showAlert = false;
                }, 3000);
            }
        });
    }

    deleteUser(user: UserListItem): void {
        if (confirm(`Are you sure you want to delete ${user.firstname} ${user.lastname}?`)) {
            this.isLoading = true;

            this._usersService.deleteUser(+user.id)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    finalize(() => {
                        this.isLoading = false;
                    })
                )
                .subscribe({
                    next: (response) => {
                        this.alert = {
                            type: 'success',
                            message: response.message || 'User deleted successfully.',
                        };
                        this.showAlert = true;
                        this._loadUsers();
                        this.userDeleted.emit(user);

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

    resetPassword(user: UserListItem): void {
        if (confirm(`Are you sure you want to reset the password for ${user.firstname} ${user.lastname}?`)) {
            this.passwordReset.emit(user);
            this.alert = {
                type: 'success',
                message: `Password reset email sent to ${user.email}.`,
            };
            this.showAlert = true;

            setTimeout(() => {
                this.showAlert = false;
            }, 3000);
        }
    }

    toggleUserStatus(user: UserListItem): void {
        const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
        if (confirm(`Are you sure you want to ${newStatus === 'ACTIVE' ? 'activate' : 'deactivate'} ${user.firstname} ${user.lastname}?`)) {
            this.statusToggled.emit(user);
            this.alert = {
                type: 'success',
                message: `User ${newStatus === 'ACTIVE' ? 'activated' : 'deactivated'} successfully.`,
            };
            this.showAlert = true;

            setTimeout(() => {
                this.showAlert = false;
            }, 3000);
        }
    }

    getShowingText(): string {
        const start = (this.pageIndex - 1) * this.pageSize + 1;
        const end = Math.min(this.pageIndex * this.pageSize, this.totalUsers);
        return `Showing ${start}-${end} of ${this.totalUsers}`;
    }

    // Mock data for testing - set useMock: false in class to use real API instead
    private _loadMockUsers(): void {
        const mockUsers: UserListItem[] = [
            { id: '1', firstname: 'John', lastname: 'Smith', name: 'John Smith', email: 'john.smith@example.com', phone: '(302) 555-0107', role: 'Admin', status: 'ACTIVE', initials: 'JS', avatar: '' },
            { id: '2', firstname: 'Sarah', lastname: 'Johnson', name: 'Sarah Johnson', email: 'sarah.j@example.com', phone: '(405) 555-0128', role: 'User', status: 'ACTIVE', initials: 'SJ', avatar: '' },
            { id: '3', firstname: 'Michael', lastname: 'Brown', name: 'Michael Brown', email: 'm.brown@example.com', phone: '(208) 555-0112', role: 'User', status: 'ACTIVE', initials: 'MB', avatar: '' },
            { id: '4', firstname: 'Emily', lastname: 'Davis', name: 'Emily Davis', email: 'emily.davis@example.com', phone: '(239) 555-0108', role: 'Admin', status: 'ACTIVE', initials: 'ED', avatar: '' },
            { id: '5', firstname: 'David', lastname: 'Wilson', name: 'David Wilson', email: 'd.wilson@example.com', phone: '(603) 555-0123', role: 'User', status: 'ACTIVE', initials: 'DW', avatar: '' },
            { id: '6', firstname: 'Jessica', lastname: 'Martinez', name: 'Jessica Martinez', email: 'j.martinez@example.com', phone: '(209) 555-0104', role: 'User', status: 'ACTIVE', initials: 'JM', avatar: '' },
            { id: '7', firstname: 'Robert', lastname: 'Anderson', name: 'Robert Anderson', email: 'r.anderson@example.com', phone: '(629) 555-0129', role: 'User', status: 'ACTIVE', initials: 'RA', avatar: '' },
            { id: '8', firstname: 'Amanda', lastname: 'Taylor', name: 'Amanda Taylor', email: 'a.taylor@example.com', phone: '(303) 555-0105', role: 'Admin', status: 'ACTIVE', initials: 'AT', avatar: '' },
            { id: '9', firstname: 'Christopher', lastname: 'Thomas', name: 'Christopher Thomas', email: 'c.thomas@example.com', phone: '(252) 555-0126', role: 'User', status: 'ACTIVE', initials: 'CT', avatar: '' },
            { id: '10', firstname: 'Ashley', lastname: 'Garcia', name: 'Ashley Garcia', email: 'a.garcia@example.com', phone: '(201) 555-0124', role: 'User', status: 'INACTIVE', initials: 'AG', avatar: '' },
            { id: '11', firstname: 'Daniel', lastname: 'Miller', name: 'Daniel Miller', email: 'd.miller@example.com', phone: '(305) 555-0145', role: 'User', status: 'ACTIVE', initials: 'DM', avatar: '' },
            { id: '12', firstname: 'Stephanie', lastname: 'Moore', name: 'Stephanie Moore', email: 's.moore@example.com', phone: '(412) 555-0167', role: 'Admin', status: 'ACTIVE', initials: 'SM', avatar: '' },
            { id: '13', firstname: 'Kevin', lastname: 'Jackson', name: 'Kevin Jackson', email: 'k.jackson@example.com', phone: '(518) 555-0189', role: 'User', status: 'ACTIVE', initials: 'KJ', avatar: '' },
            { id: '14', firstname: 'Nicole', lastname: 'White', name: 'Nicole White', email: 'n.white@example.com', phone: '(619) 555-0210', role: 'User', status: 'INACTIVE', initials: 'NW', avatar: '' },
            { id: '15', firstname: 'Brian', lastname: 'Harris', name: 'Brian Harris', email: 'b.harris@example.com', phone: '(714) 555-0234', role: 'User', status: 'ACTIVE', initials: 'BH', avatar: '' },
            { id: '16', firstname: 'Rachel', lastname: 'Clark', name: 'Rachel Clark', email: 'r.clark@example.com', phone: '(805) 555-0256', role: 'Admin', status: 'ACTIVE', initials: 'RC', avatar: '' },
            { id: '17', firstname: 'Justin', lastname: 'Lewis', name: 'Justin Lewis', email: 'j.lewis@example.com', phone: '(858) 555-0278', role: 'User', status: 'ACTIVE', initials: 'JL', avatar: '' },
            { id: '18', firstname: 'Samantha', lastname: 'Robinson', name: 'Samantha Robinson', email: 's.robinson@example.com', phone: '(909) 555-0299', role: 'User', status: 'ACTIVE', initials: 'SR', avatar: '' },
            { id: '19', firstname: 'Tyler', lastname: 'Walker', name: 'Tyler Walker', email: 't.walker@example.com', phone: '(910) 555-0321', role: 'User', status: 'ACTIVE', initials: 'TW', avatar: '' },
            { id: '20', firstname: 'Megan', lastname: 'Young', name: 'Megan Young', email: 'm.young@example.com', phone: '(919) 555-0343', role: 'Admin', status: 'INACTIVE', initials: 'MY', avatar: '' },
        ];

        let users = mockUsers;

        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            users = users.filter(user => 
                (user.firstname?.toLowerCase().includes(query) || 
                 user.lastname?.toLowerCase().includes(query) ||
                 user.phone?.includes(query))
            );
        }

        if (this.statusFilter !== 'status') {
            users = users.filter(user => user.status === this.statusFilter);
        }

        this.users = users;
        this.totalUsers = users.length;
        this.isLoading = false;
    }
}