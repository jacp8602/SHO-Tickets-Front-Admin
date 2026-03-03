import { ShowAddonItem } from './show-addons.types';

export const MOCK_ADDONS: ShowAddonItem[] = [
    {
        id: '1',
        name: 'Spongebob Bounce',
        category: 'Both',
        price: 41.00,
        quantity: 2,
        enabled: true
    },
    {
        id: '2',
        name: 'Obstacle Bounce',
        category: 'Both',
        price: 51.00,
        quantity: 2,
        enabled: true
    },
    {
        id: '3',
        name: 'Pony Ride',
        category: 'Experience',
        price: 61.00,
        quantity: 2,
        enabled: true
    },
    {
        id: '4',
        name: 'Big Slice',
        category: 'Food',
        price: 31.00,
        quantity: 2,
        enabled: true
    },
    {
        id: '5',
        name: 'Unlimited Ride Wristband',
        category: 'Both',
        price: 10.00,
        quantity: 2,
        enabled: true
    },
    {
        id: '6',
        name: 'Performer Photo',
        category: 'Experience',
        price: 10.00,
        quantity: 2,
        enabled: true
    },
    {
        id: '7',
        name: 'Splat Wars',
        category: 'Both',
        price: 10.00,
        quantity: 2,
        enabled: true
    },
    {
        id: '8',
        name: 'Dinosaurs',
        category: 'Both',
        price: 10.00,
        quantity: 2,
        enabled: true
    },
    {
        id: '9',
        name: 'Fresh Lemonade',
        category: 'Drink',
        price: 8.00,
        quantity: 2,
        enabled: true
    },
    {
        id: '10',
        name: 'Circus T-Shirt',
        category: 'Merchandise',
        price: 25.00,
        quantity: 2,
        enabled: true
    }
];

export const MOCK_ADDONS_CONFIG: Record<string, ShowAddonItem[]> = {
    '1': MOCK_ADDONS,
    '2': [
        {
            id: '9',
            name: 'Monster Truck Ride',
            category: 'Experience',
            price: 25.00,
            quantity: 2,
            enabled: true
        },
        {
            id: '10',
            name: 'Face Painting',
            category: 'Experience',
            price: 15.00,
            quantity: 2,
            enabled: true
        },
        {
            id: '11',
            name: 'Monster Truck Hat',
            category: 'Merchandise',
            price: 20.00,
            quantity: 2,
            enabled: true
        },
        {
            id: '12',
            name: 'Soda Pop',
            category: 'Drink',
            price: 5.00,
            quantity: 2,
            enabled: true
        }
    ]
};