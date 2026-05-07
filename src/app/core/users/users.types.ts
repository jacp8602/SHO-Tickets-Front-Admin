// src/app/core/users/users.types.ts

/**
 * User item for list display
 */
export interface UserListItem {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    status?: string;
    username?: string;
    phone?: string;
    role?: string;
    roleDescription?: string;
    lastActive?: Date;
    initials: string;
    firstname: string;
    lastname: string;
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
