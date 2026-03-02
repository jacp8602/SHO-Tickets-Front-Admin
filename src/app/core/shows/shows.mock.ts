import { Show } from './shows.types';

export const MOCK_SHOWS: Show[] = [
    {
        id: '1',
        name: 'Golden Brother Nuclear Circus',
        description: 'Nuclear Circus',
        seats: 2500,
        status: 'active',
        showId: '1',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date('2024-02-20')
    },
    {
        id: '2',
        name: 'Monster Truck',
        description: 'Nuclear Circus',
        seats: 2500,
        status: 'active',
        showId: '1',
        createdAt: new Date('2024-01-20'),
        updatedAt: new Date('2024-02-18')
    },
    {
        id: '3',
        name: 'Evening Magic Show',
        description: 'Night performance with illusions',
        seats: 1800,
        status: 'active',
        showId: '1',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date('2024-02-15')
    },
    {
        id: '4',
        name: 'Matinee Family Fun',
        description: 'Daytime show for families',
        seats: 2200,
        status: 'inactive',
        showId: '1',
        createdAt: new Date('2024-02-05'),
        updatedAt: new Date('2024-02-10')
    }
];

export const MOCK_SHOWS_CONFIG: Record<string, Show[]> = {
    '1': MOCK_SHOWS,
    '2': [
        {
            id: '5',
            name: 'Monster Truck Mayhem',
            description: 'Extreme monster truck show',
            seats: 3000,
            status: 'active',
            showId: '2',
            createdAt: new Date('2024-02-10'),
            updatedAt: new Date('2024-02-15')
        },
        {
            id: '6',
            name: 'Freestyle Motocross',
            description: 'FMX tricks and jumps',
            seats: 2800,
            status: 'active',
            showId: '2',
            createdAt: new Date('2024-02-12'),
            updatedAt: new Date('2024-02-16')
        }
    ]
};