import { Injectable } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { map, delay, catchError } from 'rxjs/operators';
import { 
    ShowMenuItem, 
    ShowMenuItemId, 
    ShowMenuConfig, 
    ShowMenuResponse,
    ShowMenuState 
} from './show-menu.types';

@Injectable({
    providedIn: 'root'
})
export class ShowMenuService {
    
    // Estado del menú
    private _state = new BehaviorSubject<ShowMenuState>({
        items: [],
        activeItemId: null,
        showId: null,
        isLoading: false,
        error: null
    });
    
    state$ = this._state.asObservable();

    constructor() {}

    /**
     * Obtener los items del menú para shows
     */
    // getMenuItems(config: ShowMenuConfig): Observable<ShowMenuResponse> {
    //     this._updateState({ isLoading: true, error: null });
        
    //     return of(config).pipe(
    //         delay(300),
    //         map(config => {
    //             const { showId, activeItemId } = config;
    //             const id = showId || '1';
                
    //             const items: ShowMenuItem[] = [
    //                 { 
    //                     id: ShowMenuItemId.BASIC, 
    //                     label: 'Basic Information', 
    //                     route: ['/shows', id],
    //                     active: activeItemId === ShowMenuItemId.BASIC
    //                 },
    //                 { 
    //                     id: ShowMenuItemId.TICKETS, 
    //                     label: 'Tickets', 
    //                     route: ['/shows', 'tickets', id],
    //                     active: activeItemId === ShowMenuItemId.TICKETS
    //                 },
    //                 { 
    //                     id: ShowMenuItemId.ADDONS, 
    //                     label: 'Add-Ons', 
    //                     route: ['/shows', 'addons', id],
    //                     active: activeItemId === ShowMenuItemId.ADDONS
    //                 }
    //             ];
                
    //             this._updateState({ 
    //                 items, 
    //                 activeItemId, 
    //                 showId, 
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
    getShowMenuItems(config: { showId: string | null; activeItemId: string }): ShowMenuItem[] {
        const { showId, activeItemId } = config;
        const id = showId || '1';
        
        return [
            { 
                id: ShowMenuItemId.BASIC, 
                label: 'Basic Information', 
                route: ['/shows', id],
                active: activeItemId === ShowMenuItemId.BASIC
            },
            { 
                id: ShowMenuItemId.TICKETS, 
                label: 'Tickets', 
                route: ['/shows', 'tickets', id],
                active: activeItemId === ShowMenuItemId.TICKETS
            },
            { 
                id: ShowMenuItemId.ADDONS, 
                label: 'Add-Ons', 
                route: ['/shows', 'addons', id],
                active: activeItemId === ShowMenuItemId.ADDONS
            }
        ];
    }

    /**
     * Actualizar el item activo
     */
    // setActiveItem(itemId: ShowMenuItemId): void {
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
     * Recargar menú con nuevo ID de show
     */
    // reloadMenu(showId: string, activeItemId: ShowMenuItemId = ShowMenuItemId.BASIC): void {
    //     this.getMenuItems({ showId, activeItemId }).subscribe();
    // }

    /**
     * Actualizar el estado interno
     */
    // private _updateState(partialState: Partial<ShowMenuState>): void {
    //     this._state.next({
    //         ...this._state.value,
    //         ...partialState
    //     });
    // }

    /**
     * Resetear el estado del menú
     */
    // resetState(): void {
    //     this._state.next({
    //         items: [],
    //         activeItemId: null,
    //         showId: null,
    //         isLoading: false,
    //         error: null
    //     });
    // }

    /**
     * Obtener el item activo actual
     */
    getActiveItem(): ShowMenuItem | undefined {
        return this._state.value.items.find(item => item.active);
    }

    /**
     * Obtener el ID del item basado en la URL
     */
    getActiveItemIdFromUrl(url: string): ShowMenuItemId {
        if (url.includes('/shows/') && !url.includes('/shows/tickets/') && !url.includes('/shows/addons/')) {
            return ShowMenuItemId.BASIC;
        } else if (url.includes('/shows/tickets')) {
            return ShowMenuItemId.TICKETS;
        } else if (url.includes('/shows/addons')) {
            return ShowMenuItemId.ADDONS;
        }
        return ShowMenuItemId.BASIC;
    }
}