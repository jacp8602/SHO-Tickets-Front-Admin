import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { map, delay, catchError } from 'rxjs/operators';
import { 
    TicketsConfiguration, 
    TicketsResponse,
    SingleTicketResponse,
    TicketItem,
    TicketFilters 
} from './tickets.types';
import { MOCK_TICKETS, MOCK_TICKETS_CONFIG } from './tickets.mock';

@Injectable({
    providedIn: 'root'
})
export class TicketsService {
    
    private mockConfigs: Map<string, TicketItem[]> = new Map(Object.entries(MOCK_TICKETS_CONFIG));
    private tickets: TicketItem[] = [...MOCK_TICKETS];
    private readonly SIMULATED_DELAY = 500; // ms

    constructor(private _httpClient: HttpClient) {}

    /**
     * Obtener todos los tickets
     */
    getAllTickets(): Observable<TicketsResponse> {
        return of({
            success: true,
            data: {
                tickets: [...this.tickets],
                total: this.tickets.length
            }
        }).pipe(delay(this.SIMULATED_DELAY));
    }

    /**
     * Obtener un ticket por ID
     */
    getTicketById(ticketId: string): Observable<SingleTicketResponse> {
        const ticket = this.tickets.find(t => t.id === ticketId);
        
        if (!ticket) {
            return throwError(() => new Error('Ticket not found')).pipe(
                delay(this.SIMULATED_DELAY)
            );
        }
        
        return of({
            success: true,
            data: ticket
        }).pipe(delay(this.SIMULATED_DELAY));
    }


    /**
     * Obtener tickets para una producción
     */
    getTickets(productionId: string, filters?: TicketFilters): Observable<TicketsResponse> {
        // Simular llamada HTTP
        return of(productionId).pipe(
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
                        productionId: id,
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
    saveTickets(productionId: string, tickets: TicketItem[]): Observable<TicketsResponse> {
        return of({ productionId, tickets }).pipe(
            delay(500),
            map(({ productionId, tickets }) => {
                // Guardar en mock
                this.mockConfigs.set(productionId, [...tickets]);
                
                return {
                    success: true,
                    data: {
                        productionId,
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
    addTicket(productionId: string, ticket: Omit<TicketItem, 'id'>): Observable<TicketsResponse> {
        const currentTickets = this.mockConfigs.get(productionId) || [];
        
        const newTicket: TicketItem = {
            ...ticket,
            id: Date.now().toString()
        };
        
        const updatedTickets = [...currentTickets, newTicket];
        this.mockConfigs.set(productionId, updatedTickets);
        
        return of({
            success: true,
            data: {
                productionId,
                tickets: updatedTickets
            },
            message: 'Ticket added successfully'
        }).pipe(delay(300));
    }

    /**
     * Actualizar un ticket
     */
    updateTicket(productionId: string, ticketId: string, updates: Partial<TicketItem>): Observable<TicketsResponse> {
        const currentTickets = this.mockConfigs.get(productionId) || [];
        
        const index = currentTickets.findIndex(t => t.id === ticketId);
        if (index === -1) {
            return throwError(() => new Error('Ticket not found'));
        }
        
        const updatedTickets = [...currentTickets];
        updatedTickets[index] = { ...updatedTickets[index], ...updates };
        
        this.mockConfigs.set(productionId, updatedTickets);
        
        return of({
            success: true,
            data: {
                productionId,
                tickets: updatedTickets
            },
            message: 'Ticket updated successfully'
        }).pipe(delay(300));
    }

    /**
     * Eliminar un ticket
     */
    deleteTicket(productionId: string, ticketId: string): Observable<TicketsResponse> {
        const currentTickets = this.mockConfigs.get(productionId) || [];
        
        const updatedTickets = currentTickets.filter(t => t.id !== ticketId);
        this.mockConfigs.set(productionId, updatedTickets);
        
        return of({
            success: true,
            data: {
                productionId,
                tickets: updatedTickets
            },
            message: 'Ticket deleted successfully'
        }).pipe(delay(300));
    }

    /**
     * Alternar estado enabled de un ticket
     */
    toggleTicket(productionId: string, ticketId: string): Observable<TicketsResponse> {
        const currentTickets = this.mockConfigs.get(productionId) || [];
        
        const index = currentTickets.findIndex(t => t.id === ticketId);
        if (index === -1) {
            return throwError(() => new Error('Ticket not found'));
        }
        
        const updatedTickets = [...currentTickets];
        updatedTickets[index] = { 
            ...updatedTickets[index], 
            enabled: !updatedTickets[index].enabled 
        };
        
        this.mockConfigs.set(productionId, updatedTickets);
        
        return of({
            success: true,
            data: {
                productionId,
                tickets: updatedTickets
            },
            message: 'Ticket toggled successfully'
        }).pipe(delay(300));
    }
}