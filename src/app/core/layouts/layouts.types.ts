export interface Layout {
    id: string;
    name: string;
    description: string;
    seats: number;
    status: 'Published' | 'Draft';
    productionId?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface LayoutsResponse {
    layouts: Layout[];
    total: number;
    page: number;
    pageSize: number;
}

export interface LayoutFilters {
    status?: string;
    search?: string;
    productionId?: string;
}