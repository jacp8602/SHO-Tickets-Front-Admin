import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { SidebarMenuItem, SidebarConfig } from './sidebar.types';

@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatBadgeModule,
        MatDividerModule,
        MatMenuModule
    ]
})
export class SidebarComponent implements OnInit, AfterViewInit {
    @Input() config: SidebarConfig;
    @Input() menuItems: SidebarMenuItem[] = [];
    @Input() collapsed: boolean = false;
    @Output() collapsedChange = new EventEmitter<boolean>();
    @Output() menuItemClick = new EventEmitter<SidebarMenuItem>();

    // Variables para controlar el ancho dinámico
    sidebarWidth: number = 0;
    private resizeObserver: ResizeObserver | null = null;

    constructor(private el: ElementRef) {}

    ngOnInit(): void {
        // Inicializar configuración por defecto si es necesario
        if (!this.config) {
            this.config = {
                width: '100%',
                minWidth: '200px',
                maxWidth: '320px',
                collapsible: true,
                collapsedWidth: '80px',
                showToggle: true,
                title: 'Menu',
                menuItems: this.menuItems
            };
        }
    }

    ngAfterViewInit(): void {
        this.setupResizeObserver();
        this.updateSidebarWidth();
    }

    /**
     * Configurar observer para cambios de tamaño
     */
    private setupResizeObserver(): void {
        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(() => {
                this.updateSidebarWidth();
            });
            
            const container = this.el.nativeElement.querySelector('.sidebar-container');
            if (container) {
                this.resizeObserver.observe(container);
            }
        }
        
        // También escuchar cambios en la ventana
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    /**
     * Actualizar ancho del sidebar
     */
    private updateSidebarWidth(): void {
        const container = this.el.nativeElement.querySelector('.sidebar-container');
        if (container) {
            this.sidebarWidth = container.clientWidth;
        }
    }

    /**
     * Manejar cambio de tamaño de ventana
     */
    private onWindowResize(): void {
        this.updateSidebarWidth();
    }

    /**
     * Alternar colapso
     */
    toggleCollapse(): void {
        if (this.config.collapsible) {
            this.collapsed = !this.collapsed;
            this.collapsedChange.emit(this.collapsed);
            
            // Forzar actualización de ancho después del cambio de estado
            setTimeout(() => {
                this.updateSidebarWidth();
            }, 300); // Esperar a que termine la animación
        }
    }

    /**
     * Manejar click en item del menú
     */
    onMenuItemClick(item: SidebarMenuItem): void {
        if (item.disabled) return;
        
        this.menuItemClick.emit(item);
        if (item.action) {
            item.action();
        }
    }

    /**
     * Obtener color del badge
     */
    getBadgeColor(color: string): string {
        const colors = {
            primary: 'bg-primary-100 text-primary-800',
            accent: 'bg-purple-100 text-purple-800',
            warn: 'bg-red-100 text-red-800',
            success: 'bg-green-100 text-green-800'
        };
        return colors[color] || colors.primary;
    }

    /**
     * Verificar si un item está activo
     */
    isItemActive(item: SidebarMenuItem): boolean {
        // Aquí puedes implementar la lógica para determinar si un item está activo
        // Por ejemplo, basado en la ruta actual
        return false;
    }

    /**
     * Obtener clases dinámicas para el menú item
     */
    getMenuItemClasses(item: SidebarMenuItem): string {
        const classes = [
            'menu-item',
            'w-full',
            'flex',
            'items-center',
            'text-gray-700',
            'hover:bg-gray-100',
            'transition-colors',
            'cursor-pointer'
        ];
        
        if (this.collapsed) {
            classes.push('justify-center');
        } else {
            classes.push('px-4');
        }
        
        if (item.disabled) {
            classes.push('disabled', 'opacity-50', 'cursor-not-allowed');
        }
        
        if (this.isItemActive(item)) {
            classes.push('active', 'bg-primary-50', 'text-primary-600');
        }
        
        return classes.join(' ');
    }

    /**
     * Obtener el ancho del sidebar en píxeles
     */
    getSidebarWidth(): number {
        return this.sidebarWidth;
    }

    ngOnDestroy(): void {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
        window.removeEventListener('resize', this.onWindowResize.bind(this));
    }
}