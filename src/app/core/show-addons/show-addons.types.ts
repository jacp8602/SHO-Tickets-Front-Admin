export interface ShowAddonItem {
    id: string;
    name: string;
    category: string; // "Both" en la imagen
    price: number;
    quantity: number;
    enabled?: boolean;
}

export interface ShowAddonsConfiguration {
    showId: string;
    addons: ShowAddonItem[];
}

export interface ShowAddonsResponse {
    success: boolean;
    data?: ShowAddonsConfiguration;
    message?: string;
}

export interface ShowAddonFilters {
    category?: string;
    search?: string;
    enabled?: boolean;
    showId?: string;
}