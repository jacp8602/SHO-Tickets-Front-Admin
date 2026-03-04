import { SalesReportItem, GrandSummary, VenueSummary } from './sales-report.types';

export const MOCK_GRAND_SUMMARY: GrandSummary = {
    orders: 214715,
    allTickets: 754299,
    tickets: 723750,
    addOns: 32540,
    totalFees: 4047334.06,
    totalTaxes: 330636.00,
    amountPaid: 20700692.55
};

export const MOCK_VENUE_SUMMARIES: VenueSummary[] = [
    {
        venue: 'Bradenton, FL',
        orders: 736,
        allTickets: 3037,
        tickets: 2850,
        addOns: 187,
        totalFees: 13613.59,
        totalTaxes: 0,
        amountPaid: 35563.74
    },
    {
        venue: 'Fort Myers, FL',
        orders: 3645,
        allTickets: 12293,
        tickets: 11362,
        addOns: 931,
        totalFees: 64788.00,
        totalTaxes: 4899.00,
        amountPaid: 391309.34
    }
];

export const MOCK_SALES_ITEMS: SalesReportItem[] = [
    // Bradenton Items
    {
        id: '1',
        venue: 'Bradenton, FL',
        event: '4:30pm - 12/14/2023 - Thursday',
        orders: 30,
        allTickets: 107,
        tickets: 99,
        addOns: 0,
        totalFees: 179.20,
        totalTaxes: 0,
        amountPaid: 1352.90
    },
    {
        id: '2',
        venue: 'Bradenton, FL',
        event: '7:30pm - 12/14/2023 - Thursday',
        orders: 44,
        allTickets: 125,
        tickets: 120,
        addOns: 5,
        totalFees: 0,
        totalTaxes: 0,
        amountPaid: 1676.35
    },
    {
        id: '3',
        venue: 'Bradenton, FL',
        event: '4:30pm - 12/15/2023 - Friday',
        orders: 27,
        allTickets: 231,
        tickets: 228,
        addOns: 3,
        totalFees: 0,
        totalTaxes: 0,
        amountPaid: 867.13
    },
    {
        id: '4',
        venue: 'Bradenton, FL',
        event: '7:30pm - 12/15/2023 - Friday',
        orders: 140,
        allTickets: 737,
        tickets: 721,
        addOns: 16,
        totalFees: 0,
        totalTaxes: 0,
        amountPaid: 2821.46
    },
    {
        id: '5',
        venue: 'Bradenton, FL',
        event: '1:30pm - 12/16/2023 - Saturday',
        orders: 79,
        allTickets: 402,
        tickets: 260,
        addOns: 22,
        totalFees: 0,
        totalTaxes: 0,
        amountPaid: 2680.00
    },
    {
        id: '6',
        venue: 'Bradenton, FL',
        event: '4:30pm - 12/16/2023 - Saturday',
        orders: 85,
        allTickets: 383,
        tickets: 353,
        addOns: 30,
        totalFees: 0,
        totalTaxes: 0,
        amountPaid: 5574.80
    },
    {
        id: '7',
        venue: 'Bradenton, FL',
        event: '7:30pm - 12/16/2023 - Saturday',
        orders: 83,
        allTickets: 306,
        tickets: 280,
        addOns: 25,
        totalFees: 0,
        totalTaxes: 0,
        amountPaid: 1276.60
    },
    {
        id: '8',
        venue: 'Bradenton, FL',
        event: '1:30pm - 12/17/2023 - Sunday',
        orders: 80,
        allTickets: 240,
        tickets: 216,
        addOns: 24,
        totalFees: 0,
        totalTaxes: 0,
        amountPaid: 0.00
    },
    {
        id: '9',
        venue: 'Bradenton, FL',
        event: '4:00pm - 12/17/2023 - Sunday',
        orders: 100,
        allTickets: 382,
        tickets: 349,
        addOns: 33,
        totalFees: 0,
        totalTaxes: 0,
        amountPaid: 5250.64
    },
    {
        id: '10',
        venue: 'Bradenton, FL',
        event: '7:00pm - 12/17/2023 - Sunday',
        orders: 78,
        allTickets: 246,
        tickets: 224,
        addOns: 21,
        totalFees: 0,
        totalTaxes: 0,
        amountPaid: 6151.24
    },
    
    // Fort Myers Items
    {
        id: '11',
        venue: 'Fort Myers, FL',
        event: '7:00pm - 11/17/2024 - Wednesday',
        orders: 79,
        allTickets: 275,
        tickets: 234,
        addOns: 41,
        totalFees: 1379.60,
        totalTaxes: 0,
        amountPaid: 8756.56
    },
    {
        id: '12',
        venue: 'Fort Myers, FL',
        event: '4:30pm - 11/18/2024 - Thursday',
        orders: 47,
        allTickets: 161,
        tickets: 146,
        addOns: 13,
        totalFees: 761.55,
        totalTaxes: 0,
        amountPaid: 0.00
    },
    {
        id: '13',
        venue: 'Fort Myers, FL',
        event: '7:30pm - 11/18/2024 - Thursday',
        orders: 85,
        allTickets: 308,
        tickets: 272,
        addOns: 36,
        totalFees: 1501.70,
        totalTaxes: 0,
        amountPaid: 0.00
    },
    {
        id: '14',
        venue: 'Fort Myers, FL',
        event: '4:30pm - 11/19/2024 - Friday',
        orders: 54,
        allTickets: 199,
        tickets: 166,
        addOns: 33,
        totalFees: 877.55,
        totalTaxes: 0,
        amountPaid: 5368.45
    },
    {
        id: '15',
        venue: 'Fort Myers, FL',
        event: '7:30pm - 11/19/2024 - Friday',
        orders: 174,
        allTickets: 664,
        tickets: 575,
        addOns: 88,
        totalFees: 3412.25,
        totalTaxes: 0,
        amountPaid: 20042.23
    }
];