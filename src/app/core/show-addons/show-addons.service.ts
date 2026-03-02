import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, delay, catchError } from 'rxjs/operators';
import {
    ShowAddonItem,
    ShowAddonsResponse,
    ShowAddonsConfiguration,
    ShowAddonFilters
} from './show-addons.types';
import { MOCK_ADDONS_CONFIG } from './show-addons.mock';

@Injectable({
    providedIn: 'root'
})
export class ShowAddonsService {

    private mockConfigs: Map<string, ShowAddonItem[]> = new Map(Object.entries(MOCK_ADDONS_CONFIG));

    constructor(private _httpClient: HttpClient) { }

    /**
     * Obtener addons para un show
     */
    getAddons(showId: string, filters?: ShowAddonFilters): Observable<ShowAddonsResponse> {
        return of(showId).pipe(
            delay(500),
            map(id => {
                const addons = this.mockConfigs.get(id) || [];

                // Aplicar filtros si existen
                let filteredAddons = [...addons];

                if (filters?.enabled !== undefined) {
                    filteredAddons = filteredAddons.filter(a => a.enabled === filters.enabled);
                }

                if (filters?.category && filters.category !== 'all') {
                    filteredAddons = filteredAddons.filter(a => a.category === filters.category);
                }

                if (filters?.search) {
                    const searchTerm = filters.search.toLowerCase();
                    filteredAddons = filteredAddons.filter(a =>
                        a.name.toLowerCase().includes(searchTerm)
                    );
                }

                return {
                    success: true,
                    data: {
                        showId: id,
                        addons: filteredAddons
                    }
                };
            }),
            catchError(error => {
                console.error('Error getting addons:', error);
                return throwError(() => new Error('Failed to load addons'));
            })
        );
    }

    /**
     * Guardar addons
     */
    saveAddons(showId: string, addons: ShowAddonItem[]): Observable<ShowAddonsResponse> {
        return of({ showId, addons }).pipe(
            delay(500),
            map(({ showId, addons }) => {
                this.mockConfigs.set(showId, [...addons]);

                return {
                    success: true,
                    data: {
                        showId,
                        addons
                    },
                    message: 'Addons saved successfully'
                };
            }),
            catchError(error => {
                console.error('Error saving addons:', error);
                return throwError(() => new Error('Failed to save addons'));
            })
        );
    }

    /**
     * Agregar un nuevo addon
     */
    addAddon(showId: string, addon: Omit<ShowAddonItem, 'id'>): Observable<ShowAddonsResponse> {
        const currentAddons = this.mockConfigs.get(showId) || [];

        const newAddon: ShowAddonItem = {
            ...addon,
            id: Date.now().toString()
        };

        const updatedAddons = [...currentAddons, newAddon];
        this.mockConfigs.set(showId, updatedAddons);

        return of({
            success: true,
            data: {
                showId,
                addons: updatedAddons
            },
            message: 'Addon added successfully'
        }).pipe(delay(300));
    }

    /**
     * Eliminar un addon
     */
    deleteAddon(showId: string, addonId: string): Observable<ShowAddonsResponse> {
        const currentAddons = this.mockConfigs.get(showId) || [];

        const updatedAddons = currentAddons.filter(a => a.id !== addonId);
        this.mockConfigs.set(showId, updatedAddons);

        return of({
            success: true,
            data: {
                showId,
                addons: updatedAddons
            },
            message: 'Addon deleted successfully'
        }).pipe(delay(300));
    }

    /**
     * Alternar estado enabled de un addon
     */
    toggleAddon(showId: string, addonId: string): Observable<ShowAddonsResponse> {
        const currentAddons = this.mockConfigs.get(showId) || [];

        const index = currentAddons.findIndex(a => a.id === addonId);
        if (index === -1) {
            return throwError(() => new Error('Addon not found'));
        }

        const updatedAddons = [...currentAddons];
        updatedAddons[index] = {
            ...updatedAddons[index],
            enabled: !updatedAddons[index].enabled
        };

        this.mockConfigs.set(showId, updatedAddons);

        return of({
            success: true,
            data: {
                showId,
                addons: updatedAddons
            },
            message: 'Addon toggled successfully'
        }).pipe(delay(300));
    }
}