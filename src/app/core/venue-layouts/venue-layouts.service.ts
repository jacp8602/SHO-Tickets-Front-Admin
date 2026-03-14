import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { VenueLayout, VenueLayoutsResponse, VenueLayoutFilters } from './venue-layouts.types';
import { MOCK_VENUE_LAYOUTS_RESPONSE, MOCK_PRODUCTION_OPTIONS } from './venue-layouts.mock';

@Injectable({
    providedIn: 'root'
})
export class VenueLayoutsService {

    constructor(private _httpClient: HttpClient) {}

    getLayouts(filters?: VenueLayoutFilters): Observable<VenueLayoutsResponse> {
        let layouts = [...MOCK_VENUE_LAYOUTS_RESPONSE.layouts];
        
        if (filters?.status && filters.status !== 'all') {
            layouts = layouts.filter(l => l.status === filters.status);
        }
        
        if (filters?.production && filters.production !== 'all') {
            layouts = layouts.filter(l => l.production === filters.production);
        }
        
        if (filters?.search) {
            const searchLower = filters.search.toLowerCase();
            layouts = layouts.filter(l => 
                l.name.toLowerCase().includes(searchLower) || 
                l.description.toLowerCase().includes(searchLower)
            );
        }
        
        return of({
            layouts,
            total: layouts.length
        }).pipe(delay(500));
    }

    getProductionOptions(): Observable<{ value: string; label: string }[]> {
        return of(MOCK_PRODUCTION_OPTIONS).pipe(delay(200));
    }

    deleteLayout(id: string): Observable<boolean> {
        return of(true).pipe(delay(300));
    }
}