export interface RefundOrder {
    orderNumber: string;
    eventInfo: string;
    bccEmail: string;
    refundAmount: number;
    internalNote: string;
    items: RefundItem[];
    pagination: PaginationInfo;
}

export interface RefundItem {
    id: string;
    name: string;
    section: string;
    row: number;
    seat: number;
    ticketNumber: string;
    price: number;
    status: 'Active' | 'Refunded' | 'Pending' | 'Cancelled';
    isSelected?: boolean;
    isRefundable?: boolean;
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    goToPage: number;
}

export interface RefundSummary {
    subtotal: number;
    refundAmount: number;
    serviceFee: number;
    taxes: number;
    total: number;
}