export interface AdministratorSummaryItem {
    id: string;
    administrator: string;
    tickets: number;
    faceValue: number;
    fees: number;
    subTotal: number;
    promoDiscount: number;
    total: number;
}

export interface AdministratorSummaryFilters {
    orderDate?: string;
    adminUser?: string;
    event?: string;
    orderStatus?: string;
    paymentMethod?: string;
}

export interface AdministratorSummaryResponse {
    success: boolean;
    data: {
        items: AdministratorSummaryItem[];
        totalItems: number;
    };
    message?: string;
}