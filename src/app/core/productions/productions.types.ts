/**
 * Production interface for frontend use
 */
export interface Production {
    id: string;
    name: string;
    description: string;
    workspace?: string;
    systemSourcesId?: number;
    oid?: number;
    status?: 'active' | 'inactive';
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Backend production response structure
 */
export interface BackendProduction {
    id: number;
    name: string;
    description?: string;
    canceled: boolean;
    workspace?: string;
    systemSourcesId?: number;
    oid?: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

/**
 * Productions response with pagination
 */
export interface ProductionsResponse {
    productions: Production[];
    total: number;
    page: number;
    pageSize: number;
}

/**
 * Production filters for search and status
 */
export interface ProductionFilters {
    status?: string;
    search?: string;
}

/**
 * DTO for creating a production
 */
export interface CreateProductionDto {
    name: string;
    workspace: string;
    description?: string;
    systemSourcesId: number;
    canceled?: boolean;
    oid?: number;
}

/**
 * DTO for updating a production
 */
export interface UpdateProductionDto {
    name?: string;
    workspace?: string;
    description?: string;
    canceled?: boolean;
    systemSourcesId?: number;
    oid?: number;
}