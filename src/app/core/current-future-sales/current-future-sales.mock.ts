import { CurrentFutureSalesItem } from './current-future-sales.types';

export const MOCK_CURRENT_FUTURE_SALES_ITEMS: CurrentFutureSalesItem[] = [
    {
        id: '1',
        ordering: 1,
        venue: 'West Palm Beach, FL-South Florida Fairgrounds',
        event: 'West Palm Beach, FL - 4:30pm - 12/12/2025 - Friday',
        tickets: 129,
        totalFees: 70.54,
        totalTaxes: 0,
        amountPaid: 4263.84
    },
    {
        id: '2',
        ordering: 2,
        venue: 'West Palm Beach, FL-South Florida Fairgrounds',
        event: 'West Palm Beach, FL - 7:30pm - 12/12/2025 - Friday',
        tickets: 373,
        totalFees: 2138.11,
        totalTaxes: 0,
        amountPaid: 7958.71
    },
    {
        id: '3',
        ordering: 3,
        venue: 'West Palm Beach, FL-South Florida Fairgrounds',
        event: 'West Palm Beach, FL - 1:30pm - 12/13/2025 - Saturday',
        tickets: 234,
        totalFees: 1410.42,
        totalTaxes: 0,
        amountPaid: 7288.47
    },
    {
        id: '4',
        ordering: 4,
        venue: 'West Palm Beach, FL-South Florida Fairgrounds',
        event: 'West Palm Beach, FL - 4:30pm - 12/13/2025 - Saturday',
        tickets: 261,
        totalFees: 1574.44,
        totalTaxes: 0,
        amountPaid: 8343.64
    },
    {
        id: '5',
        ordering: 5,
        venue: 'West Palm Beach, FL-South Florida Fairgrounds',
        event: 'West Palm Beach, FL - 7:30pm - 12/13/2025 - Saturday',
        tickets: 215,
        totalFees: 1304.16,
        totalTaxes: 0,
        amountPaid: 6602.62
    },
    {
        id: '6',
        ordering: 6,
        venue: 'West Palm Beach, FL-South Florida Fairgrounds',
        event: 'West Palm Beach, FL - 1:30pm - 12/14/2025 - Sunday',
        tickets: 221,
        totalFees: 1361.36,
        totalTaxes: 0,
        amountPaid: 5895.51
    },
    {
        id: '7',
        ordering: 7,
        venue: 'West Palm Beach, FL-South Florida Fairgrounds',
        event: 'West Palm Beach, FL - 4:00pm - 12/14/2025 - Sunday',
        tickets: 204,
        totalFees: 1227.02,
        totalTaxes: 0,
        amountPaid: 5953.87
    },
    {
        id: '8',
        ordering: 8,
        venue: 'West Palm Beach, FL-South Florida Fairgrounds',
        event: 'West Palm Beach, FL - 7:00pm - 12/14/2025 - Sunday',
        tickets: 33,
        totalFees: 82.01,
        totalTaxes: 0,
        amountPaid: 2064.09
    },
    {
        id: '9',
        ordering: 9,
        venue: 'North Port, FL-GurtPaller Park',
        event: 'North Port, FL - 4:30pm - 12/18/2025 - Thursday',
        tickets: 83,
        totalFees: 50.63,
        totalTaxes: 0,
        amountPaid: 2401.42
    },
    {
        id: '10',
        ordering: 10,
        venue: 'North Port, FL-GurtPaller Park',
        event: 'North Port, FL - 7:30pm - 12/18/2025 - Thursday',
        tickets: 48,
        totalFees: 90.45,
        totalTaxes: 0,
        amountPaid: 1467.55
    },
    {
        id: '11',
        ordering: 11,
        venue: 'North Port, FL-GurtPaller Park',
        event: 'North Port, FL - 4:30pm - 12/19/2025 - Friday',
        tickets: 81,
        totalFees: 84.02,
        totalTaxes: 0,
        amountPaid: 2502.52
    },
    {
        id: '12',
        ordering: 12,
        venue: 'North Port, FL-GurtPaller Park',
        event: 'North Port, FL - 7:30pm - 12/19/2025 - Friday',
        tickets: 102,
        totalFees: 62.15,
        totalTaxes: 0,
        amountPaid: 2886.40
    },
    {
        id: '13',
        ordering: 13,
        venue: 'North Port, FL-GurtPaller Park',
        event: 'North Port, FL - 1:30pm - 12/20/2025 - Saturday',
        tickets: 101,
        totalFees: 96.83,
        totalTaxes: 0,
        amountPaid: 2866.16
    },
    {
        id: '14',
        ordering: 14,
        venue: 'North Port, FL-GurtPaller Park',
        event: 'North Port, FL - 4:30pm - 12/20/2025 - Saturday',
        tickets: 136,
        totalFees: 75.04,
        totalTaxes: 0,
        amountPaid: 3473.29
    }
];

export const MOCK_CURRENT_FUTURE_SALES_RESPONSE = {
    success: true,
    data: {
        items: MOCK_CURRENT_FUTURE_SALES_ITEMS,
        totalItems: MOCK_CURRENT_FUTURE_SALES_ITEMS.length,
        totalPages: 11
    }
};