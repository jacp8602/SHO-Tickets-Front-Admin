export interface ShowTicketItem {
    id: string;
    name: string;
    description?: string;  // Añadida propiedad description
    quantity?: number;
    price?: number;
    type?: 'general' | 'reserved' | 'vip' | 'bo' | 'addon';
    section?: string;
    enabled?: boolean;
}

export interface ShowTicketsConfiguration {
    showId: string;
    tickets: ShowTicketItem[];
}

export interface ShowTicketsResponse {
    success: boolean;
    data?: ShowTicketsConfiguration;
    message?: string;
}

export interface ShowTicketFilters {
    type?: string;
    search?: string;
    enabled?: boolean;
    showId?: string;
}