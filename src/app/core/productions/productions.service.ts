import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, map, catchError, throwError } from 'rxjs';
import {
    Production,
    BackendProduction,
    ProductionsResponse,
    ProductionFilters,
    CreateProductionDto,
    UpdateProductionDto,
} from './productions.types';

@Injectable({
    providedIn: 'root'
})
export class ProductionsService {
    private _httpClient = inject(HttpClient);
    private _apiUrl = environment.apiUrl;

    /**
     * Get all active productions from backend
     */
    getAllProductions(): Observable<Production[]> {
        return this._httpClient
            .get<{ statusCode: number; message: string; data: BackendProduction[] }>(
                `${this._apiUrl}/productions/list`
            )
            .pipe(
                map(response => response.data.map(backend => this._transformBackendProduction(backend))),
                catchError(error => {
                    console.error('[ProductionsService] Error fetching productions:', error);
                    return throwError(() => error);
                })
            );
    }

    /**
     * Get productions with pagination (backend doesn't support pagination yet)
     */
    getProductions(
        page: number = 0,
        pageSize: number = 10,
        filters?: ProductionFilters
    ): Observable<ProductionsResponse> {
        return this.getAllProductions().pipe(
            map(productions => {
                let filtered = [...productions];

                // Apply search filter
                if (filters?.search) {
                    const searchTerm = filters.search.toLowerCase();
                    filtered = filtered.filter(p =>
                        p.name.toLowerCase().includes(searchTerm) ||
                        p.description?.toLowerCase().includes(searchTerm)
                    );
                }

                // Apply status filter
                if (filters?.status) {
                    filtered = filtered.filter(p => p.status === filters.status);
                }

                // Client-side pagination
                const start = page * pageSize;
                const end = start + pageSize;
                const paginated = filtered.slice(start, end);

                return {
                    productions: paginated,
                    total: filtered.length,
                    page,
                    pageSize
                };
            })
        );
    }

    /**
     * Get a production by ID
     */
    getProductionById(id: number): Observable<Production | null> {
        return this._httpClient
            .get<{ statusCode: number; message: string; data: BackendProduction }>(
                `${this._apiUrl}/productions/details/${id}`
            )
            .pipe(
                map(response => this._transformBackendProduction(response.data)),
                catchError(error => {
                    console.error(`[ProductionsService] Error fetching production ${id}:`, error);
                    return throwError(() => error);
                })
            );
    }

    /**
     * Create a new production
     */
    createProduction(dto: CreateProductionDto): Observable<Production> {
        // Build URL-encoded body as required by backend (application/x-www-form-urlencoded)
        const body = new URLSearchParams();
        body.append('name', dto.name);
        body.append('workspace', dto.workspace);
        body.append('systemSourceId', dto.systemSourcesId.toString());
        body.append('canceled', (dto.canceled ?? false).toString());
        
        if (dto.description) {
            body.append('description', dto.description);
        }
        if (dto.oid !== undefined) {
            body.append('oid', dto.oid.toString());
        }

        return this._httpClient
            .post<{ statusCode: number; message: string; data: BackendProduction }>(
                `${this._apiUrl}/productions/create`,
                body.toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            )
            .pipe(
                map(response => this._transformBackendProduction(response.data)),
                catchError(error => {
                    console.error('[ProductionsService] Error creating production:', error);
                    return throwError(() => error);
                })
            );
    }

    /**
     * Update a production
     */
    updateProduction(id: number, dto: UpdateProductionDto): Observable<Production> {
        const body = new URLSearchParams();
        
        if (dto.name !== undefined) {
            body.append('name', dto.name);
        }
        if (dto.workspace !== undefined) {
            body.append('workspace', dto.workspace);
        }
        if (dto.description !== undefined) {
            body.append('description', dto.description);
        }
        if (dto.canceled !== undefined) {
            body.append('canceled', dto.canceled.toString());
        }
        if (dto.systemSourcesId !== undefined) {
            body.append('systemSourcesId', dto.systemSourcesId.toString());
        }
        if (dto.oid !== undefined) {
            body.append('oid', dto.oid.toString());
        }

        return this._httpClient
            .patch<{ statusCode: number; message: string; data: BackendProduction }>(
                `${this._apiUrl}/productions/update/${id}`,
                body.toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            )
            .pipe(
                map(response => this._transformBackendProduction(response.data)),
                catchError(error => {
                    console.error(`[ProductionsService] Error updating production ${id}:`, error);
                    return throwError(() => error);
                })
            );
    }

    /**
     * Delete (cancel) a production
     */
    cancelProduction(id: number): Observable<{ message: string }> {
        return this._httpClient
            .delete<{ statusCode: number; message: string }>(
                `${this._apiUrl}/productions/delete/${id}`
            )
            .pipe(
                map(response => ({ message: response.message })),
                catchError(error => {
                    console.error(`[ProductionsService] Error canceling production ${id}:`, error);
                    return throwError(() => error);
                })
            );
    }

    /**
     * Transform backend production to frontend format
     */
    private _transformBackendProduction(backend: BackendProduction): Production {
        return {
            id: backend.id.toString(),
            name: backend.name,
            description: backend.description || '',
            workspace: backend.workspace || '',
            systemSourcesId: backend.systemSourcesId,
            oid: backend.oid,
            status: backend.canceled ? 'inactive' : 'active',
            createdAt: backend.created_at ? new Date(backend.created_at) : undefined,
            updatedAt: backend.updated_at ? new Date(backend.updated_at) : undefined,
        };
    }
}