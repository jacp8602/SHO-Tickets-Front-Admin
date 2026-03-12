import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { 
    OverviewTotalSalesResponse,
    OverviewTotalSalesFilters
} from './overview-total-sales.types';
import { MOCK_OVERVIEW_TOTAL_SALES_RESPONSE } from './overview-total-sales.mock';

@Injectable({
    providedIn: 'root'
})
export class OverviewTotalSalesService {
    
    constructor(private _httpClient: HttpClient) {}

    /**
     * Obtener el resumen total de ventas
     */
    getOverviewTotalSales(filters?: OverviewTotalSalesFilters): Observable<OverviewTotalSalesResponse> {
        return of(MOCK_OVERVIEW_TOTAL_SALES_RESPONSE).pipe(
            delay(500),
            map(response => {
                // Aquí se aplicarían los filtros en un caso real
                return response;
            })
        );
    }
}