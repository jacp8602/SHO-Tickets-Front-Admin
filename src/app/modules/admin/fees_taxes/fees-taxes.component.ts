import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseCardComponent } from '@fuse/components/card';
import { FeesTaxesData, FeeTaxSection, FeeTaxItem } from './fees-taxes.types';

// Importar el dialog de Angular Material y el componente del formulario
import { MatDialog } from '@angular/material/dialog';
import { FeeFormComponent } from './fee-form/fee-form.component';
import { TaxFormComponent } from './tax-form/tax-form.component';

@Component({
    selector: 'app-fees-taxes',
    templateUrl: './fees-taxes.component.html',
    styleUrls: ['./fees-taxes.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatCheckboxModule,
        MatMenuModule,
        MatDividerModule,
        MatTooltipModule,
        FuseCardComponent
    ]
})
export class FeesTaxesComponent implements OnInit {
    // Datos de ejemplo
    feesTaxesData: FeesTaxesData = {
        sections: [
            {
                title: 'Fees',
                items: [
                    { name: 'Processing Fee', value: 3, type: 'percentage', isActive: true },
                    { name: 'Facility Fee', value: 3, type: 'percentage', isActive: true },
                    { name: 'Service Fee', value: 2.52, type: 'fixed', currency: 'US $', isActive: true }
                ],
                showPagination: true,
                currentPage: 1,
                totalPages: 68
            },
            {
                title: 'Taxes',
                items: [
                    { name: 'Florida State Tax', state: 'Florida', value: 3,  type: 'percentage', isActive: true }
                ],
                showPagination: true,
                currentPage: 1,
                totalPages: 68
            }
        ]
    };

    // Control para mostrar/ocultar calendarios
    showCalendars: boolean = true;

    constructor(private router: Router, private _dialog: MatDialog) {}

    ngOnInit(): void {}

    /**
     * Obtener el valor formateado del item
     */
    getFormattedValue(item: FeeTaxItem): string {
        if (item.type === 'percentage') {
            return `${item.value}%`;
        } else {
            return `${item.currency || ''} ${item.value}`;
        }
    }

    /**
     * Añadir nuevo item a la sección
     */
    addNewItem(section: FeeTaxSection): void {
        console.log('Add new item to:', section.title);
        if (section.title === 'Fees') {
            // Aquí iría la lógica para añadir un nuevo item
            const dialogRef = this._dialog.open(FeeFormComponent, {
                width: '500px',
                maxWidth: '95vw',
                disableClose: true,
                panelClass: 'fee-form-dialog',
                data: null // null indica que es nuevo
            });

            dialogRef.afterClosed().subscribe((result: FeeTaxItem) => {
                if (result) {
                    // Aquí añadirías el nuevo item a la sección
                    section.items.push(result);
                    console.log('New fee created:', result);
                }
            });
        } else if (section.title === 'Taxes') {
            // Abrir formulario de Tax
            const dialogRef = this._dialog.open(TaxFormComponent, {
                width: '500px',
                maxWidth: '95vw',
                disableClose: true,
                panelClass: 'tax-form-dialog',
                data: null
            });

            dialogRef.afterClosed().subscribe((result: FeeTaxItem) => {
                if (result) {
                    section.items.push(result);
                    console.log('New tax created:', result);
                }
            });
        }
    }

    /**
     * Editar item existente
     */
    editItem(item: FeeTaxItem, section: FeeTaxSection): void {
        console.log('Edit item:', item);
        if (section.title === 'Fees') {
            // Aquí iría la lógica para editar
            const dialogRef = this._dialog.open(FeeFormComponent, {
                width: '500px',
                maxWidth: '95vw',
                disableClose: true,
                panelClass: 'fee-form-dialog',
                data: item // Pasamos el item existente para editar
            });

            dialogRef.afterClosed().subscribe((result: FeeTaxItem) => {
                if (result) {
                    // Aquí actualizarías el item en la sección
                    Object.assign(item, result);
                    console.log('Fee updated:', result);
                }
            });
        }else if (section.title === 'Taxes') {
            const dialogRef = this._dialog.open(TaxFormComponent, {
                width: '500px',
                maxWidth: '95vw',
                disableClose: true,
                panelClass: 'tax-form-dialog',
                data: item
            });

            dialogRef.afterClosed().subscribe((result: FeeTaxItem) => {
                if (result) {
                    Object.assign(item, result);
                }
            });
        }
    }

    /**
     * Eliminar item
     */
    deleteItem(item: FeeTaxItem, section: FeeTaxSection): void {
        console.log('Delete item:', item);
        // Aquí iría la lógica para eliminar        
    }

    /**
     * Cambiar página
     */
    changePage(section: FeeTaxSection, page: number | string): void {
        if (typeof page === 'number') {
            section.currentPage = page;
        }
        console.log('Navigate to page:', page);
    }

    /**
     * Obtener array de páginas para la paginación
     */
    getPagesArray(totalPages: number): (number | string)[] {
        const pages: (number | string)[] = [];
        const maxVisible = 5; // Máximo número de páginas visibles
        
        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1, 2, 3, '...', totalPages - 1, totalPages);
        }
        
        return pages;
    }

    /**
     * Toggle checkbox de calendario
     */
    toggleCalendar(event: any): void {
        console.log('Toggle calendars:', event.checked);
        this.showCalendars = event.checked;
    }
}