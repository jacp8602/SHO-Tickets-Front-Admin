export interface EventAssociated {
    id: string;
    city: string;
    address: string;
    date: string;
    placeName: string;
    show: string;
    seats: number;
}

export interface EventAssociatedResponse {
    success: boolean;
    data: {
        events: EventAssociated[];
        total: number;
    };
    message?: string;
}

export interface EventAssociatedFilters {
    layoutId?: string;
    search?: string;
}