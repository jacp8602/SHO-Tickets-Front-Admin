import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, delay, catchError } from 'rxjs/operators';
import { 
    Show, 
    ShowsResponse, 
    ShowFilters 
} from './shows.types';
import { MOCK_SHOWS_CONFIG } from './shows.mock';

@Injectable({
    providedIn: 'root'
})
export class ShowsService {
    
    private mockConfigs: Map<string, Show[]> = new Map(Object.entries(MOCK_SHOWS_CONFIG));

    constructor(private _httpClient: HttpClient) {}

    /**
     * Obtener shows para una producción
     */
    getShows(showId: string, filters?: ShowFilters): Observable<ShowsResponse> {
        return of(showId).pipe(
            delay(500),
            map(id => {
                const shows = this.mockConfigs.get(id) || [];
                
                // Aplicar filtros
                let filteredShows = [...shows];
                
                if (filters?.search) {
                    const searchTerm = filters.search.toLowerCase();
                    filteredShows = filteredShows.filter(s => 
                        s.name.toLowerCase().includes(searchTerm) ||
                        s.description.toLowerCase().includes(searchTerm)
                    );
                }
                
                if (filters?.status && filters.status !== 'all') {
                    filteredShows = filteredShows.filter(s => s.status === filters.status);
                }
                
                return {
                    shows: filteredShows,
                    total: filteredShows.length,
                    page: 0,
                    pageSize: filteredShows.length
                };
            }),
            catchError(error => {
                console.error('Error getting shows:', error);
                return throwError(() => new Error('Failed to load shows'));
            })
        );
    }

    /**
     * Obtener un show por ID
     */
    getShowById(showId: string): Observable<Show | null> {
        const shows = this.mockConfigs.get(showId) || [];
        const show = shows.find(s => s.id === showId);
        return of(show || null).pipe(delay(300));
    }

    /**
     * Crear un nuevo show
     */
    createShow(showId: string, show: Omit<Show, 'id' | 'createdAt' | 'updatedAt'>): Observable<ShowsResponse> {
        const currentShows = this.mockConfigs.get(showId) || [];
        
        const newShow: Show = {
            ...show,
            id: Date.now().toString(),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const updatedShows = [...currentShows, newShow];
        this.mockConfigs.set(showId, updatedShows);
        
        return of({
            shows: updatedShows,
            total: updatedShows.length,
            page: 0,
            pageSize: updatedShows.length
        }).pipe(delay(300));
    }

    /**
     * Actualizar un show
     */
    updateShow(showId: string, updates: Partial<Show>): Observable<ShowsResponse> {
        const currentShows = this.mockConfigs.get(showId) || [];
        
        const index = currentShows.findIndex(s => s.id === showId);
        if (index === -1) {
            return throwError(() => new Error('Show not found'));
        }
        
        const updatedShows = [...currentShows];
        updatedShows[index] = { 
            ...updatedShows[index], 
            ...updates,
            updatedAt: new Date()
        };
        
        this.mockConfigs.set(showId, updatedShows);
        
        return of({
            shows: updatedShows,
            total: updatedShows.length,
            page: 0,
            pageSize: updatedShows.length
        }).pipe(delay(300));
    }

    /**
     * Eliminar un show
     */
    deleteShow(showId: string): Observable<ShowsResponse> {
        const currentShows = this.mockConfigs.get(showId) || [];
        
        const updatedShows = currentShows.filter(s => s.id !== showId);
        this.mockConfigs.set(showId, updatedShows);
        
        return of({
            shows: updatedShows,
            total: updatedShows.length,
            page: 0,
            pageSize: updatedShows.length
        }).pipe(delay(300));
    }
}