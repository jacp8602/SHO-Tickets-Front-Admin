import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    {path: '', pathMatch : 'full', redirectTo: 'example'},

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    {path: 'signed-in-redirect', pathMatch : 'full', redirectTo: 'example'},

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes')},
            {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes')},
            {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes')},
            {path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes')},
            // {path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes')},
            {path: 'verification-code', loadChildren: () => import('app/modules/auth/verification-code/verification-code.routes')}
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes')},
            {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes')}
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            {path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes')},
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            // Main            
            {path: 'example', loadChildren: () => import('app/modules/admin/example/example.routes')},
            {path: 'dashboard', loadChildren: () => import('app/modules/admin/dashboard/dashboard.routes')},
            {path: 'venue-management', loadChildren: () => import('app/modules/admin/venue-management/venue-management.routes')},
            {path: 'venue-details/:id', loadChildren: () => import('app/modules/admin/venue-details/venue-details.routes')},
            // Layout Configuration
            {path: 'order', loadChildren: () => import('app/modules/admin/orders/orders.routes')},
            {path: 'order-details/:id', loadChildren: () => import('app/modules/admin/order-details/order-details.routes')},
            {path: 'order-refund/:id', loadChildren: () => import('app/modules/admin/order-refund/order-refund.routes')},
            {path: 'venue-layouts', loadChildren: () => import('app/modules/admin/venue-layouts/venue-layouts.routes')},
            // Financial Reports
            {path: 'overview-totals', loadChildren: () => import('app/modules/admin/overview-total-sales/overview-total-sales.routes')},
            {path: 'current-future', loadChildren: () => import('app/modules/admin/current-future-sales/current-future-sales.routes')},
            {path: 'current-future/purchase-items', loadChildren: () => import('app/modules/admin/purchase-items/purchase-items.routes')},
            {path: 'gross_sales', loadChildren: () => import('app/modules/admin/sales-report/sales-report.routes')},
            {path: 'administrative', loadChildren: () => import('app/modules/admin/administrator-summary/administrator-summary.routes')},           
            // Settings
            {path: 'users', loadChildren: () => import('app/modules/admin/users-table/users-table.routes')},
            {path: 'fees_taxes', loadChildren: () => import('app/modules/admin/fees_taxes/fees-taxes.routes')},
            {path: 'discounts', loadChildren: () => import('app/modules/admin/promocodes-list/promocodes-list.routes')},
            {path: 'productions', loadChildren: () => import('app/modules/admin/production-list/production-list.routes')},
            {path: 'productions/:id', loadChildren: () => import('app/modules/admin/production-detail/production-detail.routes')},
            {path: 'productions/layouts/:id', loadChildren: () => import('app/modules/admin/layout-management/layout-management.routes')},
            {path: 'productions/tickets/:id', loadChildren: () => import('app/modules/admin/tickets/tickets.routes')},
            {path: 'productions/addons/:id', loadChildren: () => import('app/modules/admin/addons/addons.routes')},
            {path: 'shows', loadChildren: () => import('app/modules/admin/shows/shows.routes')},
            {path: 'shows/:id', loadChildren: () => import('app/modules/admin/show-detail/show-detail.routes')},
            {path: 'shows/tickets/:id', loadChildren: () => import('app/modules/admin/show-tickets/show-tickets.routes')},
            {path: 'shows/addons/:id', loadChildren: () => import('app/modules/admin/show-addons/show-addons.routes')},
            {path: 'vendors', loadChildren: () => import('app/modules/admin/vendor-table/vendor-table.routes')},            
        ]
    }
];
