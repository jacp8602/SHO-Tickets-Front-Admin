import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { 
    SalesReportResponse,
    GrandSummary,
    SalesReportItem,
    VenueSummary,
    SalesReportFilters 
} from './sales-report.types';
import { MOCK_GRAND_SUMMARY, MOCK_SALES_ITEMS, MOCK_VENUE_SUMMARIES } from './sales-report.mock';

@Injectable({
    providedIn: 'root'
})
export class SalesReportService {
    
    constructor(private _httpClient: HttpClient) {}

    /**
     * Obtener el reporte de ventas
     */
    getSalesReport(filters?: SalesReportFilters): Observable<SalesReportResponse> {
        return of({}).pipe(
            delay(500),
            map(() => {
                // Aquí se aplicarían los filtros en un caso real
                
                return {
                    success: true,
                    data: {
                        grandSummary: MOCK_GRAND_SUMMARY,
                        items: MOCK_SALES_ITEMS,
                        venueSummaries: MOCK_VENUE_SUMMARIES
                    }
                };
            })
        );
    }
}