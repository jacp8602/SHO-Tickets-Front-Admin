/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id   : 'main',
        title: 'MAIN',
        type : 'group',
        disabled: true,
        children: [
            {
                id   : 'dashboard',
                title: 'Dashboard',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/example'
            },
            {
                id   : 'venue_mgmt',
                title: 'Venue Management',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/example01'
            }
        ]
    },
    {
        id   : 'layout_configuration',
        title: 'LAYOUT CONFIGURATION',
        type : 'group',
        disabled: true,
        children: [
            {
                id   : 'layout_mgmt',
                title: 'Layout Management',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/example'
            },
            {
                id   : 'order',
                title: 'Orders',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/example01'
            }
        ]
    },
    {
        id   : 'financial_reports',
        title: 'FINANCIAL REPORTS',
        type : 'group',
        disabled: true,
        children: [
            {
                id   : 'total_sales_info',
                title: 'Overview Total Sales Info',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/example'
            },
            {
                id   : 'current_future_sales',
                title: 'Current and Future Sales',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/example01'
            },
            {
                id   : 'gross_sales',
                title: 'Gross Sales',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/example'
            },
            {
                id   : 'administrative',
                title: 'Administrative',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/example01'
            }
        ]
    },
    {
        id   : 'settings',
        title: 'SETTINGS',
        type : 'group',
        disabled: true,
        children: [
            {
                id   : 'users',
                title: 'Users',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/example'
            },
            {
                id   : 'fee_taxes',
                title: 'Fee and Taxes',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/example01'
            },
            {
                id   : 'discounts',
                title: 'Discounts',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/example'
            },
            {
                id   : 'productions',
                title: 'Productions',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/example01'
            },
            {
                id   : 'shows',
                title: 'Shows',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/example'
            },
            {
                id   : 'vendors',
                title: 'Vendors',
                type : 'basic',
                icon : 'heroicons_outline:chart-pie',
                link : '/example01'
            }
        ]
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id   : 'example',
        title: 'Example',
        type : 'basic',
        icon : 'heroicons_outline:chart-pie',
        link : '/example'
    }
];
