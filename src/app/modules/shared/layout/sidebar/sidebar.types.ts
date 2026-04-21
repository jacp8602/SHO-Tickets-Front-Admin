import { Type } from '@angular/core';

export interface SidebarMenuItem {
    id: string;
    label: string;
    icon?: string;
    type: 'item' | 'divider' | 'header';
    action?: () => void;
    component?: Type<any>;  // Nuevo: componente a renderizar
    componentInputs?: Record<string, any>;  // Nuevo: inputs para el componente
    disabled?: boolean;
    tooltip?: string;
    badge?: string | number;
    badgeColor?: 'primary' | 'accent' | 'warn' | 'success';
    children?: SidebarMenuItem[];
}

export interface SidebarConfig {
    width?: string; // ej: '20%', '250px'
    minWidth?: string;
    maxWidth?: string;
    position?: 'left' | 'right';
    collapsible?: boolean;
    collapsedWidth?: string;
    showToggle?: boolean;
    defaultCollapsed?: boolean;
    title?: string;
    menuItems: SidebarMenuItem[];
}