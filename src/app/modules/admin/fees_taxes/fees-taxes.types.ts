export interface FeeTaxItem {
    id?: string; // Añadimos ID para identificar items
    name: string;
    description?: string;
    state?: string;
    value: number | string;
    type?: 'percentage' | 'fixed';
    currency?: string;
    isActive?: boolean;
}

export interface FeeTaxSection {
    title: string;
    items: FeeTaxItem[];
    showPagination: boolean;
    currentPage: number;
    totalPages: number;
}

export interface FeesTaxesData {
    sections: FeeTaxSection[];
}

// Tipo para el formulario
export interface FeeFormData {
    name: string;
    description: string;
    feeType: 'percentage' | 'fixed';
    amount: number;
    isActive: boolean;
}

// Tipo para el formulario de Tax
export interface TaxFormData {
    name: string;
    state: string;
    percentage: number;
    isActive: boolean;
}