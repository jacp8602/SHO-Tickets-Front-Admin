import { DashboardData } from './dashboard.types';

export const MOCK_DASHBOARD_DATA: DashboardData = {
    summary: {
        totalTicketsSold: 14235,
        totalTicketsSoldPercentage: 5,
        totalRevenue: 186400,
        averageTicketPrice: 13.10,
        attendanceRate: 82
    },
    revenueTrendChannels: [
        { name: 'Website', color: 'bg-blue-500' },
        { name: 'Box Office', color: 'bg-green-500' },
        { name: 'Mobile App', color: 'bg-purple-500' }
    ],
    revenueTrendData: [10, 25, 45, 60, 55, 70, 85, 95, 100],
    ticketsSoldTrendCustomers: [
        { type: 'New', color: 'bg-blue-500' },
        { type: 'Returning', color: 'bg-green-500' }
    ],
    ticketsSoldTrend: [120, 95, 150, 80, 200, 110, 130, 150, 80, 200, 110, 130],
    eventPerformance: [
        { id: '1', show: 'Circus of Dreams', city: 'Miami', capita: 4210, revenue: 55000 },
        { id: '2', show: 'Flying Lions', city: 'Orlando', capita: 8020, revenue: 96000 },
        { id: '3', show: 'Acrobat Fever', city: 'Tampa', capita: 2700, revenue: 32300 }
    ],
    promoCodes: [
        { id: '1', code: 'SAVE20' },
        { id: '2', code: 'DISCOUNT' },
        { id: '3', code: 'VIP10' },
        { id: '4', code: 'FUN' },
        { id: '5', code: 'SUMMER' }
    ],
    ticketTypes: [
        { type: 'VIP', color: 'bg-purple-500' },
        { type: 'General', color: 'bg-blue-500' },
        { type: 'Child', color: 'bg-green-500' }
    ],
    ticketsByChannel: [
        { label: 'Website', value: 45, color: '#3b82f6' },
        { label: 'Box Office', value: 30, color: '#10b981' },
        { label: 'Mobile App', value: 25, color: '#8b5cf6' }
    ],
    customerTypes: [
        { label: 'New', value: 68, color: '#6366f1' },
        { label: 'Returning', value: 32, color: '#f59e0b' }
    ],
    uniqueGamePercentage: 32
};