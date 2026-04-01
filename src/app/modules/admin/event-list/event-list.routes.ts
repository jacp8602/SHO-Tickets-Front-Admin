import { Routes } from '@angular/router';
import { EventListComponent } from 'app/modules/admin/event-list/event-list.component';

export default [
    {
        path     : '',
        component: EventListComponent,
    },
] as Routes;
