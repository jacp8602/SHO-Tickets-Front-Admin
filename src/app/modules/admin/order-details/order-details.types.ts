export interface OrderDetails {
    orderNumber: string;
    eventInfo: EventInfo;
    orderInfo: OrderInfo;
    purchaserInfo: PurchaserInfo;
    receipt: OrderReceipt;
}

export interface EventInfo {
    location: string;
    date: string;
    time: string;
}

export interface OrderInfo {
    amount: number;
    date: string;
    transactionMethod: string;
    transactionStatus: 'Confirmed' | 'Pending' | 'Failed' | 'Refunded';
    processor: string;
    source: string;
    placedBy: string;
}

export interface PurchaserInfo {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    addressLine2?: string;
    country: string;
    city: string;
    state: string;
    zipCode: string;
}

export interface OrderReceipt {
    items: ReceiptItem[];
    subtotal: number;
    refunds: number;
    serviceFee: number;
    facilityFee: number;
    taxes: number;
    total: number;
}

export interface ReceiptItem {
    name: string;
    quantity: number;
    price: number;
    description?: string;
}