export interface OverviewTotalSalesMetrics {
    totalSales: number;
    totalFees: number;
    totalTaxes: number;
    totalPromo: number;
    revenue: number;
    avgOrderValue: number;
    avgTicketPrice: number;
    addOnRevenue: number;
    addOnsSold: number;
    activePromoCodes: number;
    totalOrders: number;
    totalTickets: number;
    totalPaidTickets: number;
    compsIssued: number;
    upcomingEvents: number;
}

export interface TicketTypeData {
    label: string;
    value: number;
    color: string;
}

export interface PromoCodeData {
    code: string;
    value: number;
    color: string;
}

export interface OverviewTotalSalesData {
    metrics: OverviewTotalSalesMetrics;
    ticketsByType: TicketTypeData[];
    promoCodePerformance: PromoCodeData[];
}

export interface OverviewTotalSalesFilters {
    orderDate?: string;
    adminUser?: string;
    event?: string;
    orderStatus?: string;
    paymentMethod?: string;
}

export interface OverviewTotalSalesResponse {
    success: boolean;
    data: OverviewTotalSalesData;
    message?: string;
}