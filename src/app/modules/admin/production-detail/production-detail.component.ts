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
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { finalize, take } from 'rxjs';

import { ProductionMenuComponent } from '../../shared/production-menu/production-menu.component';
import { MatDivider } from "@angular/material/divider";
import { ProductionsService } from '../../../core/productions/productions.service';
import { Production } from '../../../core/productions/productions.types';

@Component({
    selector: 'app-production-detail',
    templateUrl: './production-detail.component.html',
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
    MatSelectModule,
    MatProgressSpinnerModule,
    ProductionMenuComponent,
    MatDivider,
    FuseAlertComponent,
],
})
export class ProductionDetailComponent implements OnInit {
    productionForm: UntypedFormGroup;
    productionId: string | null = null;
    production: Production | null = null;
    isLoading: boolean = true;
    isSaving: boolean = false;

    // Alert properties
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;

    // Opciones para Current Show
    currentShowOptions = [
        { value: 'show1', label: 'Golden Brother Nuclear Circus' },
        { value: 'show2', label: 'Monster Truck' },
        { value: 'show3', label: 'Other Show' }
    ];

    // Opciones para Layout Workspace
    workspaceOptions = [
        { value: 'workspace1', label: 'Workspace 1' },
        { value: 'workspace2', label: 'Workspace 2' },
        { value: 'workspace3', label: 'Workspace 3' }
    ];

    // Archivo seleccionado
    selectedFile: File | null = null;
    fileName: string = '';

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _route: ActivatedRoute,
        private _productionsService: ProductionsService
    ) {}

    ngOnInit(): void {
        // Obtener el ID de la ruta
        this.productionId = this._route.snapshot.paramMap.get('id');
        console.log('[ProductionDetail] Production ID:', this.productionId);

        // Crear formulario
        this.productionForm = this._formBuilder.group({
            name: ['', Validators.required],
            description: [''],
            layoutWorkspace: ['', Validators.required],
            currentShow: ['', Validators.required],
        });

        // Cargar datos de la producción
        if (this.productionId) {
            this._loadProduction();
        }
    }

    /**
     * Load production data from API
     */
    private _loadProduction(): void {
        this.isLoading = true;

        this._productionsService.getProductionById(+this.productionId!)
            .pipe(
                take(1),
                finalize(() => {
                    this.isLoading = false;
                })
            )
            .subscribe({
                next: (production) => {
                    if (production) {
                        this.production = production;
                        // Populate form with production data
                        this.productionForm.patchValue({
                            name: production.name,
                            description: production.description,
                        });
                        console.log('[ProductionDetail] Production loaded:', production);
                    } else {
                        this.alert = {
                            type: 'error',
                            message: 'Production not found.',
                        };
                        this.showAlert = true;
                    }
                },
                error: (error) => {
                    console.error('[ProductionDetail] Error loading production:', error);
                    this.alert = {
                        type: 'error',
                        message: 'Failed to load production data.',
                    };
                    this.showAlert = true;
                }
            });
    }

    /**
     * Navigate back to production list
     */
    onClose(): void {
        this._router.navigate(['/productions']);
    }

    /**
     * Handle file selection
     */
    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            // Validate size (5MB = 5 * 1024 * 1024 bytes)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size exceeds 5MB limit');
                return;
            }

            // Validate format
            const validFormats = ['.docx', '.pdf'];
            const fileExtension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
            if (!validFormats.includes(fileExtension)) {
                alert('Only DOCX and PDF formats are allowed');
                return;
            }

            this.selectedFile = file;
            this.fileName = file.name;
        }
    }

    /**
     * Remove selected file
     */
    removeFile(): void {
        this.selectedFile = null;
        this.fileName = '';
    }

    /**
     * Save changes
     */
    onSave(): void {
        if (this.productionForm.invalid) {
            Object.keys(this.productionForm.controls).forEach(key => {
                this.productionForm.get(key)?.markAsTouched();
            });
            return;
        }

        if (!this.productionId) {
            this.alert = {
                type: 'error',
                message: 'Production ID not found.',
            };
            this.showAlert = true;
            return;
        }

        this.isSaving = true;
        this.showAlert = false;

        const updateData = {
            name: this.productionForm.get('name')?.value,
            description: this.productionForm.get('description')?.value,
        };

        this._productionsService.updateProduction(+this.productionId, updateData)
            .pipe(
                finalize(() => {
                    this.isSaving = false;
                })
            )
            .subscribe({
                next: (updatedProduction) => {
                    this.production = updatedProduction;
                    this.alert = {
                        type: 'success',
                        message: 'Production updated successfully.',
                    };
                    this.showAlert = true;
                    console.log('[ProductionDetail] Production updated:', updatedProduction);

                    // Hide alert after 3 seconds
                    setTimeout(() => {
                        this.showAlert = false;
                    }, 3000);
                },
                error: (error) => {
                    console.error('[ProductionDetail] Error updating production:', error);
                    this.alert = {
                        type: 'error',
                        message: 'Failed to update production. Please try again.',
                    };
                    this.showAlert = true;
                }
            });
    }
}