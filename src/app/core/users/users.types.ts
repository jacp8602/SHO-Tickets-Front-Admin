// src/app/core/users/users.types.ts
import { User } from '../user/user.types';

/**
 * User item for list display
 * Extends base User interface with additional properties
 */
export interface UserListItem extends User {
    username?: string;
    phone?: string;
    role?: string;
    roleDescription?: string;
    lastActive?: Date;
    initials: string; // Calculated from name
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Backend user response structure
 */
export interface BackendUserResponse {
    id: number;
    firebaseUid?: string;
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    dateofbirth?: string;
    status: 'ACTIVE' | 'INACTIVE';
    avatar?: string;
    rolesId?: number;
    role?: {
        id: number;
        name: string;
        description?: string;
    };
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Paginated users response
 */
export interface PaginatedUsersResponse {
    data: UserListItem[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
