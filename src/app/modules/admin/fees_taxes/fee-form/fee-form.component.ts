import { Component, OnInit, ViewEncapsulation, Inject, ChangeDetectionStrategy } from '@angular/core';
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
import { fuseAnimations } from '@fuse/animations';
import { FeeTaxItem, FeeFormData } from '../fees-taxes.types';

@Component({
    selector: 'app-fee-form',
    templateUrl: './fee-form.component.html',
    styleUrls: ['./fee-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
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
        MatDialogModule
    ]
})
export class FeeFormComponent implements OnInit {
    feeForm: UntypedFormGroup;
    isEditing: boolean = false;

    constructor(
        private _formBuilder: UntypedFormBuilder,
        public dialogRef: MatDialogRef<FeeFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: FeeTaxItem | null
    ) {
        this.isEditing = !!data;
    }

    ngOnInit(): void {
        // Crear el formulario
        this.feeForm = this._formBuilder.group({
            name: [this.data?.name || 'Processing Fee', Validators.required],
            description: [this.data?.description || 'Fee by', Validators.required],
            feeType: [this.data?.type || 'percentage', Validators.required],
            amount: [this.data?.value || 3, [Validators.required, Validators.min(0)]],
            isActive: [this.data?.isActive ?? true]
        });

        // Si estamos editando, podríamos deshabilitar ciertos campos si es necesario
        if (this.isEditing) {
            // Por ejemplo, podrías deshabilitar el tipo si no se puede cambiar
            // this.feeForm.get('feeType').disable();
        }
    }

    /**
     * Guardar el formulario
     */
    save(): void {
        if (this.feeForm.invalid) {
            return;
        }

        const formValue = this.feeForm.getRawValue();
        
        const result: FeeTaxItem = {
            id: this.data?.id || this.generateId(),
            name: formValue.name,
            description: formValue.description,
            type: formValue.feeType,
            value: formValue.amount,
            isActive: formValue.isActive
        };

        // Si es tipo fixed, añadir currency
        if (formValue.feeType === 'fixed') {
            result.currency = 'US $';
        }

        this.dialogRef.close(result);
    }

    /**
     * Cancelar y cerrar
     */
    cancel(): void {
        this.dialogRef.close();
    }

    /**
     * Generar ID temporal (en producción esto vendría del backend)
     */
    private generateId(): string {
        return Math.random().toString(36).substring(2, 9);
    }
}