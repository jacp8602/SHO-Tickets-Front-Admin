export interface MenuItem {
    id: string;
    label: string;
    route: string[];
    icon?: string;
    active?: boolean;
}

export interface ProductionMenuConfig {
    productionId: string | null;
    activeItemId: string;
}