import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { ProductionsService } from '../../../core/productions/productions.service';
import { SystemSourcesService, SystemSource } from '../../../core/system-sources/system-sources.service';
import { Production, CreateProductionDto } from '../../../core/productions/productions.types';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-production-create-dialog',
    templateUrl: './production-create-dialog.component.html',
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
        MatDialogModule,
        MatProgressSpinnerModule,
        MatSelectModule,
    ],
})
export class ProductionCreateDialogComponent implements OnInit {
    productionForm: UntypedFormGroup;
    isCreating: boolean = false;
    isLoadingSources: boolean = true;
    errorMessage: string = '';
    systemSources: SystemSource[] = [];

    constructor(
        public dialogRef: MatDialogRef<ProductionCreateDialogComponent>,
        private _formBuilder: UntypedFormBuilder,
        private _productionsService: ProductionsService,
        private _systemSourcesService: SystemSourcesService
    ) {}

    ngOnInit(): void {
        // Crear el formulario con todos los campos requeridos
        this.productionForm = this._formBuilder.group({
            name: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
            workspace: ['', [Validators.required, Validators.maxLength(255)]],
            description: [''],
            systemSourcesId: [null, [Validators.required, Validators.min(1)]],
            oid: [null],
        });

        // Cargar las fuentes del sistema
        this._loadSystemSources();
    }

    /**
     * Load system sources from API
     */
    private _loadSystemSources(): void {
        this._systemSourcesService.getSystemSources()
            .subscribe({
                next: (sources) => {
                    this.systemSources = sources;
                    this.isLoadingSources = false;
                    console.log('[ProductionCreate] System sources loaded:', sources);
                },
                error: (error) => {
                    console.error('[ProductionCreate] Error loading system sources:', error);
                    this.errorMessage = 'Failed to load system sources. Please try again.';
                    this.isLoadingSources = false;
                }
            });
    }

    /**
     * Create production and close dialog
     */
    onCreate(): void {
        if (this.productionForm.invalid) {
            Object.keys(this.productionForm.controls).forEach(key => {
                this.productionForm.get(key)?.markAsTouched();
            });
            return;
        }

        // Clear previous errors
        this.errorMessage = '';
        this.isCreating = true;

        // Preparar DTO para la API con todos los campos requeridos
        const createDto: CreateProductionDto = {
            name: this.productionForm.get('name')?.value,
            workspace: this.productionForm.get('workspace')?.value,
            description: this.productionForm.get('description')?.value,
            systemSourcesId: this.productionForm.get('systemSourcesId')?.value,
            oid: this.productionForm.get('oid')?.value || undefined,
            canceled: false,
        };
        console.log(createDto);

        // Llamar a la API para crear la producción
        this._productionsService.createProduction(createDto)
            .pipe(
                finalize(() => {
                    this.isCreating = false;
                })
            )
            .subscribe({
                next: (createdProduction: Production) => {
                    console.log('[ProductionCreate] Production created successfully:', createdProduction);
                    
                    // Cerrar el diálogo y devolver la producción creada
                    this.dialogRef.close(createdProduction);
                },
                error: (error) => {
                    console.error('[ProductionCreate] Error creating production:', error);
                    this.errorMessage = error?.error?.message || 'Failed to create production. Please try again.';
                }
            });
    }

    /**
     * Cancel creation and close dialog
     */
    onCancel(): void {
        this.dialogRef.close();
    }
}
