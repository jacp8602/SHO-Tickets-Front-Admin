import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil, finalize } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

import { ShowsService } from '../../../core/shows/shows.service';
import { Show } from '../../../core/shows/shows.types';

@Component({
    selector: 'app-shows',
    templateUrl: './shows.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatSnackBarModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        FuseAlertComponent,
        PaginationComponent,
    ],
})
export class ShowsComponent implements OnInit, OnDestroy {
    // Alert properties
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;

    // Loading state
    isLoading: boolean = true;
    isSaving: boolean = false;

    // ID de producción (para filtrar shows)
    showId: string = '1';

    // Shows para la lista
    shows: Show[] = [];
    
    // Paginación
    totalItems: number = 0;
    pageSize: number = 10;
    pageIndex: number = 1;
    Math = Math;

    // Búsqueda
    searchTerm: string = '';

    // Unsubscribe
    private _unsubscribeAll: Subject<void> = new Subject<void>();

    constructor(
        private _showsService: ShowsService,
        private _router: Router,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        // Cargar shows
        this.loadShows();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Cargar shows desde el servicio
     */
    private loadShows(): void {
        this.isLoading = true;
        this.showAlert = false;

        this._showsService.getShows(this.showId)
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    this.shows = response.shows;
                    this.totalItems = response.total;
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading shows:', error);
                    this.alert = {
                        type: 'error',
                        message: 'Failed to load shows. Please try again.',
                    };
                    this.showAlert = true;
                    this.isLoading = false;
                }
            });
    }

    /**
     * Obtener shows de la página actual (filtrados por búsqueda)
     */
    get currentPageShows(): Show[] {
        // Primero filtrar por búsqueda
        const filtered = this.searchTerm 
            ? this.shows.filter(s => 
                s.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
                s.description.toLowerCase().includes(this.searchTerm.toLowerCase())
              )
            : this.shows;
        
        // Luego paginar
        const start = (this.pageIndex - 1) * this.pageSize;
        const end = start + this.pageSize;
        return filtered.slice(start, end);
    }

    /**
     * Obtener total de items filtrados (para la paginación)
     */
    get filteredTotalItems(): number {
        if (!this.searchTerm) {
            return this.totalItems;
        }
        return this.shows.filter(s => 
            s.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
            s.description.toLowerCase().includes(this.searchTerm.toLowerCase())
        ).length;
    }

    /**
     * Handle page change
     */
    onPageChange(page: number): void {
        this.pageIndex = page;
    }

    /**
     * Crear nuevo show
     */
    createShow(): void {
        this._snackBar.open('Create show functionality', 'Close', {
            duration: 2000,
        });
    }

    /**
     * Editar show - Navegar al detalle del show
     */
    editShow(show: Show): void {
        this._router.navigate(['/shows', show.id]);
    }

    /**
     * Eliminar show
     */
    deleteShow(show: Show): void {
        if (confirm(`Are you sure you want to delete "${show.name}"?`)) {
            this.isLoading = true;
            
            this._showsService.deleteShow(this.showId)
                .pipe(
                    takeUntil(this._unsubscribeAll),
                    finalize(() => {
                        this.isLoading = false;
                    })
                )
                .subscribe({
                    next: (response) => {
                        this.shows = response.shows;
                        this.totalItems = response.total;
                        
                        // Ajustar página si es necesario
                        if (this.pageIndex > Math.ceil(this.totalItems / this.pageSize)) {
                            this.pageIndex = Math.max(1, Math.ceil(this.totalItems / this.pageSize));
                        }
                        
                        this.alert = {
                            type: 'success',
                            message: 'Show deleted successfully.',
                        };
                        this.showAlert = true;
                        
                        setTimeout(() => {
                            this.showAlert = false;
                        }, 3000);
                    },
                    error: (error) => {
                        console.error('Error deleting show:', error);
                        this.alert = {
                            type: 'error',
                            message: 'Failed to delete show.',
                        };
                        this.showAlert = true;
                    }
                });
        }
    }

    /**
     * Format seats number
     */
    formatSeats(seats: number): string {
        return seats.toString();
    }

    /**
     * Track by function
     */
    trackById(index: number, item: any): string {
        return item.id;
    }
}