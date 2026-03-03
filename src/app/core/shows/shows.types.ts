export interface Show {
    id: string;
    name: string;
    description: string;
    seats: number;
    status?: 'active' | 'inactive';
    showId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ShowsResponse {
    shows: Show[];
    total: number;
    page: number;
    pageSize: number;
}

export interface ShowFilters {
    search?: string;
    showId?: string;
    status?: string;
}