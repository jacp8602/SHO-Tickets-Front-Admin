import { VenueLayout } from './venue-layouts.types';

export const MOCK_VENUE_LAYOUTS: VenueLayout[] = [
    {
        id: '1',
        name: 'Golden Brother Circus - Función Principal ID: layout-1',
        description: 'Función principal del Golden Brother Circus con espectáculo completo',
        seats: 25600,
        createDate: '13/02/2026 17:43',
        events: 2,
        status: 'Published',
        production: 'Golden Brother Circus'
    },
    {
        id: '2',
        name: 'Golden Brother Circus - Función Principal ID: layout-1',
        description: 'Función principal del Golden Brother Circus con espectáculo completo',
        seats: 25600,
        createDate: '13/02/2026 17:43',
        events: 2,
        status: 'Published',
        production: 'Golden Brother Circus'
    },
    {
        id: '3',
        name: 'Función Matinée Familiar ID: layout-2',
        description: 'Función especial para familias con niños - horario matutino',
        seats: 25600,
        createDate: '01/04/2026 22:06',
        events: 4,
        status: 'Published',
        production: 'Golden Brother Circus'
    },
    {
        id: '4',
        name: 'Garden Bros Circus Default Layout',
        description: 'Default Layout for Garden Bros Circus Production',
        seats: 2500,
        createDate: '18/03/2026 05:52',
        events: 0,
        status: 'Draft',
        production: 'Garden Bros Circus'
    }
];

export const MOCK_VENUE_LAYOUTS_RESPONSE = {
    layouts: MOCK_VENUE_LAYOUTS,
    total: MOCK_VENUE_LAYOUTS.length
};

export const MOCK_PRODUCTION_OPTIONS = [
    { value: 'all', label: 'All Productions' },
    { value: 'Golden Brother Circus', label: 'Golden Brother Circus' },
    { value: 'Garden Bros Circus', label: 'Garden Bros Circus' }
];