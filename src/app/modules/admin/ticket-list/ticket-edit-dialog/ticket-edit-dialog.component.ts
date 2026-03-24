import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { fuseAnimations } from '@fuse/animations';
import { TicketEditData, TicketEditResult, TicketSaleTime } from './ticket-edit-dialog.types';

@Component({
    selector: 'app-ticket-edit-dialog',
    templateUrl: './ticket-edit-dialog.component.html',
    styleUrls: ['./ticket-edit-dialog.component.scss'],
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
        MatSlideToggleModule,
        MatDividerModule,
        MatDialogModule,
        MatTooltipModule,
        MatTabsModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatNativeDateModule
    ]
})
export class TicketEditDialogComponent {
    ticketForm: UntypedFormGroup;
    saleTimeForm: UntypedFormGroup;
    isEditing: boolean;
    isCreating: boolean;
    isLoading: boolean = false;
    activeTab: number = 1;
    
    // Opciones para tipo de ticket
    ticketTypes = [
        { value: 'general', label: 'General Admission', color: 'bg-blue-500', description: 'Standard entry ticket' },
        { value: 'reserved', label: 'Reserved Seating', color: 'bg-green-500', description: 'Assigned seat' },
        { value: 'vip', label: 'VIP', color: 'bg-purple-500', description: 'Premium experience' },
        { value: 'bo', label: 'Box Office', color: 'bg-orange-500', description: 'Box office purchase' },
        { value: 'addon', label: 'Add-On', color: 'bg-gray-400', description: 'Additional service or item' }
    ];

    // Opciones para moneda
    currencies = [
        { value: 'USD', label: 'USD - US Dollar', symbol: '$' },
        { value: 'EUR', label: 'EUR - Euro', symbol: '€' },
        { value: 'GBP', label: 'GBP - British Pound', symbol: '£' }
    ];

    // Opciones para impuestos
    taxOptions = [
        { value: 'none', label: 'No Tax' },
        { value: 'standard', label: 'Standard Rate (8%)' },
        { value: 'reduced', label: 'Reduced Rate (4%)' }
    ];

    constructor(
        private _formBuilder: UntypedFormBuilder,
        public dialogRef: MatDialogRef<TicketEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: TicketEditData
    ) {
        this.isEditing = data.mode === 'edit';
        this.isCreating = data.mode === 'create';
        this.initForms();
    }

    /**
     * Inicializar formularios
     */
    initForms(): void {
        const ticket = this.data.ticket;
        
        // Formulario principal
        this.ticketForm = this._formBuilder.group({
            // Display Name Tab
            name: [ticket?.name || '', [Validators.required, Validators.maxLength(100)]],
            description: [ticket?.description || '', [Validators.maxLength(500)]],
            type: [ticket?.type || 'general', Validators.required],
            
            // Pricing Tab
            price: [ticket?.price || 0, [Validators.required, Validators.min(0)]],
            currency: ['USD'],
            tax: ['none'],
            serviceFee: [0, [Validators.min(0)]],
            facilityFee: [0, [Validators.min(0)]],
            
            // Inventory Tab
            quantity: [ticket?.quantity || 0, [Validators.required, Validators.min(0)]],
            maxPerOrder: [10, [Validators.required, Validators.min(1)]],
            minPerOrder: [1, [Validators.required, Validators.min(1)]],
            
            // Settings
            enableBoxOffice: [false],
            enableStoreFront: [true],
            enabled: [ticket?.enabled !== false]
        });
        
        // Formulario de tiempo de venta
        this.saleTimeForm = this._formBuilder.group({
            useDifferentTime: [false],
            startDate: [null],
            startTime: ['10:00'],
            endDate: [null],
            endTime: ['18:00']
        });
        
        // Validaciones condicionales para tiempo de venta
        this.saleTimeForm.get('useDifferentTime')?.valueChanges.subscribe(use => {
            if (use) {
                this.saleTimeForm.get('startDate')?.setValidators([Validators.required]);
                this.saleTimeForm.get('endDate')?.setValidators([Validators.required]);
            } else {
                this.saleTimeForm.get('startDate')?.clearValidators();
                this.saleTimeForm.get('endDate')?.clearValidators();
            }
            this.saleTimeForm.get('startDate')?.updateValueAndValidity();
            this.saleTimeForm.get('endDate')?.updateValueAndValidity();
        });
    }

    /**
     * Guardar ticket
     */
    save(): void {
        if (this.ticketForm.invalid) {
            this.ticketForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        
        const formValue = this.ticketForm.value;
        const saleTime = this.saleTimeForm.value;
        
        const result: TicketEditResult = {
            success: true,
            ticket: {
                ...this.data.ticket,
                id: this.data.ticket?.id || `ticket_${Date.now()}`,
                name: formValue.name,
                description: formValue.description,
                type: formValue.type,
                price: formValue.price,
                quantity: formValue.quantity,
                enabled: formValue.enabled,
                // updatedAt: new Date(),
                // saleTime: saleTime.useDifferentTime ? saleTime : null
            }
        };

        // Simular un pequeño retraso
        setTimeout(() => {
            this.isLoading = false;
            this.dialogRef.close(result);
        }, 300);
    }

    /**
     * Cancelar edición
     */
    cancel(): void {
        this.dialogRef.close({ success: false });
    }

    /**
     * Obtener el título del modal
     */
    getTitle(): string {
        return this.isEditing ? 'Edit Ticket' : 'Create New Ticket';
    }

    /**
     * Obtener el texto del botón principal
     */
    getSubmitButtonText(): string {
        return this.isEditing ? 'Save Changes' : 'Create Ticket';
    }

    /**
     * Formatear precio
     */
    formatPrice(price: number, currency: string = 'USD'): string {
        const symbol = this.currencies.find(c => c.value === currency)?.symbol || '$';
        return `${symbol}${price.toFixed(2)}`;
    }
}