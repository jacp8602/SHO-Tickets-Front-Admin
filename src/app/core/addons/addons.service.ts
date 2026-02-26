import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, delay, catchError } from 'rxjs/operators';
import { 
    AddonItem, 
    AddonsResponse, 
    AddonsConfiguration,
    AddonFilters 
} from './addons.types';
import { MOCK_ADDONS_CONFIG } from './addons.mock';

@Injectable({
    providedIn: 'root'
})
export class AddonsService {
    
    private mockConfigs: Map<string, AddonItem[]> = new Map(Object.entries(MOCK_ADDONS_CONFIG));

    constructor(private _httpClient: HttpClient) {}

    /**
     * Obtener addons para una producción
     */
    getAddons(productionId: string, filters?: AddonFilters): Observable<AddonsResponse> {
        return of(productionId).pipe(
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
                        productionId: id,
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
    saveAddons(productionId: string, addons: AddonItem[]): Observable<AddonsResponse> {
        return of({ productionId, addons }).pipe(
            delay(500),
            map(({ productionId, addons }) => {
                this.mockConfigs.set(productionId, [...addons]);
                
                return {
                    success: true,
                    data: {
                        productionId,
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
    addAddon(productionId: string, addon: Omit<AddonItem, 'id'>): Observable<AddonsResponse> {
        const currentAddons = this.mockConfigs.get(productionId) || [];
        
        const newAddon: AddonItem = {
            ...addon,
            id: Date.now().toString()
        };
        
        const updatedAddons = [...currentAddons, newAddon];
        this.mockConfigs.set(productionId, updatedAddons);
        
        return of({
            success: true,
            data: {
                productionId,
                addons: updatedAddons
            },
            message: 'Addon added successfully'
        }).pipe(delay(300));
    }

    /**
     * Eliminar un addon
     */
    deleteAddon(productionId: string, addonId: string): Observable<AddonsResponse> {
        const currentAddons = this.mockConfigs.get(productionId) || [];
        
        const updatedAddons = currentAddons.filter(a => a.id !== addonId);
        this.mockConfigs.set(productionId, updatedAddons);
        
        return of({
            success: true,
            data: {
                productionId,
                addons: updatedAddons
            },
            message: 'Addon deleted successfully'
        }).pipe(delay(300));
    }

    /**
     * Alternar estado enabled de un addon
     */
    toggleAddon(productionId: string, addonId: string): Observable<AddonsResponse> {
        const currentAddons = this.mockConfigs.get(productionId) || [];
        
        const index = currentAddons.findIndex(a => a.id === addonId);
        if (index === -1) {
            return throwError(() => new Error('Addon not found'));
        }
        
        const updatedAddons = [...currentAddons];
        updatedAddons[index] = { 
            ...updatedAddons[index], 
            enabled: !updatedAddons[index].enabled 
        };
        
        this.mockConfigs.set(productionId, updatedAddons);
        
        return of({
            success: true,
            data: {
                productionId,
                addons: updatedAddons
            },
            message: 'Addon toggled successfully'
        }).pipe(delay(300));
    }
}