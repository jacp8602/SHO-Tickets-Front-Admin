import { 
    Component, 
    Input, 
    OnInit, 
    OnChanges, 
    SimpleChanges, 
    ViewChild, 
    ElementRef,
    ViewEncapsulation 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import JsBarcode from 'jsbarcode';
import { BarcodeConfig, BarcodeFormat } from './barcode.types';

@Component({
    selector: 'app-barcode',
    templateUrl: './barcode.component.html',
    styleUrls: ['./barcode.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatButtonModule,
        MatTooltipModule,
        MatMenuModule,
        MatSnackBarModule
    ]
})
export class BarcodeComponent implements OnInit, OnChanges {
    @ViewChild('barcodeCanvas') barcodeCanvas!: ElementRef<HTMLCanvasElement>;
    @ViewChild('barcodeSvg') barcodeSvg!: ElementRef<HTMLElement>;
    
    @Input() value: string = '';
    @Input() format: BarcodeFormat = 'CODE128';
    @Input() width: number = 2;
    @Input() height: number = 100;
    @Input() displayValue: boolean = true;
    @Input() fontSize: number = 20;
    @Input() textMargin: number = 2;
    @Input() lineColor: string = '#000000';
    @Input() background: string = '#ffffff';
    @Input() showControls: boolean = true;
    @Input() downloadButton: boolean = true;
    @Input() copyButton: boolean = true;
    @Input() printButton: boolean = true;
    @Input() svgOutput: boolean = false; // true para SVG, false para Canvas
    
    isLoading: boolean = false;
    errorMessage: string = '';
    barcodeGenerated: boolean = false;
    
    // Opciones adicionales
    availableFormats: { value: BarcodeFormat; label: string }[] = [
        { value: 'CODE128', label: 'CODE 128' },
        { value: 'CODE128A', label: 'CODE 128 A' },
        { value: 'CODE128B', label: 'CODE 128 B' },
        { value: 'CODE128C', label: 'CODE 128 C' },
        { value: 'EAN13', label: 'EAN 13' },
        { value: 'EAN8', label: 'EAN 8' },
        { value: 'UPC', label: 'UPC' },
        { value: 'CODE39', label: 'CODE 39' },
        { value: 'ITF14', label: 'ITF 14' },
        { value: 'MSI', label: 'MSI' },
        { value: 'codabar', label: 'Codabar' },
        { value: 'Pharmacode', label: 'Pharmacode' }
    ];

    constructor(private _snackBar: MatSnackBar) {}

    ngOnInit(): void {
        this.validateAndGenerate();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['value'] || changes['format'] || changes['width'] || 
            changes['height'] || changes['displayValue'] || changes['svgOutput']) {
            this.validateAndGenerate();
        }
    }

    ngAfterViewInit(): void {
        this.generateBarcode();
    }

    /**
     * Validar y generar código de barras
     */
    private validateAndGenerate(): void {
        if (!this.value) {
            this.errorMessage = 'No value provided for barcode';
            this.barcodeGenerated = false;
            return;
        }

        if (this.value.trim().length === 0) {
            this.errorMessage = 'Barcode value cannot be empty';
            this.barcodeGenerated = false;
            return;
        }

        this.errorMessage = '';
        this.generateBarcode();
    }

    /**
     * Generar código de barras
     */
    private generateBarcode(): void {
        this.isLoading = true;
        
        setTimeout(() => {
            try {
                if (this.svgOutput) {
                    this.generateSvgBarcode();
                } else {
                    this.generateCanvasBarcode();
                }
                this.barcodeGenerated = true;
                this.errorMessage = '';
            } catch (error) {
                console.error('Error generating barcode:', error);
                this.errorMessage = 'Error generating barcode. Please check the value and format.';
                this.barcodeGenerated = false;
            } finally {
                this.isLoading = false;
            }
        }, 100);
    }

    /**
     * Generar código de barras en Canvas
     */
    private generateCanvasBarcode(): void {
        if (!this.barcodeCanvas) return;

        try {
            JsBarcode(this.barcodeCanvas.nativeElement, this.value, {
                format: this.format,
                width: this.width,
                height: this.height,
                displayValue: this.displayValue,
                fontSize: this.fontSize,
                textMargin: this.textMargin,
                lineColor: this.lineColor,
                background: this.background
            });
        } catch (error) {
            throw new Error(`Canvas barcode generation failed: ${error}`);
        }
    }

    /**
     * Generar código de barras en SVG
     */
    private generateSvgBarcode(): void {
        if (!this.barcodeSvg) return;

        try {
            // Crear elemento SVG temporal
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            JsBarcode(svg, this.value, {
                format: this.format,
                width: this.width,
                height: this.height,
                displayValue: this.displayValue,
                fontSize: this.fontSize,
                textMargin: this.textMargin,
                lineColor: this.lineColor,
                background: this.background,
                xmlDocument: document
            });

            // Limpiar y agregar nuevo SVG
            const container = this.barcodeSvg.nativeElement;
            container.innerHTML = '';
            container.appendChild(svg);
        } catch (error) {
            throw new Error(`SVG barcode generation failed: ${error}`);
        }
    }

    /**
     * Descargar código de barras
     */
    downloadBarcode(format: 'png' | 'svg' = 'png'): void {
        if (format === 'png' && this.barcodeCanvas) {
            // Descargar como PNG
            const canvas = this.barcodeCanvas.nativeElement;
            const link = document.createElement('a');
            link.download = `barcode-${this.value}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } else if (format === 'svg' && this.barcodeSvg) {
            // Descargar como SVG
            const svgElement = this.barcodeSvg.nativeElement.querySelector('svg');
            if (svgElement) {
                const serializer = new XMLSerializer();
                const svgString = serializer.serializeToString(svgElement);
                const blob = new Blob([svgString], { type: 'image/svg+xml' });
                const url = URL.createObjectURL(blob);
                
                const link = document.createElement('a');
                link.download = `barcode-${this.value}.svg`;
                link.href = url;
                link.click();
                
                URL.revokeObjectURL(url);
            }
        }

        this._snackBar.open('Barcode downloaded successfully', 'Close', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom'
        });
    }

    /**
     * Copiar código de barras al portapapeles
     */
    async copyBarcode(): Promise<void> {
        try {
            if (this.barcodeCanvas) {
                const canvas = this.barcodeCanvas.nativeElement;
                
                // Convertir canvas a blob y copiar
                const blob = await new Promise<Blob>((resolve) => {
                    canvas.toBlob((blob) => resolve(blob!), 'image/png');
                });
                
                await navigator.clipboard.write([
                    new ClipboardItem({
                        [blob.type]: blob
                    })
                ]);
                
                this._snackBar.open('Barcode copied to clipboard', 'Close', {
                    duration: 3000,
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom'
                });
            }
        } catch (error) {
            console.error('Error copying barcode:', error);
            this._snackBar.open('Failed to copy barcode', 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom'
            });
        }
    }

    /**
     * Imprimir código de barras
     */
    printBarcode(): void {
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            alert('Please allow pop-ups to print');
            return;
        }

        let content = '';
        
        if (this.svgOutput && this.barcodeSvg) {
            const svgElement = this.barcodeSvg.nativeElement.querySelector('svg');
            if (svgElement) {
                content = new XMLSerializer().serializeToString(svgElement);
            }
        } else if (this.barcodeCanvas) {
            const canvas = this.barcodeCanvas.nativeElement;
            content = `<img src="${canvas.toDataURL('image/png')}" style="max-width: 100%;">`;
        }

        printWindow.document.write(`
            <html>
                <head>
                    <title>Print Barcode</title>
                    <style>
                        body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
                        .barcode-container { text-align: center; }
                        .barcode-value { margin-top: 20px; font-family: monospace; font-size: 16px; }
                    </style>
                </head>
                <body>
                    <div class="barcode-container">
                        ${content}
                        <div class="barcode-value">${this.value}</div>
                    </div>
                    <script>window.print();</script>
                </body>
            </html>
        `);
        
        printWindow.document.close();
    }

    /**
     * Regenerar con nuevo formato
     */
    changeFormat(format: BarcodeFormat): void {
        this.format = format;
        this.generateBarcode();
    }
}