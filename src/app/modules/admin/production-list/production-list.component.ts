import { Component, OnInit, OnDestroy, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';  
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { finalize, Subject, takeUntil, debounceTime } from 'rxjs';

import { PaginationComponent } from '../../shared/pagination/pagination.component';

export interface Production {
    id: string;
    name: string;
    description: string;
}

@Component({
    selector: 'app-production-list',
    templateUrl: './production-list.component.html',
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
        MatProgressSpinnerModule,
        MatMenuModule,
        MatTooltipModule,
        FuseAlertComponent,
        PaginationComponent,
    ],
})
export class ProductionListComponent implements OnInit, OnDestroy {
    @Input() description: string = 'Manage event types, shows, venues, event dates, seat types and layout assignments';
    @Output() productionCreated = new EventEmitter<void>();
    @Output() productionEdited = new EventEmitter<Production>();
    // @Output() productionDeleted = new EventEmitter<Production>();

    // Alert properties
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;

    // Data
    productions: Production[] = [
        {
            id: '1',
            name: 'Golden Brother Nuclear Circus',
            description: 'Nuclear Circus'
        },
        {
            id: '2',
            name: 'Monster Truck',
            description: 'Nuclear Circus'
        }
    ];
    
    // Pagination
    totalItems: number = 2;
    pageSize: number = 10;
    pageIndex: number = 1;

    // Loading state
    isLoading: boolean = false;

    // Search form
    searchForm: UntypedFormGroup;

    // Unsubscribe
    private _unsubscribeAll: Subject<void> = new Subject<void>();

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _router: Router  // ← INYECTAR Router
    ) {}

    ngOnInit(): void {
        // Create search form
        this.searchForm = this._formBuilder.group({
            keyword: ['']
        });

        // Subscribe to search changes
        this.searchForm.get('keyword')?.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300)
            )
            .subscribe(() => {
                this.pageIndex = 1;
                this._loadProductions();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Load productions from server
     */
    private _loadProductions(): void {
        // Aquí iría la llamada al servicio
        this.isLoading = false;
    }

    /**
     * Handle page change
     */
    onPageChange(page: number): void {
        this.pageIndex = page;
        this._loadProductions();
    }

    /**
     * Create new production
     */
    createProduction(): void {
        this.productionCreated.emit();
        // Navegar a creación (opcional)
        // this._router.navigate(['/productions/new']);
        console.log('Create production');
    }

    /**
     * Edit production - Navegar al detalle
     */
    editProduction(production: Production): void {
        // Navegar a la página de detalle con el ID
        this._router.navigate(['/productions', production.id]);
    }

    // /**
    //  * Delete production
    //  */
    // deleteProduction(production: Production): void {
    //     if (confirm(`Are you sure you want to delete ${production.name}?`)) {
    //         // Aquí llamarías al servicio para eliminar
    //         console.log('Delete production:', production);
    //         this.productionDeleted.emit(production);
            
    //         // Filtrar la producción eliminada (simulación)
    //         this.productions = this.productions.filter(p => p.id !== production.id);
    //         this.totalItems = this.productions.length;
            
    //         this.alert = {
    //             type: 'success',
    //             message: 'Production deleted successfully.',
    //         };
    //         this.showAlert = true;
            
    //         setTimeout(() => {
    //             this.showAlert = false;
    //         }, 3000);
    //     }
    // }

    /**
     * Refresh table
     */
    refreshTable(): void {
        this._loadProductions();
    }
}