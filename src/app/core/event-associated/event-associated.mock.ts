import { EventAssociated } from './event-associated.types';

export const MOCK_EVENTS: EventAssociated[] = [
    {
        id: '1',
        city: 'San Francisco',
        address: '44 Montgomery, St Suite 1610<br>San Francisco, CA., 25636',
        date: '12/21/2025 - 12/25/2025',
        placeName: 'Golden Brother Circus -<br>Función Principal',
        show: 'Nuclear Circus',
        seats: 2500
    },
    {
        id: '2',
        city: 'San Francisco',
        address: '44 Montgomery, St Suite 1610<br>San Francisco, CA., 25636',
        date: '12/21/2025 - 12/25/2025',
        placeName: 'Función Matinée Familiar',
        show: 'Nuclear Circus',
        seats: 6000
    },
    {
        id: '3',
        city: 'San Francisco',
        address: '44 Montgomery, St Suite 1610<br>San Francisco, CA., 25636',
        date: '12/21/2025 - 12/25/2025',
        placeName: 'Ensayo General',
        show: 'Nuclear Circus',
        seats: 6000
    },
    {
        id: '4',
        city: 'San Francisco',
        address: '44 Montgomery, St Suite 1610<br>San Francisco, CA., 25636',
        date: '12/21/2025 - 12/25/2025',
        placeName: 'Ensayo General',
        show: 'Nuclear Circus',
        seats: 5200
    }
];

export const MOCK_EVENTS_RESPONSE = {
    success: true,
    data: {
        events: MOCK_EVENTS,
        total: MOCK_EVENTS.length
    }
};