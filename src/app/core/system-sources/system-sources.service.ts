import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, map, catchError, throwError } from 'rxjs';

export interface SystemSource {
    id: number;
    name: string;
    description?: string;
    is_active?: boolean;
    created_at?: string;
    updated_at?: string;
}

/**
 * Service to manage System Sources
 */
@Injectable({
    providedIn: 'root'
})
export class SystemSourcesService {
    private _httpClient = inject(HttpClient);
    private _apiUrl = environment.apiUrl;

    /**
     * Get all system sources
     */
    getSystemSources(): Observable<SystemSource[]> {
        return this._httpClient
            .get<SystemSource[]>(`${this._apiUrl}/system-source/list`)
            .pipe(
                map(response => {
                    console.log('[SystemSourcesService] System sources loaded:', response);
                    return response;
                }),
                catchError(error => {
                    console.error('[SystemSourcesService] Error fetching system sources:', error);
                    return throwError(() => error);
                })
            );
    }
}
