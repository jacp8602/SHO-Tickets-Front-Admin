import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { User } from '../user/user.types';

export interface BackendUser {
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

export interface UsersResponse {
    users: UserListItem[];
    total: number;
}

export interface UserListItem extends User {
    username?: string;
    phone?: string;
    role?: string;
    lastActive?: Date;
    initials: string;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
    private _httpClient = inject(HttpClient);
    private _apiUrl = environment.apiUrl;

    /**
     * Get all users from backend
     */
    getAllUsers(): Observable<BackendUser[]> {
        return this._httpClient.get<BackendUser[]>(`${this._apiUrl}/users/get-users`);
    }

    /**
     * Get users with pagination (optional - backend may not support pagination yet)
     */
    getUsers(page: number = 0, pageSize: number = 10): Observable<UsersResponse> {
        return this._httpClient.get<UsersResponse>(`${this._apiUrl}/users/get-users`, {
            params: {
                page: page.toString(),
                pageSize: pageSize.toString()
            }
        });
    }

    /**
     * Get user by id
     */
    getUserById(id: number): Observable<BackendUser> {
        return this._httpClient.get<BackendUser>(`${this._apiUrl}/users/get-user/${id}`);
    }

    /**
     * Find user by email
     */
    findUserByEmail(email: string): Observable<BackendUser> {
        return this._httpClient.post<BackendUser>(`${this._apiUrl}/users/find-user-email`, { email });
    }

    /**
     * Create a new user
     */
    createUser(formData: FormData): Observable<BackendUser> {
        return this._httpClient.post<BackendUser>(`${this._apiUrl}/users/create-user`, formData);
    }

    /**
     * Update a user
     */
    updateUser(id: number, formData: FormData): Observable<BackendUser> {
        return this._httpClient.patch<BackendUser>(`${this._apiUrl}/users/update-user/${id}`, formData);
    }

    /**
     * Delete a user (logical delete)
     */
    deleteUser(id: number): Observable<{ message: string }> {
        return this._httpClient.delete<{ message: string }>(`${this._apiUrl}/users/delete-user/${id}`);
    }

    /**
     * Transform backend user to frontend UserListItem
     */
    transformUser(backendUser: BackendUser): UserListItem {
        const initials = this._getInitials(backendUser.firstname, backendUser.lastname);
        return {
            id: backendUser.id.toString(),
            name: `${backendUser.firstname} ${backendUser.lastname}`.trim(),
            username: backendUser.email.split('@')[0],
            email: backendUser.email,
            phone: backendUser.phone || '',
            role: backendUser.role?.name || '',
            status: backendUser.status === 'ACTIVE' ? 'active' : 'inactive',
            avatar: backendUser.avatar,
            initials,
        };
    }

    /**
     * Get initials from name
     */
    private _getInitials(firstname: string, lastname: string): string {
        const firstInitial = firstname?.charAt(0) || '';
        const lastInitial = lastname?.charAt(0) || '';
        return `${firstInitial}${lastInitial}`.toUpperCase();
    }
}