import { Component, Input, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { Subject, takeUntil } from 'rxjs';

import { MenuService } from '../../../core/menu/menu.service';
import { MenuItem } from '../../../core/menu/menu.types';

@Component({
    selector: 'app-production-menu',
    templateUrl: './production-menu.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        MatIconModule,
    ],
})
export class ProductionMenuComponent implements OnInit, OnDestroy {
    @Input() productionId: string | null = null;
    @Input() activeItemId: string = 'basic';
    
    menuItems: MenuItem[] = [];
    
    private _unsubscribeAll: Subject<void> = new Subject<void>();

    constructor(
        private _menuService: MenuService,
        private _router: Router
    ) {}

    ngOnInit(): void {
        this.loadMenuItems();
        
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
    private loadMenuItems(): void {
        this.menuItems = this._menuService.getProductionMenuItems({
            productionId: this.productionId,
            activeItemId: this.activeItemId
        });
    }

    /**
     * Actualizar el item activo basado en la URL
     */
    private updateActiveItemFromUrl(): void {
        const activeId = this._menuService.getActiveItemIdFromUrl(this._router.url);
        this.menuItems.forEach(item => item.active = item.id === activeId);
    }

    /**
     * Navegar a la ruta del menú
     */
    navigateTo(item: MenuItem): void {
        this.menuItems.forEach(i => i.active = i.id === item.id);
        this._router.navigate(item.route);
    }
}