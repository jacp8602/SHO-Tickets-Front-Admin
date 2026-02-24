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
import { FeeTaxItem } from '../fees-taxes.types';

// Lista de estados de USA (para el select)
const US_STATES = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 
    'Wisconsin', 'Wyoming'
];

@Component({
    selector: 'app-tax-form',
    templateUrl: './tax-form.component.html',
    styleUrls: ['./tax-form.component.scss'],
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
export class TaxFormComponent implements OnInit {
    taxForm: UntypedFormGroup;
    isEditing: boolean = false;
    states = US_STATES;

    constructor(
        private _formBuilder: UntypedFormBuilder,
        public dialogRef: MatDialogRef<TaxFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: FeeTaxItem | null
    ) {
        this.isEditing = !!data;
    }

    ngOnInit(): void {
        // Crear el formulario
        this.taxForm = this._formBuilder.group({
            name: [this.data?.name || 'Florida State Taxes', Validators.required],
            state: [this.data?.state || 'Florida', Validators.required],
            percentage: [this.data?.value || 3.00, [Validators.required, Validators.min(0), Validators.max(100)]],
            isActive: [this.data?.isActive ?? true]
        });
    }

    /**
     * Guardar el formulario
     */
    save(): void {
        if (this.taxForm.invalid) {
            return;
        }

        const formValue = this.taxForm.getRawValue();
        
        const result: FeeTaxItem = {
            id: this.data?.id || this.generateId(),
            name: formValue.name,
            state: formValue.state,
            value: formValue.percentage,
            type: 'percentage',
            isActive: formValue.isActive
        };

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