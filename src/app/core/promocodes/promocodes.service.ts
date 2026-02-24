import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PromoCode } from './promocodes.types';

@Injectable({ providedIn: 'root' })
export class PromocodesService {
    
    private mockPromocodes: PromoCode[] = [
        {
            id: '1',
            promoCodeName: 'COMP100',
            promoCode: 'COMP100',
            amount: '100%',
            totalUses: '6/5000',
            effectiveFrom: 'Jan 01, 2014',
            effectiveUntil: 'Feb 01, 2028',
            status: 'Available',
            active: true
        },
        {
            id: '2',
            promoCodeName: 'Military25',
            promoCode: 'MILITARY25',
            amount: '25%',
            totalUses: '190/50000',
            effectiveFrom: 'Dec 01, 2023',
            effectiveUntil: 'Aug 16, 2031',
            status: 'Available',
            active: true
        },
        {
            id: '3',
            promoCodeName: 'LASTCHANCE40',
            promoCode: 'LASTCHANCE40',
            amount: '40%',
            totalUses: '0/unlimited',
            effectiveFrom: 'Jan 14, 2025',
            effectiveUntil: 'Dec 31, 2025',
            status: 'Disable',
            active: true
        },
        {
            id: '4',
            promoCodeName: 'WelcomeBack',
            promoCode: 'WELCOMEBACK',
            amount: '20%',
            totalUses: '0/unlimited',
            effectiveFrom: 'Oct 23, 2024',
            effectiveUntil: 'Dec 31, 2025',
            status: 'Available',
            active: true
        },
        {
            id: '5',
            promoCodeName: 'Twenty25',
            promoCode: 'TWENTY25',
            amount: '20%',
            totalUses: '0/unlimited',
            effectiveFrom: 'Jan 01, 2025',
            effectiveUntil: 'Jan 01, 2026',
            status: 'Available',
            active: true
        },
        {
            id: '6',
            promoCodeName: 'Home100',
            promoCode: 'HOME100',
            amount: '100%',
            totalUses: '0/unlimited',
            effectiveFrom: 'Jan 01, 2025',
            effectiveUntil: 'Jan 01, 2026',
            status: 'Available',
            active: true
        },
        {
            id: '7',
            promoCodeName: 'Homeseat',
            promoCode: 'HOMESEAT',
            amount: '100%',
            totalUses: '0/unlimited',
            effectiveFrom: 'Jan 01, 2025',
            effectiveUntil: 'Jan 01, 2026',
            status: 'Available',
            active: true
        },
        {
            id: '8',
            promoCodeName: 'BO100',
            promoCode: 'BO100',
            amount: '100%',
            totalUses: '0/unlimited',
            effectiveFrom: 'Jan 01, 2025',
            effectiveUntil: 'Jan 01, 2026',
            status: 'Available',
            active: true
        },
        {
            id: '9',
            promoCodeName: 'BOSeat',
            promoCode: 'BOSEAT',
            amount: '100%',
            totalUses: '0/unlimited',
            effectiveFrom: 'Jan 01, 2025',
            effectiveUntil: 'Jan 01, 2026',
            status: 'Available',
            active: true
        },
        {
            id: '10',
            promoCodeName: 'LASTCHANCE25',
            promoCode: 'LASTCHANCE25',
            amount: '25%',
            totalUses: '0/unlimited',
            effectiveFrom: 'Jan 23, 2025',
            effectiveUntil: 'Dec 31, 2025',
            status: 'Available',
            active: false
        }
    ];

    getPromocodes(page: number = 0, pageSize: number = 10, filters?: any): Observable<{ promocodes: PromoCode[]; total: number }> {
        // Simular paginación
        const start = page * pageSize;
        const end = start + pageSize;
        const paginated = this.mockPromocodes.slice(start, end);
        
        return of({
            promocodes: paginated,
            total: this.mockPromocodes.length
        });
    }

    createPromocode(promocode: Partial<PromoCode>): Observable<PromoCode> {
        const newPromocode = { ...promocode, id: Date.now().toString() } as PromoCode;
        this.mockPromocodes.push(newPromocode);
        return of(newPromocode);
    }

    updatePromocode(id: string, promocode: Partial<PromoCode>): Observable<PromoCode> {
        const index = this.mockPromocodes.findIndex(p => p.id === id);
        if (index !== -1) {
            this.mockPromocodes[index] = { ...this.mockPromocodes[index], ...promocode };
            return of(this.mockPromocodes[index]);
        }
        return of({} as PromoCode);
    }

    deletePromocode(id: string): Observable<boolean> {
        const index = this.mockPromocodes.findIndex(p => p.id === id);
        if (index !== -1) {
            this.mockPromocodes.splice(index, 1);
            return of(true);
        }
        return of(false);
    }
}