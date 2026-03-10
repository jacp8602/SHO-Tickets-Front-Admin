import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { fuseAnimations } from '@fuse/animations';
// import { FuseCardComponent } from '@fuse/components/card/card.component';

import { RefundItemsTableComponent } from './refund-items-table/refund-items-table.component';
import { RefundOrder, RefundItem, PaginationInfo } from './order-refund.types';
import { OrderHeaderComponent } from '../order-details/order-header/order-header.component';

@Component({
    selector: 'app-order-refund',
    templateUrl: './order-refund.component.html',
    styleUrls: ['./order-refund.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCheckboxModule,
        MatTooltipModule,
        MatDividerModule,
        MatCardModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        RefundItemsTableComponent,
        OrderHeaderComponent,
    ]
})
export class OrderRefundComponent implements OnInit {
    @Input() orderData: RefundOrder;
    @Output() refundProcessed = new EventEmitter<any>();
    @Output() cancelled = new EventEmitter<void>();

    refundForm: UntypedFormGroup;
    selectedItems: RefundItem[] = [];
    selectAll: boolean = false;
    isProcessing: boolean = false;

    // Datos de ejemplo basados en la imagen
    readonly mockOrderData: RefundOrder = {
        orderNumber: '5236256',
        eventInfo: 'San Francisco, CA on 10/10/2025 at 2:00 PM',
        bccEmail: 'circus@gardentemily@shows.com',
        refundAmount: 2.00,
        internalNote: '',
        pagination: {
            currentPage: 1,
            totalPages: 2,
            totalItems: 11,
            pageSize: 5,
            goToPage: 2
        },
        items: [
            {
                id: '1',
                name: 'Adult General Admission',
                section: '103',
                row: 1,
                seat: 5,
                ticketNumber: 'WRHLU6YDENRRPKCE707',
                price: 55.00,
                status: 'Active',
                isRefundable: true
            },
            {
                id: '2',
                name: 'Child General Admission/Free Child',
                section: '103',
                row: 1,
                seat: 6,
                ticketNumber: 'TZCGYT1IKYJNRVBF4HX',
                price: 0.00,
                status: 'Refunded',
                isRefundable: false
            },
            {
                id: '3',
                name: 'Child General Admission/Free Child',
                section: '103',
                row: 1,
                seat: 7,
                ticketNumber: '1B7BLWFHKTSKRY3E9LJ',
                price: 25.00,
                status: 'Active',
                isRefundable: true
            },
            {
                id: '4',
                name: 'Child General Admission/Free Child',
                section: '103',
                row: 1,
                seat: 4,
                ticketNumber: 'ZSIHHTYWEFY1DOYH6WV',
                price: 25.00,
                status: 'Active',
                isRefundable: true
            },
            {
                id: '5',
                name: 'Face Painting',
                section: '103',
                row: 1,
                seat: 8,
                ticketNumber: '1A2ZCZQUKJAPH2BDGPG',
                price: 25.00,
                status: 'Active',
                isRefundable: true
            },
            {
                id: '6',
                name: 'Face Painting',
                section: '103',
                row: 1,
                seat: 9,
                ticketNumber: 'CD90D1DQGE7RGTBWUTEV',
                price: 25.00,
                status: 'Active',
                isRefundable: true
            }
        ]
    };

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _snackBar: MatSnackBar
    ) {
        this.orderData = this.mockOrderData;
    }

    ngOnInit(): void {
        this.initForm();
        this.calculateTotalRefund();
    }

    /**
     * Inicializar formulario
     */
    initForm(): void {
        this.refundForm = this._formBuilder.group({
            bccEmail: [this.orderData.bccEmail, [Validators.required, Validators.email]],
            refundAmount: [this.orderData.refundAmount, [Validators.required, Validators.min(0)]],
            internalNote: [this.orderData.internalNote],
            notifyCustomer: [true],
            sendCopy: [false]
        });

        // Suscribirse a cambios en refundAmount
        this.refundForm.get('refundAmount').valueChanges.subscribe(value => {
            this.validateRefundAmount(value);
        });
    }

    /**
     * Validar monto de reembolso
     */
    validateRefundAmount(amount: number): void {
        const maxRefund = this.getMaxRefundAmount();
        if (amount > maxRefund) {
            this.refundForm.get('refundAmount').setErrors({ max: true });
        }
    }

    /**
     * Calcular monto máximo de reembolso
     */
    getMaxRefundAmount(): number {
        return this.selectedItems.reduce((total, item) => total + item.price, 0);
    }

    /**
     * Calcular total de reembolso
     */
    calculateTotalRefund(): void {
        const total = this.selectedItems.reduce((sum, item) => sum + item.price, 0);
        this.refundForm.patchValue({ refundAmount: total }, { emitEvent: false });
    }

    /**
     * Manejar selección de items
     */
    onItemsSelected(items: RefundItem[]): void {
        this.selectedItems = items;
        this.calculateTotalRefund();
    }

    /**
     * Manejar selección de todos los items
     */
    onSelectAll(checked: boolean): void {
        this.selectAll = checked;
    }

    /**
     * Procesar reembolso
     */
    processRefund(): void {
        if (this.refundForm.invalid) {
            this._snackBar.open('Please complete all required fields', 'Close', {
                duration: 3000,
                panelClass: ['error-snackbar']
            });
            return;
        }

        if (this.selectedItems.length === 0) {
            this._snackBar.open('Please select at least one item to refund', 'Close', {
                duration: 3000,
                panelClass: ['warning-snackbar']
            });
            return;
        }

        this.isProcessing = true;

        const refundData = {
            ...this.refundForm.value,
            items: this.selectedItems,
            totalRefund: this.refundForm.get('refundAmount').value,
            timestamp: new Date().toISOString()
        };

        // Simular proceso
        setTimeout(() => {
            this.isProcessing = false;
            this.refundProcessed.emit(refundData);
            
            this._snackBar.open('Refund processed successfully', 'Close', {
                duration: 5000,
                panelClass: ['success-snackbar']
            });
        }, 2000);
    }

    /**
     * Cancelar reembolso
     */
    cancelRefund(): void {
        if (this.selectedItems.length > 0 || this.refundForm.dirty) {
            if (confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
                this.cancelled.emit();
            }
        } else {
            this.cancelled.emit();
        }
    }

    /**
     * Cambiar página
     */
    onPageChange(page: number): void {
        this.orderData.pagination.currentPage = page;
        // Aquí cargarías los items de la nueva página
    }

    /**
     * Ir a página específica
     */
    goToPage(page: number): void {
        if (page >= 1 && page <= this.orderData.pagination.totalPages) {
            this.onPageChange(page);
        }
    }

    /**
     * Formatear moneda
     */
    formatCurrency(amount: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2
        }).format(amount);
    }
}