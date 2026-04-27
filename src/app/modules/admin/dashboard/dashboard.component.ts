import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';

import { DashboardService } from '../../../core/dashboard/dashboard.service';
import { DashboardData } from '../../../core/dashboard/dashboard.types';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatDividerModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        FuseAlertComponent,
    ],
})
export class DashboardComponent implements OnInit, OnDestroy {
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;
    isLoading: boolean = true;
    
    dashboardData: DashboardData | null = null;

    // Selectores
    selectedLeftToday: string = 'today';
    selectedBirth: string = 'birth';
    selectedRightToday: string = 'today';
    selectedShow: string = 'all';
    selectedVenue: string = 'all';

    // Días de la semana para Peak Booking Times
    weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    activeDayIndex = 3; // Jueves activo

    private _unsubscribeAll: Subject<void> = new Subject<void>();

    constructor(private _dashboardService: DashboardService) {}

    ngOnInit(): void {
        this.loadDashboardData();
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    loadDashboardData(): void {
        this.isLoading = true;
        
        this._dashboardService.getDashboardData()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe({
                next: (response) => {
                    if (response.success) {
                        const rawData = response.data;

                        // 1. Calcular ángulos para ticketsByChannel
                        let currentAngle = 0;
                        const ticketsByChannel = (rawData.ticketsByChannel || []).map(item => {
                            const startAngle = currentAngle;
                            const endAngle = currentAngle + (item.value / 100) * 360;
                            currentAngle = endAngle;
                            return { ...item, startAngle, endAngle };
                        });

                        // 2. Calcular ángulos para customerTypes
                        currentAngle = 0;
                        const customerTypes = (rawData.customerTypes || []).map(item => {
                            const startAngle = currentAngle;
                            const endAngle = currentAngle + (item.value / 100) * 360;
                            currentAngle = endAngle;
                            return { ...item, startAngle, endAngle };
                        });

                        // 3. Asignar los datos enriquecidos al dashboardData
                        this.dashboardData = {
                            ...rawData,
                            ticketsByChannel,
                            customerTypes
                        };
                    }
                    this.isLoading = false;
                },
                error: (error) => {
                    console.error('Error loading dashboard data:', error);
                    this.alert = {
                        type: 'error',
                        message: 'Failed to load dashboard data. Please try again.',
                    };
                    this.showAlert = true;
                    this.isLoading = false;
                }
            });
    }

    formatCurrency(value: number): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    }

    formatNumber(value: number): string {
        return new Intl.NumberFormat('en-US').format(value);
    }

    setActiveDay(index: number): void {
        this.activeDayIndex = index;
    }

    // ========== Métodos para los gráficos ==========

    /**
     * Genera los puntos para la polyline del gráfico de Revenue Trend
     * @param width ancho del SVG
     * @param height alto del SVG
     */
    getRevenueTrendPoints(width: number = 300, height: number = 80): string {
        const data = this.dashboardData?.revenueTrendData;
        if (!data || data.length < 2) return ''; // Necesita al menos 2 puntos
        
        const max = Math.max(...data);
        const min = Math.min(...data);
        const range = max - min || 1;
        const stepX = width / (data.length - 1);
        
        return data.map((value, i) => {
            const x = i * stepX;
            // Escala para que los puntos queden dentro del área visible
            const y = height - ((value - min) / range) * (height - 20) - 10;
            return `${x},${y}`;
        }).join(' ');
    }

    /**
     * Obtiene el color para la barra según el índice (alterna entre new y returning)
     */
    // getBarColor(type: 'new' | 'returning'): string {
    //     return type === 'new' ? 'bg-blue-500' : 'bg-green-500';
    // }

    // En dashboard.component.ts
    getBarHeight(value: number): number {
        const max = Math.max(...(this.dashboardData?.ticketsSoldTrend || [1]));
        const height = (value / max) * 100;
        console.log(`Valor: ${value}, Max: ${max}, Altura: ${height}%`);
        return height;
    }

    getMaxTicketsSold(): number {
        return Math.max(...(this.dashboardData?.ticketsSoldTrend || [1]));
    }

    /**
     * Genera el atributo 'd' de un path SVG para un sector circular (pastel).
     * @param startAngle Ángulo inicial en grados (0° es la línea horizontal hacia la derecha)
     * @param endAngle Ángulo final en grados
     * @param radius Radio del círculo
     * @param cx Centro X
     * @param cy Centro Y
     * @returns String del path
     */
    getPieSlicePath(startAngle: number, endAngle: number, radius: number, cx: number, cy: number): string {
        // Convertir ángulos a radianes
        const startRad = (startAngle * Math.PI) / 180;
        const endRad = (endAngle * Math.PI) / 180;

        // Coordenadas del punto inicial y final en la circunferencia
        const x1 = cx + radius * Math.cos(startRad);
        const y1 = cy + radius * Math.sin(startRad);
        const x2 = cx + radius * Math.cos(endRad);
        const y2 = cy + radius * Math.sin(endRad);

        // Determinar si el arco es mayor a 180° (para el flag large-arc)
        const largeArc = endAngle - startAngle > 180 ? 1 : 0;

        // Construir path: Mover al centro, línea al punto inicial, arco al punto final, cierre
        return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
    }
}