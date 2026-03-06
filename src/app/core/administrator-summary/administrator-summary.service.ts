import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, delay } from 'rxjs/operators';
import { 
    AdministratorSummaryResponse,
    AdministratorSummaryFilters
} from './administrator-summary.types';
import { MOCK_ADMINISTRATOR_SUMMARY_RESPONSE } from './administrator-summary.mock';

@Injectable({
    providedIn: 'root'
})
export class AdministratorSummaryService {
    
    constructor(private _httpClient: HttpClient) {}

    /**
     * Obtener el resumen de administradores
     */
    getAdministratorSummary(filters?: AdministratorSummaryFilters): Observable<AdministratorSummaryResponse> {
        return of(MOCK_ADMINISTRATOR_SUMMARY_RESPONSE).pipe(
            delay(500),
            map(response => {
                // Aquí se aplicarían los filtros en un caso real
                return response;
            })
        );
    }
}