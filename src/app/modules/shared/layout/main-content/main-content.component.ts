import { 
    Component, 
    Input, 
    ViewEncapsulation, 
    OnChanges, 
    SimpleChanges, 
    Type, 
    ComponentRef, 
    ViewContainerRef, 
    OnDestroy,
    ElementRef,
    AfterViewInit,
    OnInit
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-main-content',
    templateUrl: './main-content.component.html',
    styleUrls: ['./main-content.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatProgressSpinnerModule
    ]
})
export class MainContentComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
    @Input() component: Type<any> | null = null;
    @Input() componentInputs: Record<string, any> = {};
    @Input() showLoader: boolean = true;
    @Input() emptyStateMessage: string = 'No content to display';
    @Input() emptyStateIcon: string = 'heroicons_solid:document-text';
    @Input() customClass: string = '';
    
    // Estado interno
    isLoading: boolean = false;
    hasError: boolean = false;
    errorMessage: string = '';
    contentWidth: number = 0;
    contentHeight: number = 0;
    
    private componentRef: ComponentRef<any> | null = null;
    private resizeObserver: ResizeObserver | null = null;

    constructor(
        private viewContainerRef: ViewContainerRef,
        private el: ElementRef
    ) {}

    ngOnInit(): void {
        this.setupResizeObserver();
    }

    ngAfterViewInit(): void {
        this.updateContentDimensions();
        this.renderComponent();
    }

    ngOnChanges(changes: SimpleChanges): void {
        // Detectar cambios en el componente
        if (changes['component'] && !changes['component'].firstChange) {
            this.renderComponent();
        }
        
        // Detectar cambios en los inputs del componente
        if (changes['componentInputs'] && this.componentRef && !changes['componentInputs'].firstChange) {
            this.updateComponentInputs();
        }
    }

    ngOnDestroy(): void {
        this.destroyComponent();
        this.disconnectResizeObserver();
    }

    /**
     * Configurar observer para cambios de tamaño
     */
    private setupResizeObserver(): void {
        if (typeof ResizeObserver !== 'undefined') {
            this.resizeObserver = new ResizeObserver(() => {
                this.updateContentDimensions();
                this.notifyComponentResize();
            });
            
            const container = this.el.nativeElement.querySelector('.main-content-container');
            if (container) {
                this.resizeObserver.observe(container);
            }
        }
        
        window.addEventListener('resize', this.onWindowResize.bind(this));
    }

    /**
     * Desconectar observer
     */
    private disconnectResizeObserver(): void {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }
        window.removeEventListener('resize', this.onWindowResize.bind(this));
    }

    /**
     * Manejar cambio de tamaño de ventana
     */
    private onWindowResize(): void {
        this.updateContentDimensions();
        this.notifyComponentResize();
    }

    /**
     * Actualizar dimensiones del contenido
     */
    private updateContentDimensions(): void {
        const container = this.el.nativeElement.querySelector('.main-content-container');
        if (container) {
            this.contentWidth = container.clientWidth;
            this.contentHeight = container.clientHeight;
        }
    }

    /**
     * Notificar al componente sobre cambios de tamaño
     */
    private notifyComponentResize(): void {
        if (this.componentRef && this.componentRef.instance) {
            // Si el componente tiene un método onResize, lo llamamos
            if (typeof this.componentRef.instance.onResize === 'function') {
                this.componentRef.instance.onResize({
                    width: this.contentWidth,
                    height: this.contentHeight
                });
            }
            
            // También podemos pasar las dimensiones como inputs si el componente las espera
            if (this.componentRef.instance.containerWidth !== undefined) {
                this.componentRef.instance.containerWidth = this.contentWidth;
            }
            if (this.componentRef.instance.containerHeight !== undefined) {
                this.componentRef.instance.containerHeight = this.contentHeight;
            }
        }
    }

    /**
     * Renderizar el componente
     */
    private renderComponent(): void {
        // Limpiar componente anterior
        this.destroyComponent();
        
        // Si no hay componente, mostrar estado vacío
        if (!this.component) {
            this.isLoading = false;
            this.hasError = false;
            return;
        }
        
        // Mostrar loader
        if (this.showLoader) {
            this.isLoading = true;
        }
        
        this.hasError = false;
        this.errorMessage = '';
        
        // Simular tiempo de carga (opcional)
        setTimeout(() => {
            try {
                // Limpiar el contenedor
                this.viewContainerRef.clear();
                
                // Crear el nuevo componente
                this.componentRef = this.viewContainerRef.createComponent(this.component!);
                
                // Asignar inputs
                this.updateComponentInputs();
                
                // Asignar dimensiones al componente si las espera
                if (this.componentRef.instance.containerWidth !== undefined) {
                    this.componentRef.instance.containerWidth = this.contentWidth;
                }
                if (this.componentRef.instance.containerHeight !== undefined) {
                    this.componentRef.instance.containerHeight = this.contentHeight;
                }
                
                // Forzar detección de cambios
                this.componentRef.changeDetectorRef.detectChanges();
                
                // Ocultar loader
                this.isLoading = false;
            } catch (error) {
                console.error('Error rendering component:', error);
                this.hasError = true;
                this.errorMessage = error instanceof Error ? error.message : 'Failed to load component';
                this.isLoading = false;
            }
        }, 100);
    }

    /**
     * Actualizar inputs del componente
     */
    private updateComponentInputs(): void {
        if (!this.componentRef) return;
        
        Object.keys(this.componentInputs).forEach(key => {
            try {
                this.componentRef!.instance[key] = this.componentInputs[key];
            } catch (error) {
                console.warn(`Could not set input "${key}" on component:`, error);
            }
        });
        
        this.componentRef.changeDetectorRef.detectChanges();
    }

    /**
     * Destruir componente
     */
    private destroyComponent(): void {
        if (this.componentRef) {
            this.componentRef.destroy();
            this.componentRef = null;
        }
        this.viewContainerRef.clear();
    }

    /**
     * Forzar recarga del componente
     */
    reload(): void {
        this.renderComponent();
    }

    /**
     * Obtener ancho actual del contenido
     */
    getCurrentWidth(): number {
        return this.contentWidth;
    }

    /**
     * Obtener alto actual del contenido
     */
    getCurrentHeight(): number {
        return this.contentHeight;
    }
}