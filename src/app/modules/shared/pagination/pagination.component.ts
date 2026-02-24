import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-pagination',
    templateUrl: './pagination.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatTooltipModule
    ]
})
export class PaginationComponent implements OnInit, OnChanges {
    @Input() totalItems: number = 0;
    @Input() pageSize: number = 4;
    @Input() pageIndex: number = 1;
    @Output() pageChange = new EventEmitter<number>();

    totalPages: number = 1;
    pagesToShow: number[] = [];
    Math = Math;

    // Para el input de "Go to"
    pageInputValue: string = '';

    ngOnInit(): void {
        this.calculateTotalPages();
        this.updatePagesToShow();
        this.updatePageInputValue();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['totalItems'] || changes['pageSize'] || changes['pageIndex']) {
            this.calculateTotalPages();
            this.updatePagesToShow();
            this.updatePageInputValue();
        }
    }

    private calculateTotalPages(): void {
        this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    }

    /**
     * Generate dynamic array of pages to display in pagination    
     */
    private updatePagesToShow(): void {
        const pages: number[] = [];
        const total = this.totalPages;
        const current = this.pageIndex;
        
        if (total <= 5) {
            for (let i = 1; i <= total; i++) {
                pages.push(i);
            }
            this.pagesToShow = pages;
            return;
        }
        
        // CASO 1: Página activa en el inicio (1-3)
        if (current <= 3) {
            // 1 2 3 ... total
            pages.push(1, 2, 3, -1, total);
        }
        // CASO 2: Página activa en el final (total-2 a total)
        else if (current >= total - 2) {
            // 1 ... total-2 total-1 total
            pages.push(1, -1, total - 2, total - 1, total);
        }
        // CASO 3: Página activa en el medio
        else {
            // 1 ... current-1 current current+1 ... total
            pages.push(1, -1, current - 1, current, current + 1, -1, total);
        }
        
        this.pagesToShow = pages;
    }

    /**
     * Go to specific page
     */
    goToPage(page: number): void {
        const targetPage = Math.max(1, Math.min(page, this.totalPages));
        
        if (targetPage !== this.pageIndex) {
            this.pageIndex = targetPage;
            this.pageChange.emit(this.pageIndex);
            this.updatePagesToShow();
            this.updatePageInputValue();
        }
    }

    /**
     * Handle page input change - solo permite números
     */
    onPageInputChange(event: any): void {
        const value = event.target.value.replace(/\D/g, '');
        event.target.value = value;
        this.pageInputValue = value;
    }

    /**
     * Handle Enter key press
     */
    onPageEnter(event: any): void {
        event.preventDefault();
        this.validateAndNavigate(event.target.value);
    }

    /**
     * Validate and go to page (para blur)
     */
    validateAndGoToPage(): void {
        this.validateAndNavigate(this.pageInputValue);
    }

    /**
     * Método centralizado para validar y navegar
     */
    private validateAndNavigate(value: string): void {
        let page = parseInt(value, 10);
        
        if (isNaN(page) || page < 1) {
            page = 1;
        } else if (page > this.totalPages) {
            page = this.totalPages;
        }
        
        if (page !== this.pageIndex) {
            this.pageIndex = page;
            this.pageChange.emit(this.pageIndex);
            this.updatePagesToShow();
        }
        
        // Actualizar el valor mostrado
        this.updatePageInputValue();
    }

    /**
     * Actualizar el valor del input con formato de 2 dígitos
     */
    private updatePageInputValue(): void {
        this.pageInputValue = this.formatPageNumber(this.pageIndex);
    }

    /**
     * Formatear número de página con 2 dígitos
     */
    formatPageNumber(page: number): string {
        return page.toString().padStart(2, '0');
    }
}