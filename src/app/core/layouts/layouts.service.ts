import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { Layout, LayoutsResponse, LayoutFilters } from './layouts.types';

@Injectable({
    providedIn: 'root'
})
export class LayoutsService {
    
    private mockLayouts: Layout[] = [
        {
            id: '1',
            name: 'Golden Brother Circus - Funcion Principal..',
            description: 'Funcion principal del Golden Brother Circus con esp...',
            seats: 25600,
            status: 'Published',
            productionId: '1',
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-02-20')
        },
        {
            id: '2',
            name: 'Golden Brother Circus - Funcion Principal.',
            description: 'Funcion principal del Golden Brother Circus con esp...',
            seats: 25600,
            status: 'Published',
            productionId: '1',
            createdAt: new Date('2024-01-15'),
            updatedAt: new Date('2024-02-20')
        },
        {
            id: '3',
            name: 'Funcion Matinee Familiar...',
            description: 'Funcion especial para familias con ninos - horario m...',
            seats: 25600,
            status: 'Published',
            productionId: '1',
            createdAt: new Date('2024-01-20'),
            updatedAt: new Date('2024-02-18')
        },
        {
            id: '4',
            name: 'Garden Bros Circus Default Layout',
            description: 'Default Layout for Garden Bros Circus Production',
            seats: 2500,
            status: 'Draft',
            productionId: '2',
            createdAt: new Date('2024-02-01'),
            updatedAt: new Date('2024-02-15')
        }
    ];

    constructor(private _httpClient: HttpClient) {}

    /**
     * Obtener layouts con filtros y paginación
     */
    getLayouts(
        page: number = 0,
        pageSize: number = 10,
        filters?: LayoutFilters
    ): Observable<LayoutsResponse> {
        return of(this.mockLayouts).pipe(
            delay(500),
            map(layouts => {
                let filtered = [...layouts];

                if (filters?.status && filters.status !== 'all') {
                    filtered = filtered.filter(l => 
                        l.status.toLowerCase() === filters.status?.toLowerCase()
                    );
                }

                if (filters?.search) {
                    const searchTerm = filters.search.toLowerCase();
                    filtered = filtered.filter(l => 
                        l.name.toLowerCase().includes(searchTerm) ||
                        l.description.toLowerCase().includes(searchTerm)
                    );
                }

                if (filters?.productionId) {
                    filtered = filtered.filter(l => l.productionId === filters.productionId);
                }

                const start = page * pageSize;
                const end = start + pageSize;
                const paginated = filtered.slice(start, end);

                return {
                    layouts: paginated,
                    total: filtered.length,
                    page,
                    pageSize
                };
            })
        );
    }

    /**
     * Eliminar un layout
     */
    deleteLayout(id: string): Observable<boolean> {
        const index = this.mockLayouts.findIndex(l => l.id === id);
        if (index !== -1) {
            this.mockLayouts.splice(index, 1);
            return of(true).pipe(delay(500));
        }
        return of(false).pipe(delay(300));
    }

    /**
     * Duplicar un layout
     */
    duplicateLayout(id: string): Observable<Layout | null> {
        const original = this.mockLayouts.find(l => l.id === id);
        if (!original) {
            return of(null).pipe(delay(300));
        }

        const duplicated: Layout = {
            ...original,
            id: Date.now().toString(),
            name: `${original.name} (Copy)`,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        this.mockLayouts.push(duplicated);
        return of(duplicated).pipe(delay(500));
    }
}