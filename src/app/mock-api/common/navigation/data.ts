/* eslint-disable */
import { FuseNavigationItem } from '@fuse/components/navigation';

export const defaultNavigation: FuseNavigationItem[] = [
    {
        id: 'main',
        title: 'MAIN',
        type: 'group',
        disabled: true,
        children: [
            {
                id: 'dashboard',
                title: 'Dashboard',
                type: 'basic',
                icon: 'sho_sidebar:dashboard',
                link: '/example'
            },
            {
                id: 'venue_mgmt',
                title: 'Venue Management',
                type: 'basic',
                icon: 'sho_sidebar:venue_mgmt',
                link: ''
            }
        ]
    },
    {
        id: 'layout_configuration',
        title: 'LAYOUT CONFIGURATION',
        type: 'group',
        disabled: true,
        children: [
            {
                id: 'layout_mgmt',
                title: 'Layout Management',
                type: 'basic',
                icon: 'sho_sidebar:layout_mgmt',
                link: ''
            },
            {
                id: 'order',
                title: 'Orders',
                type: 'basic',
                icon: 'sho_sidebar:order',
                link: ''
            }
        ]
    },
    {
        id: 'financial_reports',
        title: 'FINANCIAL REPORTS',
        type: 'group',
        disabled: true,
        children: [
            {
                id: 'total_sales_info',
                title: 'Overview Total Sales Info',
                type: 'basic',
                icon: 'sho_sidebar:total_sales_info',
                link: ''
            },
            {
                id: 'current_future_sales',
                title: 'Current and Future Sales',
                type: 'basic',
                icon: 'sho_sidebar:current_future_sales',
                link: ''
            },
            {
                id: 'gross_sales',
                title: 'Gross Sales',
                type: 'basic',
                icon: 'sho_sidebar:gross_sales',
                link: ''
            },
            {
                id: 'administrative',
                title: 'Administrative',
                type: 'basic',
                icon: 'sho_sidebar:administrative',
                link: ''
            }
        ]
    },
    {
        id: 'settings',
        title: 'SETTINGS',
        type: 'group',
        disabled: true,
        children: [
            {
                id: 'users',
                title: 'Users',
                type: 'basic',
                icon: 'sho_sidebar:user-multiple',
                link: ''
            },
            {
                id: 'fee_taxes',
                title: 'Fee and Taxes',
                type: 'basic',
                icon: 'sho_sidebar:percent-square',
                link: ''
            },
            {
                id: 'discounts',
                title: 'Discounts',
                type: 'basic',
                icon: 'sho_sidebar:discount',
                link: ''
            },
            {
                id: 'productions',
                title: 'Productions',
                type: 'basic',
                icon: 'sho_sidebar:calendar',
                link: ''
            },
            {
                id: 'shows',
                title: 'Shows',
                type: 'basic',
                icon: 'sho_sidebar:show',
                link: ''
            },
            {
                id: 'vendors',
                title: 'Vendors',
                type: 'basic',
                icon: 'sho_sidebar:store-01',
                link: ''
            }
        ]
    }
];
export const compactNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const futuristicNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
export const horizontalNavigation: FuseNavigationItem[] = [
    {
        id: 'example',
        title: 'Example',
        type: 'basic',
        icon: 'heroicons_outline:chart-pie',
        link: '/example'
    }
];
