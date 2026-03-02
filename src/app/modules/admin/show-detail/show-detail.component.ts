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
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';

import { ShowMenuComponent } from '../../shared/show-menu/show-menu.component';
import { MatDivider } from "@angular/material/divider";

@Component({
    selector: 'app-show-detail',
    templateUrl: './show-detail.component.html',
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
    ShowMenuComponent,
    MatDivider
],
})
export class ShowDetailComponent implements OnInit {
    showForm: UntypedFormGroup;
    showId: string | null = null;
    
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
        private _route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        // Obtener el ID de la ruta
        this.showId = this._route.snapshot.paramMap.get('id');
        console.log('Show ID:', this.showId);

        this.showForm = this._formBuilder.group({
            layoutWorkspace: ['', Validators.required],
            currentShow: ['', Validators.required],
        });
    }

    /**
     * Navegar de vuelta a la lista de shows
     */
    onClose(): void {
        this._router.navigate(['/shows']);
    }

    /**
     * Manejar la selección de archivo
     */
    onFileSelected(event: any): void {
        const file = event.target.files[0];
        if (file) {
            // Validar tamaño (5MB = 5 * 1024 * 1024 bytes)
            if (file.size > 5 * 1024 * 1024) {
                alert('File size exceeds 5MB limit');
                return;
            }
            
            // Validar formato
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
     * Eliminar archivo seleccionado
     */
    removeFile(): void {
        this.selectedFile = null;
        this.fileName = '';
    }

    /**
     * Guardar cambios
     */
    onSave(): void {
        if (this.showForm.invalid) {
            Object.keys(this.showForm.controls).forEach(key => {
                this.showForm.get(key)?.markAsTouched();
            });
            return;
        }

        const formData = {
            id: this.showId,
            ...this.showForm.value,
            file: this.selectedFile
        };

        console.log('Guardando:', formData);
        
        // Aquí iría la llamada al servicio para guardar
    }
}