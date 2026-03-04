import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, delay, catchError } from 'rxjs/operators';
import { 
    MenuItem, 
    MenuItemId, 
    MenuConfig, 
    MenuResponse,
    MenuState 
} from './menu.types';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    
    // Estado del menú
    private _state = new BehaviorSubject<MenuState>({
        items: [],
        activeItemId: null,
        productionId: null,
        isLoading: false,
        error: null
    });
    
    state$ = this._state.asObservable();

    constructor() {}

    /**
     * Obtener los items del menú para productions
     */
    // getMenuItems(config: MenuConfig): Observable<MenuResponse> {
    //     this._updateState({ isLoading: true, error: null });
        
    //     return of(config).pipe(
    //         delay(300),
    //         map(config => {
    //             const { productionId, activeItemId } = config;
    //             const id = productionId || '1';
                
    //             const items: MenuItem[] = [
    //                 { 
    //                     id: MenuItemId.BASIC, 
    //                     label: 'Basic Information', 
    //                     route: ['/productions', id],
    //                     active: activeItemId === MenuItemId.BASIC
    //                 },
    //                 { 
    //                     id: MenuItemId.TICKETS, 
    //                     label: 'Tickets', 
    //                     route: ['/productions', 'tickets', id],
    //                     active: activeItemId === MenuItemId.TICKETS
    //                 },
    //                 { 
    //                     id: MenuItemId.ADDONS, 
    //                     label: 'Add-Ons', 
    //                     route: ['/productions', 'addons', id],
    //                     active: activeItemId === MenuItemId.ADDONS
    //                 }
    //             ];
                
    //             this._updateState({ 
    //                 items, 
    //                 activeItemId, 
    //                 productionId, 
    //                 isLoading: false 
    //             });
                
    //             return {
    //                 success: true,
    //                 data: items
    //             };
    //         }),
    //         catchError(error => {
    //             this._updateState({ 
    //                 isLoading: false, 
    //                 error: error.message 
    //             });
                
    //             return [{
    //                 success: false,
    //                 message: error.message
    //             }];
    //         })
    //     );
    // }

    /**
     * Obtener los items del menú (versión simplificada sin estado)
     */
    getProductionMenuItems(config: { productionId: string | null; activeItemId: string }): MenuItem[] {
        const { productionId, activeItemId } = config;
        const id = productionId || '1';
        
        return [
            { 
                id: MenuItemId.BASIC, 
                label: 'Basic Information', 
                route: ['/productions', id],
                active: activeItemId === MenuItemId.BASIC
            },
            { 
                id: MenuItemId.LAYOUTS, 
                label: 'Layout Management', 
                route: ['/productions', 'layouts', id],
                active: activeItemId === MenuItemId.LAYOUTS
            },
            { 
                id: MenuItemId.TICKETS, 
                label: 'Tickets', 
                route: ['/productions', 'tickets', id],
                active: activeItemId === MenuItemId.TICKETS
            },
            { 
                id: MenuItemId.ADDONS, 
                label: 'Add-Ons', 
                route: ['/productions', 'addons', id],
                active: activeItemId === MenuItemId.ADDONS
            }
        ];
    }

    /**
     * Actualizar el item activo
     */
    // setActiveItem(itemId: MenuItemId): void {
    //     const currentState = this._state.value;
    //     const updatedItems = currentState.items.map(item => ({
    //         ...item,
    //         active: item.id === itemId
    //     }));
        
    //     this._updateState({ 
    //         items: updatedItems, 
    //         activeItemId: itemId 
    //     });
    // }

    
    /**
     * Obtener el item activo actual
     */
    getActiveItem(): MenuItem | undefined {
        return this._state.value.items.find(item => item.active);
    }

    /**
     * Obtener el ID del item basado en la URL
     */
    getActiveItemIdFromUrl(url: string): MenuItemId {
        if (url.includes('/productions/') && !url.includes('/layouts') && !url.includes('/tickets') && !url.includes('/addons')) {
            return MenuItemId.BASIC;
        } else if (url.includes('/productions/layouts')) {
            return MenuItemId.LAYOUTS;
        } else if (url.includes('/productions/tickets')) {
            return MenuItemId.TICKETS;
        } else if (url.includes('/productions/addons')) {
            return MenuItemId.ADDONS;
        }
        return MenuItemId.BASIC;
    }
}