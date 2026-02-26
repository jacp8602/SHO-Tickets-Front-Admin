import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Production, ProductionsResponse, ProductionFilters } from './productions.types';

@Injectable({
    providedIn: 'root'
})
export class ProductionsService {
    
    private mockProductions: Production[] = [
        {
            id: '1',
            name: 'Golden Brother Nuclear Circus',
            description: 'Main production',
            status: 'active',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-02-15')
        },
        {
            id: '2',
            name: 'Monster Truck',
            description: 'Monster truck show',
            status: 'active',
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-02-20')
        }
    ];

    constructor(private _httpClient: HttpClient) {}

    /**
     * Obtener producciones con filtros y paginación
     */
    getProductions(
        page: number = 0,
        pageSize: number = 10,
        filters?: ProductionFilters
    ): Observable<ProductionsResponse> {
        return of(this.mockProductions).pipe(
            delay(500),
            map(productions => {
                let filtered = [...productions];

                if (filters?.search) {
                    const searchTerm = filters.search.toLowerCase();
                    filtered = filtered.filter(p => 
                        p.name.toLowerCase().includes(searchTerm) ||
                        p.description.toLowerCase().includes(searchTerm)
                    );
                }

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
     * Obtener una producción por ID
     */
    getProductionById(id: string): Observable<Production | null> {
        const production = this.mockProductions.find(p => p.id === id);
        return of(production || null).pipe(delay(300));
    }
}