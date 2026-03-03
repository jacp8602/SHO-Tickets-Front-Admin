import { ShowTicketItem } from './show-tickets.types';

export const MOCK_TICKETS: ShowTicketItem[] = [
    {
        id: '1',
        name: 'Adult general Admission',
        description: 'General admission for adults',
        quantity: 600,
        type: 'general',
        enabled: true
    },
    {
        id: '2',
        name: 'Reserved Seating Blue',
        description: 'Blue section reserved seating',
        price: 41.00,
        type: 'reserved',
        enabled: true
    },
    {
        id: '3',
        name: 'Add-Ons',
        description: 'Various add-ons and extras',
        type: 'addon',
        enabled: false
    },
    {
        id: '4',
        name: 'Adult Premium Admission',
        description: 'Premium seating with better view',
        quantity: 1000,
        price: 75.00,
        type: 'general',
        enabled: true
    },
    {
        id: '5',
        name: 'Reserved Seating Red',
        description: 'Red section reserved seating',
        price: 51.00,
        type: 'reserved',
        enabled: true
    },
    {
        id: '6',
        name: 'Adult VIP Admission',
        description: 'VIP access with meet and greet',
        quantity: 2560,
        price: 120.00,
        type: 'vip',
        enabled: true
    },
    {
        id: '7',
        name: 'From Row Seating',
        description: 'Front row seats',
        price: 61.00,
        type: 'reserved',
        enabled: true
    },
    {
        id: '8',
        name: 'BO-Adult General Admission',
        description: 'Box office adult admission',
        price: 31.00,
        type: 'bo',
        enabled: true
    },
    {
        id: '9',
        name: 'BO-Child General Admission',
        description: 'Box office child admission',
        price: 10.00,
        type: 'bo',
        enabled: true
    }
];

export const MOCK_TICKETS_CONFIG: Record<string, ShowTicketItem[]> = {
    '1': MOCK_TICKETS,
    '2': [
        {
            id: '10',
            name: 'Monster Truck General',
            description: 'General admission for Monster Truck show',
            quantity: 500,
            price: 35.00,
            type: 'general',
            enabled: true
        },
        {
            id: '11',
            name: 'Monster Truck VIP',
            description: 'VIP experience for Monster Truck',
            quantity: 100,
            price: 85.00,
            type: 'vip',
            enabled: true
        },
        {
            id: '12',
            name: 'Monster Truck Family Pack',
            description: 'Family pack (2 adults, 2 children)',
            quantity: 200,
            price: 120.00,
            type: 'general',
            enabled: true
        }
    ]
};