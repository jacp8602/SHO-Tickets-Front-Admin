import { AdministratorSummaryItem } from './administrator-summary.types';

export const MOCK_ADMINISTRATOR_SUMMARY_ITEMS: AdministratorSummaryItem[] = [
    {
        id: '1',
        administrator: 'Unknown',
        tickets: 1703,
        faceValue: 60025.50,
        fees: 12955.05,
        subTotal: 74440.55,
        promoDiscount: 73246.65,
        total: 63259.65
    },
    {
        id: '2',
        administrator: 'Andre',
        tickets: 1003,
        faceValue: 31445.00,
        fees: 5119.00,
        subTotal: 36564.00,
        promoDiscount: 20591.50,
        total: 3192.50
    },
    {
        id: '3',
        administrator: 'Angela',
        tickets: 120,
        faceValue: 2600.00,
        fees: 530.00,
        subTotal: 3130.00,
        promoDiscount: 2600.00,
        total: 530.00
    },
    {
        id: '4',
        administrator: 'Arati',
        tickets: 333,
        faceValue: 16415.00,
        fees: 2906.50,
        subTotal: 19711.50,
        promoDiscount: 16669.12,
        total: 3041.80
    },
    {
        id: '5',
        administrator: 'BOX OFFICE',
        tickets: 12,
        faceValue: 162.00,
        fees: 31.20,
        subTotal: 193.20,
        promoDiscount: 410.00,
        total: 94.68
    },
    {
        id: '6',
        administrator: 'Barrett',
        tickets: 1163,
        faceValue: 33255.00,
        fees: 6188.00,
        subTotal: 40023.00,
        promoDiscount: 31813.43,
        total: 8307.20
    },
    {
        id: '7',
        administrator: 'Bonita',
        tickets: 2291,
        faceValue: 56676.00,
        fees: 13293.50,
        subTotal: 70919.50,
        promoDiscount: 70318.27,
        total: 0.00
    },
    {
        id: '8',
        administrator: 'Boz',
        tickets: 6,
        faceValue: 150.00,
        fees: 30.00,
        subTotal: 180.00,
        promoDiscount: 0.00,
        total: 120.00
    },
    {
        id: '9',
        administrator: 'Brian',
        tickets: 3,
        faceValue: 80.00,
        fees: 17.00,
        subTotal: 97.00,
        promoDiscount: 97.00,
        total: 0.00
    },
    {
        id: '10',
        administrator: 'Carol',
        tickets: 263,
        faceValue: 14648.00,
        fees: 1718.61,
        subTotal: 17221.61,
        promoDiscount: 17217.68,
        total: 0.00
    },
    {
        id: '11',
        administrator: 'Chad',
        tickets: 2273,
        faceValue: 16990.00,
        fees: 2381.50,
        subTotal: 20389.50,
        promoDiscount: 20388.91,
        total: 0.00
    },
    {
        id: '12',
        administrator: 'Cooper',
        tickets: 22,
        faceValue: 655.00,
        fees: 129.65,
        subTotal: 927.65,
        promoDiscount: 785.79,
        total: 42.00
    },
    {
        id: '13',
        administrator: 'Daniel',
        tickets: 48,
        faceValue: 1225.00,
        fees: 242.50,
        subTotal: 1493.50,
        promoDiscount: 1368.88,
        total: 124.00
    },
    {
        id: '14',
        administrator: 'David',
        tickets: 15534,
        faceValue: 690021.00,
        fees: 103790.59,
        subTotal: 800021.59,
        promoDiscount: 522971.76,
        total: 296451.29
    },
    {
        id: '15',
        administrator: 'Elise',
        tickets: 808,
        faceValue: 24987.00,
        fees: 4072.84,
        subTotal: 30461.84,
        promoDiscount: 14302.46,
        total: 16571.52
    },
    {
        id: '16',
        administrator: 'Emily',
        tickets: 2762,
        faceValue: 127145.00,
        fees: 19234.50,
        subTotal: 146379.50,
        promoDiscount: 27497.50,
        total: 118882.00
    },
    {
        id: '17',
        administrator: 'Estrella',
        tickets: 299,
        faceValue: 8295.00,
        fees: 1632.00,
        subTotal: 10527.00,
        promoDiscount: 10124.00,
        total: 402.00
    },
    {
        id: '18',
        administrator: 'Garden Brothers',
        tickets: 324,
        faceValue: 10020.00,
        fees: 1587.00,
        subTotal: 13968.00,
        promoDiscount: 13225.76,
        total: 674.96
    }
];

export const MOCK_ADMINISTRATOR_SUMMARY_RESPONSE = {
    success: true,
    data: {
        items: MOCK_ADMINISTRATOR_SUMMARY_ITEMS,
        totalItems: MOCK_ADMINISTRATOR_SUMMARY_ITEMS.length
    }
};