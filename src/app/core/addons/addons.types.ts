export interface AddonItem {
    id: string;
    name: string;
    category: string; // "Both" en la imagen
    price: number;
    quantity: number;
    enabled?: boolean;
}

export interface AddonsConfiguration {
    productionId: string;
    addons: AddonItem[];
}

export interface AddonsResponse {
    success: boolean;
    data?: AddonsConfiguration;
    message?: string;
}

export interface AddonFilters {
    category?: string;
    search?: string;
    enabled?: boolean;
    productionId?: string;
}