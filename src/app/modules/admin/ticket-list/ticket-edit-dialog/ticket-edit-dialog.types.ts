import { TicketItem } from '../../../../core/tickets/tickets.types';

export interface TicketEditData {
    ticket: TicketItem;
    showId?: string;
    mode: 'edit' | 'create';
}

export interface TicketEditResult {
    success: boolean;
    ticket?: TicketItem;
    message?: string;
}

export interface TicketSaleTime {
    useDifferentTime: boolean;
    startDate?: Date;
    startTime?: string;
    endDate?: Date;
    endTime?: string;
}