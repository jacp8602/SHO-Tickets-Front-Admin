export interface SalesReportItem {
    id: string;
    venue: string;
    event: string;
    orders: number;
    allTickets: number;
    tickets: number;
    addOns: number;
    totalFees: number;
    totalTaxes: number;
    amountPaid: number;
    isSummary?: boolean;
    venueSummary?: boolean;
}

export interface GrandSummary {
    orders: number;
    allTickets: number;
    tickets: number;
    addOns: number;
    totalFees: number;
    totalTaxes: number;
    amountPaid: number;
}

export interface VenueSummary {
    venue: string;
    orders: number;
    allTickets: number;
    tickets: number;
    addOns: number;
    totalFees: number;
    totalTaxes: number;
    amountPaid: number;
}

export interface SalesReportResponse {
    success: boolean;
    data: {
        grandSummary: GrandSummary;
        items: SalesReportItem[];
        venueSummaries: VenueSummary[];
    };
    message?: string;
}

export interface SalesReportFilters {
    orderDate?: string;
    adminUser?: string;
    event?: string;
    orderStatus?: string;
    paymentMethod?: string;
}