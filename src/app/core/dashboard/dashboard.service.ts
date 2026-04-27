import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DashboardResponse } from './dashboard.types';
import { MOCK_DASHBOARD_DATA } from './dashboard.mock';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    constructor(private _httpClient: HttpClient) {}

    getDashboardData(): Observable<DashboardResponse> {
        return of({
            success: true,
            data: MOCK_DASHBOARD_DATA
        }).pipe(delay(500));
    }
}