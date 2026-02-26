import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../user/user.types';
import { UserListItem } from './users.types';

export interface UsersResponse {
    users: UserListItem[];
    total: number;
    page: number;
    pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
    private _httpClient = inject(HttpClient);

    /**
     * Get users with pagination
     */
    getUsers(page: number = 0, pageSize: number = 10, filters): Observable<UsersResponse> {
        return this._httpClient.get<UsersResponse>('api/users', {
            params: {
                page: page.toString(),
                pageSize: pageSize.toString()
            }
        });
    }

    /**
     * Get user by id
     */
    getUserById(id: string): Observable<User> {
        return this._httpClient.get<User>(`api/users/${id}`);
    }

    /**
     * Create a new user
     */
    createUser(user: Partial<User>): Observable<User> {
        return this._httpClient.post<User>('api/users', { user });
    }

    /**
     * Update a user
     */
    updateUser(id: string, user: Partial<User>): Observable<User> {
        return this._httpClient.patch<User>(`api/users/${id}`, { user });
    }

    /**
     * Delete a user
     */
    deleteUser(id: string): Observable<boolean> {
        return this._httpClient.delete<boolean>(`api/users/${id}`);
    }
}