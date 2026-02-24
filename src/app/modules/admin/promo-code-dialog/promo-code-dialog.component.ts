import { Component, Inject, ViewEncapsulation, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    ValidationErrors,
    Validators,
    ValidatorFn,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';

import { PromoCode } from '../../../core/promocodes/promocodes.types';

// Definir el formato de fecha personalizado
export const MY_DATE_FORMATS = {
    parse: {
        dateInput: 'MM/DD/YYYY',
    },
    display: {
        dateInput: (date: Date): string => {
            if (!date) return '';
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            const year = date.getFullYear();
            return `${month}/${day}/${year}`;
        },
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    }
};

export interface PromoCodeDialogData {
    mode: 'create' | 'edit';
    promocode?: PromoCode;
}

@Component({
    selector: 'app-promo-code-dialog',
    templateUrl: './promo-code-dialog.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatDividerModule,
        MatSlideToggleModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSelectModule,
        MatDialogModule,
        MatDatepickerModule,      // ← Para el datepicker
        MatNativeDateModule,      // ← Para el adaptador de fechas
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
        { provide: DateAdapter, useClass: NativeDateAdapter },
        { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
    ]
})
export class PromoCodeDialogComponent implements OnInit {
    promoForm: UntypedFormGroup;
    
    // Estados para los toggles y checkboxes
    activePromoCode: boolean = true;
    percentType: boolean = true;
    unlimitedItems: boolean = true;
    unlimitedUses: boolean = true;

    // Opciones de hora
    timeOptions: string[] = [
        '12:00AM', '12:30AM', '01:00AM', '01:30AM', '02:00AM', '02:30AM', '03:00AM', '03:30AM',
        '04:00AM', '04:30AM', '05:00AM', '05:30AM', '06:00AM', '06:30AM', '07:00AM', '07:30AM',
        '08:00AM', '08:30AM', '09:00AM', '09:30AM', '10:00AM', '10:30AM', '11:00AM', '11:30AM',
        '12:00PM', '12:30PM', '01:00PM', '01:30PM', '02:00PM', '02:30PM', '03:00PM', '03:30PM',
        '04:00PM', '04:30PM', '05:00PM', '05:30PM', '06:00PM', '06:30PM', '07:00PM', '07:30PM',
        '08:00PM', '08:30PM', '09:00PM', '09:30PM', '10:00PM', '10:30PM', '11:00PM', '11:30PM'
    ];

    // Validador personalizado para formato de hora
    validateTimeFormat(): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
            
            // Formato: 12:00AM, 01:30PM, etc.
            const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9](AM|PM)$/i;
            
            const valid = timeRegex.test(control.value);
            
            return valid ? null : { invalidTimeFormat: true };
        };
    }

    constructor(
        public dialogRef: MatDialogRef<PromoCodeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: PromoCodeDialogData,
        private _formBuilder: UntypedFormBuilder
    ) {}

    ngOnInit(): void {
        const promocode = this.data?.promocode;
        
        // Crear fechas por defecto como objetos Date
        // Nota: Los meses en JavaScript son 0-indexados (0 = Enero, 11 = Diciembre)
        const defaultStartDate = new Date(2025, 11, 31); // 12/31/2025
        const defaultEndDate = new Date(2025, 9, 10);    // 10/10/2025
        
        this.promoForm = this._formBuilder.group({
            // Basic Information
            enterCode: [
                { value: promocode?.promoCode || 'MILITARY25', disabled: !this.activePromoCode }, 
                this.activePromoCode ? Validators.required : []
            ],
            promoCodeName: [
                { value: promocode?.promoCodeName || 'Military25', disabled: !this.activePromoCode }, 
                this.activePromoCode ? Validators.required : []
            ],
            
            // Discount
            discountAmount: ['', [Validators.required, Validators.min(0.01)]],
            
            // Effective Date - Usando objetos Date
            startDate: [defaultStartDate, Validators.required],
            endDate: [defaultEndDate, Validators.required],
            startTime: ['12:00AM', [Validators.required, this.validateTimeFormat()]],
            endTime: ['02:00PM', [Validators.required, this.validateTimeFormat()]],
            
            // Apply Level
            applyIf: ['each-item', Validators.required],
            discountTaxes: [true],
            discountFees: [true],
            maxItems: ['', this.unlimitedItems ? [] : [Validators.required, Validators.min(1)]],
            
            // Promo Codes Uses
            minTiers: ['', [Validators.required, Validators.min(1)]],
            usersPerCode: [{ value: '50000', disabled: this.unlimitedUses }, [Validators.required, Validators.min(1)]],
        });

        if (this.unlimitedItems) {
            this.promoForm.get('maxItems')?.disable();
        }
        if (this.unlimitedUses) {
            this.promoForm.get('usersPerCode')?.disable();
        }
    }

    /**
     * Título del diálogo según el modo
     */
    get dialogTitle(): string {
        return this.data?.mode === 'edit' ? 'Edit Promo Code' : 'Create Promo Codes';
    }

    /**
     * Texto del botón según el modo
     */
    get actionButtonText(): string {
        return this.data?.mode === 'edit' ? 'Update' : 'Create';
    }

    toggleActivePromoCode(): void {
        this.activePromoCode = !this.activePromoCode;
        
        // Opcional: Limpiar los campos si se deshabilita
        if (!this.activePromoCode) {
            this.promoForm.get('enterCode')?.setValue('');
            this.promoForm.get('promoCodeName')?.setValue('');
        }
    }

    togglePercentType(): void {
        this.percentType = !this.percentType;
    }

    toggleUnlimitedItems(): void {
        this.unlimitedItems = !this.unlimitedItems;
        if (this.unlimitedItems) {
            this.promoForm.get('maxItems')?.disable();
            this.promoForm.get('maxItems')?.setValue('');
        } else {
            this.promoForm.get('maxItems')?.enable();
        }
    }

    toggleUnlimitedUses(): void {
        this.unlimitedUses = !this.unlimitedUses;
        if (this.unlimitedUses) {
            this.promoForm.get('usersPerCode')?.disable();
            this.promoForm.get('usersPerCode')?.setValue('');
        } else {
            this.promoForm.get('usersPerCode')?.enable();
            this.promoForm.get('usersPerCode')?.setValue('50000'); // Valor por defecto
        }
    }

    onCancel(): void {
        this.dialogRef.close();
    }

    // Método para formatear fecha como MM/DD/YYYY
    private formatDate(date: Date): string {
        if (!date) return '';
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
    }

    // En el método onCreate(), cuando construyas el objeto a enviar:
    onCreate(): void {
        if (this.promoForm.invalid) {
            Object.keys(this.promoForm.controls).forEach(key => {
                this.promoForm.get(key)?.markAsTouched();
            });
            return;
        }

        const formValue = this.promoForm.value;
        
        const promocodeData: Partial<PromoCode> = {
            promoCodeName: formValue.promoCodeName,
            promoCode: formValue.enterCode,
            amount: formValue.discountAmount + '%',
            totalUses: this.unlimitedUses ? `0/unlimited` : `0/${formValue.usersPerCode}`,
            effectiveFrom: this.formatDate(formValue.startDate),  // ← Formatear fecha
            effectiveUntil: this.formatDate(formValue.endDate),   // ← Formatear fecha
            status: 'Available',
            active: this.activePromoCode
        };

        if (this.data?.mode === 'edit' && this.data.promocode) {
            Object.assign(promocodeData, { id: this.data.promocode.id });
        }

        this.dialogRef.close(promocodeData);
    }

    
    
}