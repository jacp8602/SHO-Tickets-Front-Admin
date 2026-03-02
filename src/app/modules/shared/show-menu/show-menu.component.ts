import { Component, Input, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';

import { ShowMenuService } from '../../../core/show-menu/show-menu.service';
import { ShowMenuItem, ShowMenuItemId } from '../../../core/show-menu/show-menu.types';

@Component({
    selector: 'app-show-menu',
    templateUrl: './show-menu.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
    ],
})
export class ShowMenuComponent implements OnInit, OnDestroy {
    @Input() showId: string | null = null;
    @Input() activeItemId: ShowMenuItemId = ShowMenuItemId.BASIC;
    
    showmenuItems: ShowMenuItem[] = [];
    
    private _unsubscribeAll: Subject<void> = new Subject<void>();

    constructor(
        private _showmenuService: ShowMenuService,
        private _router: Router
    ) {}

    ngOnInit(): void {
        this.loadShowMenuItems();
        
        // Escuchar cambios en la URL para actualizar el menú
        this._router.events
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.updateActiveItemFromUrl();
            });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    /**
     * Cargar los items del menú
     */
    private loadShowMenuItems(): void {
        this.showmenuItems = this._showmenuService.getShowMenuItems({
            showId: this.showId,
            activeItemId: this.activeItemId
        });
    }

    /**
     * Actualizar el item activo basado en la URL
     */
    private updateActiveItemFromUrl(): void {
        const activeId = this._showmenuService.getActiveItemIdFromUrl(this._router.url);
        this.showmenuItems.forEach(item => item.active = item.id === activeId);
    }

    /**
     * Navegar a la ruta del menú
     */
    navigateTo(item: ShowMenuItem): void {
        console.log('Navegando a:', item.route);
        this.showmenuItems.forEach(i => i.active = i.id === item.id);
        this._router.navigate(item.route);
    }
}