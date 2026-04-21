import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-venue-info',
    templateUrl: './venue-info.component.html',
    styleUrls: ['./venue-info.component.scss'],
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
        MatDividerModule,
        MatCardModule,
        MatTooltipModule,
        MatSelectModule,
        MatProgressBarModule
    ]
})
export class VenueInfoComponent implements OnInit {
    venueForm: UntypedFormGroup;
    messageContent: string = '';
    
    // Opciones de formato de texto
    formattingOptions = [
        { icon: 'heroicons_solid:bold', label: 'Bold', action: 'bold', class: 'font-bold' },
        { icon: 'heroicons_solid:italic', label: 'Italic', action: 'italic', class: 'italic' },
        { icon: 'heroicons_solid:underline', label: 'Underline', action: 'underline', class: 'underline' },
        { icon: 'heroicons_solid:strikethrough', label: 'Strikethrough', action: 'strikethrough', class: 'line-through' },
        { icon: 'heroicons_solid:list-bullet', label: 'Bullet List', action: 'bullet' },
        { icon: 'heroicons_solid:numbered-list', label: 'Numbered List', action: 'numbered' },
        { icon: 'heroicons_solid:link', label: 'Insert Link', action: 'link' }
    ];

    // Opciones para plantillas de layout
    layoutTemplates = [
        { id: 'layout-1', name: 'Golden Brother Circus - Función Principal ID: layout-1', seats: 1200 },
        { id: 'layout-2', name: 'Golden Brother Circus - Matinée ID: layout-2', seats: 850 },
        { id: 'layout-3', name: 'Golden Brother Circus - Noche Especial ID: layout-3', seats: 1500 },
        { id: 'layout-4', name: 'Golden Brother Circus - VIP Experience ID: layout-4', seats: 400 }
    ];

    // Datos del venue
    venueName: string = 'Conference Center Show';
    recipientName: string = 'Zakir';
    meetingDate: string = '13th February';
    meetingTime: string = '5:00 PM';
    
    // Nuevos campos
    location: string = 'North Port, FL Cool Today Park';
    selectedLayout: string = 'layout-1';
    seats: number = 1200;
    
    // Upload de archivo
    selectedFile: File | null = null;
    uploadProgress: number = 0;
    isUploading: boolean = false;
    uploadError: string = '';

    constructor(private _formBuilder: UntypedFormBuilder) {}

    ngOnInit(): void {
        this.initForm();
        this.initMessageContent();
        
        // Suscribirse a cambios en la plantilla seleccionada
        this.venueForm.get('selectedLayout')?.valueChanges.subscribe(layoutId => {
            const template = this.layoutTemplates.find(t => t.id === layoutId);
            if (template) {
                this.venueForm.patchValue({ seats: template.seats });
                this.seats = template.seats;
            }
        });
    }

    /**
     * Inicializar formulario
     */
    initForm(): void {
        this.venueForm = this._formBuilder.group({
            venueName: [this.venueName, Validators.required],
            location: [this.location, Validators.required],
            recipientName: [this.recipientName],
            meetingDate: [this.meetingDate],
            meetingTime: [this.meetingTime],
            selectedLayout: [this.selectedLayout, Validators.required],
            seats: [{ value: this.seats, disabled: true }, [Validators.required, Validators.min(1)]],
            message: ['']
        });
    }

    /**
     * Inicializar contenido del mensaje
     */
    initMessageContent(): void {
        this.messageContent = `Hello ${this.recipientName},\nI hope you're doing well.\n\nI'd like to schedule a meeting to go over the give us an opportunity to discuss key points.\n\ndesign experience.`;
    }

    /**
     * Aplicar formato al texto
     */
    applyFormatting(action: string): void {
        console.log('Apply formatting:', action);
        // Aquí iría la lógica para aplicar formato al texto
    }

    /**
     * Manejar selección de archivo
     */
    onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            
            // Validar tipo de archivo
            const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'];
            if (!allowedTypes.includes(file.type)) {
                this.uploadError = 'Only DOCX or PDF formats are allowed';
                this.selectedFile = null;
                return;
            }
            
            // Validar tamaño (5MB)
            if (file.size > 5 * 1024 * 1024) {
                this.uploadError = 'File size must be less than 5MB';
                this.selectedFile = null;
                return;
            }
            
            this.uploadError = '';
            this.selectedFile = file;
            this.uploadFile();
        }
    }

    /**
     * Subir archivo
     */
    uploadFile(): void {
        if (!this.selectedFile) return;
        
        this.isUploading = true;
        this.uploadProgress = 0;
        
        // Simular progreso de subida
        const interval = setInterval(() => {
            if (this.uploadProgress < 100) {
                this.uploadProgress += 10;
            } else {
                clearInterval(interval);
                this.isUploading = false;
                console.log('File uploaded:', this.selectedFile?.name);
            }
        }, 200);
    }

    /**
     * Eliminar archivo seleccionado
     */
    removeFile(): void {
        this.selectedFile = null;
        this.uploadProgress = 0;
        this.uploadError = '';
        
        // Limpiar el input file
        const fileInput = document.getElementById('identification-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    }

    /**
     * Guardar cambios
     */
    saveChanges(): void {
        if (this.venueForm.valid) {
            const formValue = this.venueForm.getRawValue();
            console.log('Saving venue info:', {
                ...formValue,
                message: this.messageContent,
                uploadedFile: this.selectedFile?.name
            });
            // Aquí iría la lógica para guardar
        }
    }

    /**
     * Cancelar cambios
     */
    cancel(): void {
        console.log('Cancelling changes');
        this.initForm();
        this.initMessageContent();
        this.removeFile();
    }

    /**
     * Enviar mensaje
     */
    sendMessage(): void {
        console.log('Sending message:', this.messageContent);
    }
}