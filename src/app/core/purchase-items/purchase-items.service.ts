import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { 
    PurchaseItemsResponse,
    PurchaseItemsFilters
} from './purchase-items.types';
import { MOCK_PURCHASE_ITEMS_RESPONSE } from './purchase-items.mock';

@Injectable({
    providedIn: 'root'
})
export class PurchaseItemsService {
    
    constructor(private _httpClient: HttpClient) {}

    /**
     * Obtener los items de compra
     */
    getPurchaseItems(filters?: PurchaseItemsFilters): Observable<PurchaseItemsResponse> {
        return of(MOCK_PURCHASE_ITEMS_RESPONSE).pipe(
            delay(500),
            map(response => {
                // Aquí se aplicarían los filtros en un caso real
                // Si hay un eventId, filtraríamos por ese evento
                if (filters?.eventId) {
                    console.log('Filtering by eventId:', filters.eventId);
                }
                return response;
            })
        );
    }
}