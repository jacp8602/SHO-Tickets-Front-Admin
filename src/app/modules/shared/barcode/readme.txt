// En tu componente
import { BarcodeComponent } from './barcode/barcode.component';

@Component({
    standalone: true,
    imports: [BarcodeComponent],
    template: `
        <!-- Uso básico -->
        <app-barcode 
            value="5236256"
            format="CODE128"
            height="80">
        </app-barcode>

        <!-- Con todas las opciones -->
        <app-barcode 
            value="9780201379624"
            format="EAN13"
            width="2.5"
            height="100"
            [displayValue]="true"
            fontSize="18"
            lineColor="#1d6ad4"
            background="#f8fafc"
            [showControls]="true"
            [downloadButton]="true"
            [copyButton]="true"
            [printButton]="true"
            [svgOutput]="false">
        </app-barcode>

        <!-- Formato SVG para mejor calidad -->
        <app-barcode 
            value="1234567890"
            format="CODE128"
            [svgOutput]="true"
            height="90">
        </app-barcode>
    `
})
export class MyComponent {}