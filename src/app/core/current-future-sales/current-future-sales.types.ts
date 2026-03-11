export interface CurrentFutureSalesItem {
    id: string;
    ordering: number;
    venue: string;
    event: string;
    tickets: number;
    totalFees: number;
    totalTaxes: number;
    amountPaid: number;
}

export interface CurrentFutureSalesFilters {
    orderDate?: string;
    adminUser?: string;
    event?: string;
    orderStatus?: string;
    paymentMethod?: string;
}

export interface CurrentFutureSalesResponse {
    success: boolean;
    data: {
        items: CurrentFutureSalesItem[];
        totalItems: number;
        totalPages: number;
    };
    message?: string;
}