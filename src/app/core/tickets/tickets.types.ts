export interface TicketItem {
    id: string;
    name: string;
    description?: string;  // Añadida propiedad description
    quantity?: number;
    price?: number;
    type?: 'general' | 'reserved' | 'vip' | 'bo' | 'addon';
    section?: string;
    enabled?: boolean;
}

export interface TicketsConfiguration {
    productionId?: string;
    tickets: TicketItem[];
    total?: number;
}

export interface TicketsResponse {
    success: boolean;
    data?: TicketsConfiguration;
    message?: string;
}

export interface TicketFilters {
    type?: string;
    search?: string;
    enabled?: boolean;
    productionId?: string;
}

export interface SingleTicketResponse {
    success: boolean;
    data?: TicketItem;
    message?: string;
    error?: string;
}