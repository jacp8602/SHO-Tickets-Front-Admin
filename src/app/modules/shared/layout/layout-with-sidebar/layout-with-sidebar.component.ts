import { 
    Component, 
    Input, 
    ViewEncapsulation, 
    ContentChild, 
    TemplateRef, 
    Type, 
    ComponentRef, 
    ViewContainerRef, 
    OnDestroy,
    OnInit,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { SidebarMenuItem, SidebarConfig } from '../sidebar/sidebar.types';
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: 'app-layout-with-sidebar',
    templateUrl: './layout-with-sidebar.component.html',
    // styleUrls: ['./layout-with-sidebar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
    CommonModule,
    MatIconModule,
    SidebarComponent
]
})
export class LayoutWithSidebarComponent implements OnInit, OnChanges, OnDestroy {
    @Input() sidebarConfig: SidebarConfig = {
        width: '20%',
        minWidth: '250px',
        maxWidth: '400px',
        position: 'left',
        collapsible: false,
        collapsedWidth: '80px',
        showToggle: true,
        title: 'SHOhub',
        menuItems: []
    };
    
    @Input() sidebarMenuItems: SidebarMenuItem[] = [];
    @Input() mainContentClass: string = '';
    @Input() activeComponent: Type<any> | null = null;
    @Input() componentInputs: Record<string, any> = {};
    
    @ContentChild('sidebarHeader') sidebarHeader: TemplateRef<any>;
    @ContentChild('sidebarFooter') sidebarFooter: TemplateRef<any>;
    
    sidebarCollapsed: boolean = false;
    componentRef: ComponentRef<any> | null = null;
    
    sidebarWidthPercentage: number = 100;
    contentWidthPercentage: number = 0;

    constructor(
        private viewContainerRef: ViewContainerRef
    ) {}

    ngOnInit(): void {
        if (this.sidebarConfig.width && this.sidebarConfig.width.includes('%')) {
            this.sidebarWidthPercentage = parseFloat(this.sidebarConfig.width);
            this.contentWidthPercentage = 100 - this.sidebarWidthPercentage;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Detectar cambios en activeComponent
        if (changes['activeComponent']) {
            const newComponent = changes['activeComponent'].currentValue;
            if (newComponent) {
                this.renderComponent(newComponent, this.componentInputs || {});
            } else {
                this.destroyComponent();
            }
        }
        
        // Detectar cambios en componentInputs
        if (changes['componentInputs'] && this.componentRef) {
            // Actualizar inputs del componente existente
            const newInputs = changes['componentInputs'].currentValue;
            if (newInputs) {
                Object.keys(newInputs).forEach(key => {
                    if (this.componentRef) {
                        this.componentRef.instance[key] = newInputs[key];
                    }
                });
                this.componentRef?.changeDetectorRef.detectChanges();
            }
        }
    }

    ngOnDestroy(): void {
        this.destroyComponent();
    }

    onSidebarCollapsedChange(collapsed: boolean): void {
        this.sidebarCollapsed = collapsed;
    }

    onMenuItemClick(item: SidebarMenuItem): void {
        // Si el item tiene un componente asociado, actualizar el componente activo
        if (item.component) {
            this.renderComponent(item.component, item.componentInputs || {});
        }
        
        // Ejecutar la acción personalizada si existe
        if (item.action) {
            item.action();
        }
    }

    renderComponent(component: Type<any>, inputs: Record<string, any> = {}): void {
        // Limpiar el componente anterior
        this.destroyComponent();
        
        // Limpiar el contenedor
        this.viewContainerRef.clear();
        
        // Crear el nuevo componente
        this.componentRef = this.viewContainerRef.createComponent(component);
        
        // Asignar los inputs
        Object.keys(inputs).forEach(key => {
            this.componentRef!.instance[key] = inputs[key];
        });
        
        // Forzar la detección de cambios
        this.componentRef.changeDetectorRef.detectChanges();
    }

    private destroyComponent(): void {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
    }

    get sidebarWidth(): string {
        if (this.sidebarCollapsed) {
            return this.sidebarConfig.collapsedWidth || '80px';
        }
        return `${this.sidebarWidthPercentage}%`;
    }

    get mainContentWidth(): string {
        if (this.sidebarCollapsed) {
            return `calc(100% - ${this.sidebarConfig.collapsedWidth || '80px'})`;
        }
        return `${this.contentWidthPercentage}%`;
    }
}