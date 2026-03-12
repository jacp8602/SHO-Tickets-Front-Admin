import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { 
    CurrentFutureSalesResponse,
    CurrentFutureSalesFilters
} from './current-future-sales.types';
import { MOCK_CURRENT_FUTURE_SALES_RESPONSE } from './current-future-sales.mock';

@Injectable({
    providedIn: 'root'
})
export class CurrentFutureSalesService {
    
    constructor(private _httpClient: HttpClient) {}

    /**
     * Obtener el reporte de ventas actuales y futuras
     */
    getSalesReport(filters?: CurrentFutureSalesFilters): Observable<CurrentFutureSalesResponse> {
        return of(MOCK_CURRENT_FUTURE_SALES_RESPONSE).pipe(
            delay(500),
            map(response => {
                // Aquí se aplicarían los filtros en un caso real
                return response;
            })
        );
    }
}