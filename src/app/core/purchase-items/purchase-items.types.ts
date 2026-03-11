export interface PurchaseItem {
    _id: string;
    items: {
        addOn_id?: string;
        addOn?: {
            name?: string;
        };
        seat?: {
            label?: string;
        };
        status?: string;
        ticket_id?: string;
        ticket?: {
            name?: string;
            price?: number;
        };
    };
    allItemsFV?: number;
    purchase_id?: string;
}

export interface PurchaseItemsFilters {
    viewDataFrom?: string;
    search?: string;
    eventId?: string;
    venue?: string;
    event?: string;
}

export interface PurchaseItemsResponse {
    success: boolean;
    data: {
        items: PurchaseItem[];
        totalItems: number;
    };
    message?: string;
}