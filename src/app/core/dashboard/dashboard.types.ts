export interface DashboardSummary {
    totalTicketsSold: number;
    totalTicketsSoldPercentage: number;
    totalRevenue: number;
    averageTicketPrice: number;
    attendanceRate: number;
}

export interface EventPerformance {
    id: string;
    show: string;
    city: string;
    capita: number;
    revenue: number;
}

export interface PromoCode {
    id: string;
    code: string;
}

export interface ChannelData {
    name: string;
    color: string;
}

export interface CustomerData {
    type: 'New' | 'Returning';
    color: string;
}

export interface TicketTypeData {
    type: 'VIP' | 'General' | 'Child';
    color: string;
}

export interface DailySales {
    new: number;
    returning: number;
}

export interface DashboardData {
    summary: DashboardSummary;
    revenueTrendChannels: ChannelData[];
    revenueTrendData: number[];           // valores para la línea curva
    ticketsSoldTrendCustomers: CustomerData[];
    ticketsSoldTrend: number[];
    eventPerformance: EventPerformance[];
    promoCodes: PromoCode[];
    ticketTypes: TicketTypeData[];
    ticketsByChannel: TicketsByChannelItem[];
    customerTypes: CustomerTypeItem[];
    uniqueGamePercentage: number;
}

export interface DashboardResponse {
    success: boolean;
    data: DashboardData;
    message?: string;
}

export interface PieChartItem {
    label: string;      // nombre del segmento
    value: number;      // porcentaje (0-100)
    color: string;      // color en hexadecimal, ej. '#3b82f6'
    startAngle?: number; // se calcula en el componente
    endAngle?: number;   // se calcula en el componente
}

// Si quieres nombres más específicos:
export interface TicketsByChannelItem extends PieChartItem {}
export interface CustomerTypeItem extends PieChartItem {}