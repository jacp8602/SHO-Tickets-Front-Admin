import { Injectable } from '@angular/core';
import { MenuItem, ProductionMenuConfig } from './menu.types';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    
    /**
     * Obtener los items del menú de producción
     */
    getProductionMenuItems(config: ProductionMenuConfig): MenuItem[] {
        const { productionId, activeItemId } = config;
        
        return [
            { 
                id: 'basic', 
                label: 'Basic Information', 
                route: ['/productions', productionId || '1'],
                active: activeItemId === 'basic'
            },
            { 
                id: 'layout', 
                label: 'Layout Management', 
                route: ['/layouts'],
                active: activeItemId === 'layout'
            },
            { 
                id: 'tickets', 
                label: 'Tickets', 
                route: ['/tickets'],
                active: activeItemId === 'tickets'
            },
            { 
                id: 'addons', 
                label: 'Add-Ons', 
                route: ['/addons'],
                active: activeItemId === 'addons'
            }
        ];
    }

    /**
     * Obtener el ID del item activo basado en la URL
     */
    getActiveItemIdFromUrl(url: string): string {
        if (url.includes('/productions/')) {
            return 'basic';
        } else if (url.includes('/layouts')) {
            return 'layout';
        } else if (url.includes('/tickets')) {
            return 'tickets';
        } else if (url.includes('/addons')) {
            return 'addons';
        }
        return 'basic';
    }
}