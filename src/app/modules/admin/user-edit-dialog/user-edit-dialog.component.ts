import { Component, Inject, ViewEncapsulation } from '@angular/core';
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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';

import { UserListItem } from '../../../core/users/users.types';

export interface UserEditDialogData {
    user: UserListItem;
}

@Component({
    selector: 'app-user-edit-dialog',
    templateUrl: './user-edit-dialog.component.html',
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
        MatDialogModule,
    ],
})
export class UserEditDialogComponent {
    userForm: UntypedFormGroup;
    userStatus: boolean = true;

    constructor(
        public dialogRef: MatDialogRef<UserEditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: UserEditDialogData,
        private _formBuilder: UntypedFormBuilder
    ) {
        // Inicializar el estado del usuario
        this.userStatus = data.user?.status === 'active';
        
        // Crear el formulario
        this.userForm = this._formBuilder.group({
            username: [data.user?.username || '', Validators.required],
            firstName: [data.user?.name?.split(' ')[0] || '', Validators.required],
            lastName: [data.user?.name?.split(' ').slice(1).join(' ') || '', Validators.required],
            email: [data.user?.email || '', [Validators.required, Validators.email]],
            phone: [data.user?.phone || '', Validators.required],
        });
    }

    /**
     * Toggle user status
     */
    toggleStatus(): void {
        this.userStatus = !this.userStatus;
    }

    /**
     * Save changes and close dialog
     */
    onSave(): void {
        if (this.userForm.invalid) {
            // Marcar todos los campos como tocados para mostrar errores
            Object.keys(this.userForm.controls).forEach(key => {
                this.userForm.get(key)?.markAsTouched();
            });
            return;
        }

        // Construir el nombre completo
        const fullName = `${this.userForm.get('firstName')?.value} ${this.userForm.get('lastName')?.value}`.trim();

        // Construir el objeto de usuario actualizado
        const updatedUser: UserListItem = {
            ...this.data.user,
            username: this.userForm.get('username')?.value,
            name: fullName,
            email: this.userForm.get('email')?.value,
            phone: this.userForm.get('phone')?.value,
            status: this.userStatus ? 'active' : 'inactive',
        };

        // Cerrar el diálogo y devolver el usuario actualizado
        this.dialogRef.close(updatedUser);
    }

    /**
     * Cancel edit and close dialog
     */
    onCancel(): void {
        this.dialogRef.close();
    }
}