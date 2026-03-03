import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, delay, catchError } from 'rxjs/operators';
import { 
    ShowDetail, 
    ShowDetailResponse
} from './show-detail.types';
import { MOCK_SHOW_DETAILS } from './show-detail.mock';

@Injectable({
    providedIn: 'root'  // ← Esto es crucial
})
export class ShowDetailService {
    
    private mockDetails: Map<string, ShowDetail> = new Map(Object.entries(MOCK_SHOW_DETAILS));

    constructor(private _httpClient: HttpClient) {}

    /**
     * Obtener detalle de un show por ID
     */
    getShowDetail(showId: string): Observable<ShowDetailResponse> {
        return of(showId).pipe(
            delay(500),
            map(id => {
                const detail = this.mockDetails.get(id);
                
                if (!detail) {
                    return {
                        success: false,
                        message: 'Show not found'
                    };
                }
                
                return {
                    success: true,
                    data: detail
                };
            }),
            catchError(error => {
                console.error('Error getting show detail:', error);
                return throwError(() => new Error('Failed to load show detail'));
            })
        );
    }

    /**
     * Guardar detalle del show
     */
    saveShowDetail(showId: string, detail: Partial<ShowDetail>): Observable<ShowDetailResponse> {
        return of({ showId, detail }).pipe(
            delay(500),
            map(({ showId, detail }) => {
                const currentDetail = this.mockDetails.get(showId);
                
                if (!currentDetail) {
                    return {
                        success: false,
                        message: 'Show not found'
                    };
                }
                
                const updatedDetail = {
                    ...currentDetail,
                    ...detail
                };
                
                this.mockDetails.set(showId, updatedDetail);
                
                return {
                    success: true,
                    data: updatedDetail,
                    message: 'Show detail saved successfully'
                };
            }),
            catchError(error => {
                console.error('Error saving show detail:', error);
                return throwError(() => new Error('Failed to save show detail'));
            })
        );
    }
}