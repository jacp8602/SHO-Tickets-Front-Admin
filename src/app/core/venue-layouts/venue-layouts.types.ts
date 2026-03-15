export interface VenueLayout {
    id: string;
    name: string;
    description: string;
    seats: number;
    createDate: string; // formato DD/MM/YYYY HH:mm
    events: number;
    status: 'Published' | 'Draft';
    production?: string; // nombre de la producción (para filtro)
}

export interface VenueLayoutsResponse {
    layouts: VenueLayout[];
    total: number;
}

export interface VenueLayoutFilters {
    status?: 'Published' | 'Draft' | 'all';
    production?: string | 'all';
    search?: string;
}