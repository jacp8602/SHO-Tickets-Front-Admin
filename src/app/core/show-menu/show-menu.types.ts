/**
 * Interfaz para los items del menú de shows
 */
export interface ShowMenuItem {
    /** Identificador único del item */
    id: ShowMenuItemId;
    
    /** Texto a mostrar en el menú */
    label: string;
    
    /** Ruta de navegación (array para router.navigate) */
    route: string[];
    
    /** Indica si el item está activo actualmente */
    active?: boolean;
    
    /** Icono opcional para el item */
    icon?: string;
}

/**
 * Enumeración de los IDs de los items del menú de shows
 */
export enum ShowMenuItemId {
    BASIC = 'basic',
    TICKETS = 'tickets',
    ADDONS = 'addons'
}

/**
 * Configuración para el menú de shows
 */
export interface ShowMenuConfig {
    /** ID del show actual */
    showId: string | null;
    
    /** ID del item activo por defecto */
    activeItemId: ShowMenuItemId;
}

/**
 * Respuesta al cargar el menú
 */
export interface ShowMenuResponse {
    success: boolean;
    data?: ShowMenuItem[];
    message?: string;
}

/**
 * Estado del menú
 */
export interface ShowMenuState {
    items: ShowMenuItem[];
    activeItemId: ShowMenuItemId | null;
    showId: string | null;
    isLoading: boolean;
    error: string | null;
}