import { OverviewTotalSalesData } from './overview-total-sales.types';

export const MOCK_OVERVIEW_TOTAL_SALES: OverviewTotalSalesData = {
    metrics: {
        totalSales: 26524775.30,
        totalFees: 4028851.80,
        totalTaxes: 330393.00,
        totalPromo: -5922994.68,
        revenue: 20598487.68,
        avgOrderValue: 124.03,
        avgTicketPrice: 29.61,
        addOnRevenue: 470543.00,
        addOnsSold: 32012,
        activePromoCodes: 49,
        totalOrders: 213862,
        totalTickets: 718365,
        totalPaidTickets: 599476,
        compsIssued: 118889,
        upcomingEvents: 107
    },
    ticketsByType: [
        { label: 'Adult General Admission', value: 185420, color: '#4ADE80' },
        { label: 'Adult Premium Discount General Admission', value: 95340, color: '#FB7185' },
        { label: 'Adult VIP Premium', value: 78650, color: '#FBBF24' },
        { label: 'Adult VIP Tickets', value: 62180, color: '#F472B6' },
        { label: 'Child General Admission', value: 54230, color: '#A78BFA' },
        { label: 'Child Premium Admission', value: 48760, color: '#60A5FA' },
        { label: 'General Admission Child/FREE Child', value: 42150, color: '#34D399' },
        { label: 'Others', value: 38920, color: '#9CA3AF' },
        { label: 'VIP Family 4-Pack Ringside Seating', value: 35680, color: '#10B981' },
        { label: 'Ticket Name', value: 28450, color: '#3B82F6' },
        { label: 'Senior Discount', value: 24890, color: '#8B5CF6' },
        { label: 'Group Sales', value: 23695, color: '#EC4899' }
    ],
    promoCodePerformance: [
        { code: 'A2 mktv...', value: 18542, color: '#9CA3AF' },
        { code: 'ABCART20', value: 15680, color: '#4ADE80' },
        { code: 'BO100', value: 12340, color: '#FBBF24' },
        { code: 'BOGBOJP', value: 10250, color: '#F472B6' },
        { code: 'BOJACK', value: 9180, color: '#60A5FA' },
        { code: 'BOheat', value: 8420, color: '#A78BFA' },
        { code: 'CIRCUSBOGO', value: 7650, color: '#FB7185' },
        { code: 'CIRCUSFUN', value: 6890, color: '#34D399' },
        { code: 'COMP100', value: 6120, color: '#3B82F6' },
        { code: 'EARLY25', value: 5480, color: '#8B5CF6' },
        { code: 'FAMILY15', value: 4920, color: '#EC4899' },
        { code: 'OTHERS', value: 18658, color: '#D1D5DB' }
    ]
};

export const MOCK_OVERVIEW_TOTAL_SALES_RESPONSE = {
    success: true,
    data: MOCK_OVERVIEW_TOTAL_SALES
};