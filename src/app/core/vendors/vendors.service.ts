import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../user/user.types';
import { VendorListItem } from './vendors.types';

export interface VendorsResponse {
    vendors: VendorListItem[];
    total: number;
    page: number;
    pageSize: number;
}

@Injectable({ providedIn: 'root' })
export class VendorsService {
    private _httpClient = inject(HttpClient);

    /**
     * Get vendors with pagination
     */
    getVendors(page: number = 0, pageSize: number = 10, filters): Observable<VendorsResponse> {
        return this._httpClient.get<VendorsResponse>('api/vendors', {
            params: {
                page: page.toString(),
                pageSize: pageSize.toString()
            }
        });
    }

    /**
     * Get vendor by id
     */
    getVendorById(id: string): Observable<VendorListItem> {
        return this._httpClient.get<VendorListItem>(`api/vendors/${id}`);
    }

    /**
     * Create a new vendor
     */
    createVendor(vendor: Partial<VendorListItem>): Observable<VendorListItem> {
        return this._httpClient.post<VendorListItem>('api/vendors', { vendor });
    }

    /**
     * Update a vendor
     */
    updateVendor(id: string, vendor: Partial<VendorListItem>): Observable<VendorListItem> {
        return this._httpClient.patch<VendorListItem>(`api/vendors/${id}`, { vendor });
    }

    /**
     * Delete a vendor
     */
    deleteVendor(id: string): Observable<boolean> {
        return this._httpClient.delete<boolean>(`api/vendors/${id}`);
    }
}