import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, delay, catchError } from 'rxjs/operators';
import { 
    ShowTicketsConfiguration, 
    ShowTicketsResponse, 
    ShowTicketItem,
    ShowTicketFilters 
} from './show-tickets.types';
import { MOCK_TICKETS_CONFIG } from './show-tickets.mock';

@Injectable({
    providedIn: 'root'
})
export class ShowTicketsService {
    
    private mockConfigs: Map<string, ShowTicketItem[]> = new Map(Object.entries(MOCK_TICKETS_CONFIG));

    constructor(private _httpClient: HttpClient) {}

    /**
     * Obtener tickets para un show
     */
    getTickets(showId: string, filters?: ShowTicketFilters): Observable<ShowTicketsResponse> {
        // Simular llamada HTTP
        return of(showId).pipe(
            delay(500),
            map(id => {
                const tickets = this.mockConfigs.get(id) || [];
                
                // Aplicar filtros si existen
                let filteredTickets = [...tickets];
                
                if (filters?.enabled !== undefined) {
                    filteredTickets = filteredTickets.filter(t => t.enabled === filters.enabled);
                }
                
                if (filters?.type) {
                    filteredTickets = filteredTickets.filter(t => t.type === filters.type);
                }
                
                if (filters?.search) {
                    const searchTerm = filters.search.toLowerCase();
                    filteredTickets = filteredTickets.filter(t => 
                        t.name.toLowerCase().includes(searchTerm)
                    );
                }
                
                return {
                    success: true,
                    data: {
                        showId: id,
                        tickets: filteredTickets
                    }
                };
            }),
            catchError(error => {
                console.error('Error getting tickets:', error);
                return throwError(() => new Error('Failed to load tickets'));
            })
        );
    }

    /**
     * Guardar tickets
     */
    saveTickets(showId: string, tickets: ShowTicketItem[]): Observable<ShowTicketsResponse> {
        return of({ showId, tickets }).pipe(
            delay(500),
            map(({ showId, tickets }) => {
                // Guardar en mock
                this.mockConfigs.set(showId, [...tickets]);
                
                return {
                    success: true,
                    data: {
                        showId,
                        tickets
                    },
                    message: 'Tickets saved successfully'
                };
            }),
            catchError(error => {
                console.error('Error saving tickets:', error);
                return throwError(() => new Error('Failed to save tickets'));
            })
        );
    }

    /**
     * Agregar un nuevo ticket
     */
    addTicket(showId: string, ticket: Omit<ShowTicketItem, 'id'>): Observable<ShowTicketsResponse> {
        const currentTickets = this.mockConfigs.get(showId) || [];
        
        const newTicket: ShowTicketItem = {
            ...ticket,
            id: Date.now().toString()
        };
        
        const updatedTickets = [...currentTickets, newTicket];
        this.mockConfigs.set(showId, updatedTickets);
        
        return of({
            success: true,
            data: {
                showId,
                tickets: updatedTickets
            },
            message: 'Ticket added successfully'
        }).pipe(delay(300));
    }

    /**
     * Actualizar un ticket
     */
    updateTicket(showId: string, ticketId: string, updates: Partial<ShowTicketItem>): Observable<ShowTicketsResponse> {
        const currentTickets = this.mockConfigs.get(showId) || [];
        
        const index = currentTickets.findIndex(t => t.id === ticketId);
        if (index === -1) {
            return throwError(() => new Error('Ticket not found'));
        }
        
        const updatedTickets = [...currentTickets];
        updatedTickets[index] = { ...updatedTickets[index], ...updates };
        
        this.mockConfigs.set(showId, updatedTickets);
        
        return of({
            success: true,
            data: {
                showId,
                tickets: updatedTickets
            },
            message: 'Ticket updated successfully'
        }).pipe(delay(300));
    }

    /**
     * Eliminar un ticket
     */
    deleteTicket(showId: string, ticketId: string): Observable<ShowTicketsResponse> {
        const currentTickets = this.mockConfigs.get(showId) || [];
        
        const updatedTickets = currentTickets.filter(t => t.id !== ticketId);
        this.mockConfigs.set(showId, updatedTickets);
        
        return of({
            success: true,
            data: {
                showId,
                tickets: updatedTickets
            },
            message: 'Ticket deleted successfully'
        }).pipe(delay(300));
    }

    /**
     * Alternar estado enabled de un ticket
     */
    toggleTicket(showId: string, ticketId: string): Observable<ShowTicketsResponse> {
        const currentTickets = this.mockConfigs.get(showId) || [];
        
        const index = currentTickets.findIndex(t => t.id === ticketId);
        if (index === -1) {
            return throwError(() => new Error('Ticket not found'));
        }
        
        const updatedTickets = [...currentTickets];
        updatedTickets[index] = { 
            ...updatedTickets[index], 
            enabled: !updatedTickets[index].enabled 
        };
        
        this.mockConfigs.set(showId, updatedTickets);
        
        return of({
            success: true,
            data: {
                showId,
                tickets: updatedTickets
            },
            message: 'Ticket toggled successfully'
        }).pipe(delay(300));
    }
}