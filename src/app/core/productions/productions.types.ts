export interface Production {
    id: string;
    name: string;
    description: string;
    status?: 'active' | 'inactive';
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ProductionsResponse {
    productions: Production[];
    total: number;
    page: number;
    pageSize: number;
}

export interface ProductionFilters {
    status?: string;
    search?: string;
}