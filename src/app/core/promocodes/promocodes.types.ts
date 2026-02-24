export interface PromoCode {
    id: string;
    promoCodeName: string;
    promoCode: string;
    amount: string;
    totalUses: string;
    effectiveFrom: string;
    effectiveUntil: string;
    status: 'Available' | 'Disable' | 'Expired';
    active: boolean;
}