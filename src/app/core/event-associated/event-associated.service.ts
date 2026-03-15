import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { EventAssociatedResponse, EventAssociatedFilters } from './event-associated.types';
import { MOCK_EVENTS_RESPONSE } from './event-associated.mock';

@Injectable({
    providedIn: 'root'
})
export class EventAssociatedService {

    constructor(private _httpClient: HttpClient) {}

    getEvents(filters?: EventAssociatedFilters): Observable<EventAssociatedResponse> {
        // En un caso real, aquí se aplicarían los filtros
        return of(MOCK_EVENTS_RESPONSE).pipe(delay(500));
    }
}