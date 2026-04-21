import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, takeUntil, finalize } from 'rxjs';
import { LayoutWithSidebarComponent } from '../../shared/layout/layout-with-sidebar/layout-with-sidebar.component';
import { SidebarMenuItem, SidebarConfig } from '../../shared/layout/sidebar/sidebar.types';
import { TicketItem } from 'app/core/tickets/tickets.types';
import { TicketsService } from 'app/core/tickets/tickets.service';
import { FeesTaxesComponent } from '../fees_taxes/fees-taxes.component';
import { VenueInfoComponent } from '../venue-info/venue-info.component';
import { TicketListComponent } from '../ticket-list/ticket-list.component';
import { MainContentComponent } from '../../shared/layout/main-content/main-content.component';
import { SidebarComponent } from "app/modules/shared/layout/sidebar/sidebar.component";
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-venue-details',
    templateUrl: './venue-details.component.html',
    standalone: true,
    imports: [
    SidebarComponent,
    MainContentComponent
] 
})
export class VenueDetailsComponent implements OnInit{
    // Variable para controlar el componente activo
    activeComponent: any = null;
    activeComponentInputs: any = {};

    tickets: TicketItem[] = [];
    isLoading: boolean = true;
    error: string | null = null;

    private _unsubscribeAll = new Subject<void>();


    constructor(
        private _router: Router, 
        private _ticketsService: TicketsService,
        private _snackBar: MatSnackBar
    ) {}

    ngOnInit(): void {
        this.loadTickets();
        this.setActiveComponent(VenueInfoComponent);
    }

    /**
     * Cargar tickets desde el servicio
     */
    loadTickets(): void {
        this.isLoading = true;
        this.error = null;
        
        this._ticketsService.getAllTickets()
            .pipe(
                takeUntil(this._unsubscribeAll),
                finalize(() => {
                    this.isLoading = false;
                })
            )
            .subscribe({
                next: (response) => {
                    if (response.success && response.data) {
                        this.tickets = response.data.tickets;
                        this._snackBar.open(`Loaded ${this.tickets.length} tickets`, 'Close', {
                            duration: 2000
                        });
                    }
                },
                error: (error) => {
                    console.error('Error loading tickets:', error);
                    this.error = 'Failed to load tickets';
                    this._snackBar.open('Error loading tickets', 'Close', {
                        duration: 3000
                    });
                }
            });
    }

    menuItems: SidebarMenuItem[] = [
        {
            id: 'basic_info',
            label: 'Basic Information',
            type: 'item',
            component: VenueInfoComponent,
            action: () => {
                console.log('Basic Information clicked');
                this.setActiveComponent(VenueInfoComponent);
            }
        },
        {
            id: 'ticket',
            label: 'Tickets',
            type: 'item',
            component: TicketListComponent,  // Componente a renderizar
            componentInputs: {
                title: "'Tickets Test'",
                description: "'Manage your event tickets and pricing customizable'",
                tickets: this.tickets,
                isLoading: this.isLoading
            },
            action: () => {
                console.log('Tickets clicked');
                this.setActiveComponent(
                    TicketListComponent, 
                    {
                        title: "Tickets",
                        description: "Manage your event tickets and pricing",
                        tickets: this.tickets,
                        isLoading: this.isLoading
                    });
            }
        },
        {
            id: 'layout_event',
            label: 'Layout Event',
            type: 'item',
            component: MainContentComponent,
            action: () => {
                console.log('Layout Event clicked');
                this.setActiveComponent(MainContentComponent);
            }
        },
        {
            id: 'addons',
            label: 'Add-Ons',
            type: 'item',
            action: () => console.log('Add-Ons clicked')
        },
        {
            id: 'fees_taxes',
            label: 'Fees and Taxes',
            type: 'item',
            component: FeesTaxesComponent,  // Componente a renderizar
            action: () => {
                console.log('Fees and Taxes clicked');
                this.setActiveComponent(FeesTaxesComponent);
            }
        },
    ];

    sidebarConfig: SidebarConfig = {
        // width: '100%',
        // minWidth: '400px',
        // maxWidth: '1600px',
        position: 'left',
        collapsible: false,
        collapsedWidth: '80px',
        showToggle: false,
        title: '',
        menuItems: this.menuItems
    };

    /**
     * Método para establecer el componente activo
     */
    setActiveComponent(component: any, inputs: any = {}): void {
        this.activeComponent = component;
        this.activeComponentInputs = inputs;
    }
}