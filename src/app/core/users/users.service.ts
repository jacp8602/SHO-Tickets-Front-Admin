import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

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
}

@Injectable({ providedIn: 'root' })
export class UsersService {
    private _httpClient = inject(HttpClient);
    private _apiUrl = environment.apiUrl;

    getAllUsers(): Observable<BackendUser[]> {
        return this._httpClient.get<BackendUser[]>(`${this._apiUrl}/users/get-users`);
    }

    getUsers(page: number = 0, pageSize: number = 10): Observable<UsersResponse> {
        return this._httpClient.get<UsersResponse>(`${this._apiUrl}/users/get-users`, {
            params: {
                page: page.toString(),
                pageSize: pageSize.toString()
            }
        });
    }

    getUserById(id: number): Observable<BackendUser> {
        return this._httpClient.get<BackendUser>(`${this._apiUrl}/users/get-user/${id}`);
    }

    findUserByEmail(email: string): Observable<BackendUser> {
        return this._httpClient.post<BackendUser>(`${this._apiUrl}/users/find-user-email`, { email });
    }

    createUser(formData: FormData): Observable<BackendUser> {
        return this._httpClient.post<BackendUser>(`${this._apiUrl}/users/create-user`, formData);
    }

    updateUser(id: number, formData: FormData): Observable<BackendUser> {
        return this._httpClient.patch<BackendUser>(`${this._apiUrl}/users/update-user/${id}`, formData);
    }

    deleteUser(id: number): Observable<{ message: string }> {
        return this._httpClient.delete<{ message: string }>(`${this._apiUrl}/users/delete-user/${id}`);
    }

    transformUser(backendUser: BackendUser): UserListItem {
        const initials = this._getInitials(backendUser.firstname, backendUser.lastname);
        return {
            id: backendUser.id.toString(),
            firstname: backendUser.firstname,
            lastname: backendUser.lastname,
            name: `${backendUser.firstname} ${backendUser.lastname}`.trim(),
            username: backendUser.email.split('@')[0],
            email: backendUser.email,
            phone: backendUser.phone || '',
            role: backendUser.role?.name || 'User',
            roleDescription: backendUser.role?.description,
            status: backendUser.status === 'ACTIVE' ? 'ACTIVE' : 'INACTIVE',
            avatar: backendUser.avatar,
            initials,
        };
    }

    private _getInitials(firstname: string, lastname: string): string {
        const firstInitial = firstname?.charAt(0) || '';
        const lastInitial = lastname?.charAt(0) || '';
        return `${firstInitial}${lastInitial}`.toUpperCase();
    }
}