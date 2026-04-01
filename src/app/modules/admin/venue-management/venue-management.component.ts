import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule , MatLabel, MatFormField } from "@angular/material/select";
import { MatIcon } from "@angular/material/icon";
// import { EventService } from '../services/event.service';
// import { Event } from '../models/event.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
// import { EventFormComponent } from './event-form/event-form.component';
import { EventListComponent } from '../event-list/event-list.component';
import { EventAssociated } from '../../../core/event-associated/event-associated.types';
import { MOCK_EVENTS } from '../../../core/event-associated/event-associated.mock';
import { PaginationComponent } from '../../shared/pagination/pagination.component';


@Component({
  selector: 'app-venue-management',
  templateUrl: './venue-management.component.html',
  // styleUrls: ['./venue-management.component.scss'],
  animations: [
    trigger('shake', [
      state('false', style({ transform: 'translateX(0)' })),
      state('true', style({ transform: 'translateX(0)' })),
      transition('* => *', [
        animate('100ms ease-in-out', style({ transform: 'translateX(-5px)' })),
        animate('100ms ease-in-out', style({ transform: 'translateX(5px)' })),
        animate('100ms ease-in-out', style({ transform: 'translateX(-5px)' })),
        animate('100ms ease-in-out', style({ transform: 'translateX(0)' })),
      ]),
    ]),
  ],
  standalone: true,
  imports: [
    EventListComponent,
    MatSelectModule,
    MatIcon,
    MatLabel,
    MatFormField,
    ReactiveFormsModule,
    PaginationComponent
]
})
export class VenueManagementComponent implements OnInit {
  @ViewChild(EventListComponent) eventListComponent!: EventListComponent;
  eventsList: EventAssociated[] = []; // Aquí almacenas los eventos
  
  totalPages: number = 11;
  pageSize: number = 10;
  pageIndex: number = 1;

  title = 'Event Management';
  description = 'Manage and oversee all venue events in your system';
  isLoading = false;
  showAlert = false;
  alert = {
    type: 'success',
    message: ''
  };

  // Filter options
  productionOptions = [
    { value: '', label: 'All Productions' },
    { value: 'sq_gardenbros', label: 'Square GardenBros' },
    { value: 'sq_gardenbros_mtv', label: 'Square GardenBros MTV' }
  ];

  showOptions = [
    { value: '', label: 'All Shows' },
    { value: 'nuclear-circus', label: 'Nuclear Circus' }
  ];

  cityOptions = [
    { value: '', label: 'All Cities' },
    { value: 'san_francisco', label: 'San Francisco' },
    { value: 'miami', label: 'Miami' }
  ];

  filterForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    // private eventService: EventService,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      production: [''],
      show: [''],
      city: ['']
    });
  }

  ngOnInit(): void {
    // Watch for filter changes
    this.loadEvents();
    this.filterForm.valueChanges.subscribe(() => {
      if (this.eventListComponent) {
        // this.eventListComponent.resetPagination();
        // this.eventListComponent.loadEvents(this.filterForm.value);
      }
    });
  }

  loadEvents() {
    this.eventsList = MOCK_EVENTS;
    this.totalPages = (this.eventsList.length / 3) + 1;
    this.pageSize = 3;
    this.pageIndex = 1;
  }

  get eventListFilters() {
    return {
      ...this.filterForm.value,
    };
  }

  // createEvent(): void {
  //   const dialogRef = this.dialog.open(EventFormComponent, {
  //     width: '600px',
  //     data: { mode: 'create' }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.showAlert = true;
  //       this.alert = {
  //         type: 'success',
  //         message: 'Event created successfully'
  //       };
  //       this.eventListComponent.loadEvents(this.filterForm.value);
  //     }
  //   });
  // }

  // onEventEdit(event: Event): void {
  //   const dialogRef = this.dialog.open(EventFormComponent, {
  //     width: '600px',
  //     data: { mode: 'edit', event }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.showAlert = true;
  //       this.alert = {
  //         type: 'success',
  //         message: 'Event updated successfully'
  //       };
  //       this.eventListComponent.loadEvents(this.filterForm.value);
  //     }
  //   });
  // }

  // onEventDelete(event: Event): void {
  //   if (confirm(`Are you sure you want to delete "${event.name}"?`)) {
  //     this.eventService.deleteEvent(event.id).subscribe({
  //       next: () => {
  //         this.showAlert = true;
  //         this.alert = {
  //           type: 'success',
  //           message: 'Event deleted successfully'
  //         };
  //         this.eventListComponent.loadEvents(this.filterForm.value);
  //       },
  //       error: (error) => {
  //         console.error('Error deleting event:', error);
  //         this.showAlert = true;
  //         this.alert = {
  //           type: 'error',
  //           message: 'Failed to delete event. Please try again later.'
  //         };
  //       }
  //     });
  //   }
  // }
}
