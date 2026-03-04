/**
 * Interfaz para los items del menú de productions
 */
export interface MenuItem {
    /** Identificador único del item */
    id: MenuItemId;
    
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
export enum MenuItemId {
    BASIC = 'basic',
    LAYOUTS = 'layouts',
    TICKETS = 'tickets',
    ADDONS = 'addons'
}

/**
 * Configuración para el menú de shows
 */
export interface MenuConfig {
    /** ID del show actual */
    productionId: string | null;
    
    /** ID del item activo por defecto */
    activeItemId: MenuItemId;
}

/**
 * Respuesta al cargar el menú
 */
export interface MenuResponse {
    success: boolean;
    data?: MenuItem[];
    message?: string;
}

/**
 * Estado del menú
 */
export interface MenuState {
    items: MenuItem[];
    activeItemId: MenuItemId | null;
    productionId: string | null;
    isLoading: boolean;
    error: string | null;
}