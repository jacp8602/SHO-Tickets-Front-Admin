export type BarcodeFormat = 
    | 'CODE128' 
    | 'CODE128A' 
    | 'CODE128B' 
    | 'CODE128C'
    | 'EAN13' 
    | 'EAN8' 
    | 'UPC' 
    | 'CODE39'
    | 'ITF14'
    | 'MSI'
    | 'MSI10'
    | 'MSI11'
    | 'MSI1010'
    | 'MSI1110'
    | 'codabar'
    | 'Pharmacode';

export interface BarcodeConfig {
    value: string;
    format?: BarcodeFormat;
    width?: number;
    height?: number;
    displayValue?: boolean;
    font?: string;
    fontOptions?: string;
    textAlign?: 'left' | 'center' | 'right';
    textPosition?: 'top' | 'bottom';
    textMargin?: number;
    fontSize?: number;
    background?: string;
    lineColor?: string;
    margin?: number;
    marginTop?: number;
    marginBottom?: number;
    marginLeft?: number;
    marginRight?: number;
    flat?: boolean;
}

export interface BarcodeOutput {
    svg: string;
    base64: string;
}