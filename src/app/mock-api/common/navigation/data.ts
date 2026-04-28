/* eslint-disable */
import { FuseNavigationItem } from "@fuse/components/navigation";

export const defaultNavigation: FuseNavigationItem[] = [
  {
    id: "main",
    title: "MAIN",
    type: "group",
    disabled: true,
    children: [
      {
        title: "Dashboard",
        type: "basic",
        icon: "sho_sidebar:dashboard",
        link: "/dashboard",
      },
      {
        id: "venue-mgmt",
        title: "Venue Management",
        type: "basic",
        icon: "sho_sidebar:venue-mgmt",
        classes: {
          icon: "w-4 h-4 relative overflow-hidden",
          title:
            "justify-start text-gray-600 text-xs font-medium font-['Inter'] leading-5",
          wrapper: "self-stretch h-9 inline-flex justify-between items-center",
        },
        link: "/venue-management",
      },
      {
        id: "purchase-sales",
        title: "In Purchase Sales",
        type: "basic",
        icon: "sho_sidebar:in-purchase-sales",
        classes: {
          icon: "w-4 h-4 relative overflow-hidden",
          title:
            "justify-start text-gray-600 text-xs font-medium font-['Inter'] leading-5",
          wrapper: "self-stretch h-9 inline-flex justify-between items-center",
        },
        link: "/example",
      },
    ],
  },
  {
    id: "layout-management",
    title: "LAYOUT MANAGEMENT",
    type: "group",
    disabled: true,
    children: [
      {
        id: "layout_mgmt",
        title: "Layout Management",
        type: "basic",
        icon: "sho_sidebar:layout-mgmt",
        classes: {
          icon: "w-4 h-4 relative overflow-hidden",
          title:
            "justify-start text-gray-600 text-xs font-medium font-['Inter'] leading-5",
        },
        link: "/venue-layouts",
      },
      {
        id: "order",
        title: "Orders",
        type: "basic",
        icon: "sho_sidebar:order",
        classes: {
          icon: "w-4 h-4 relative overflow-hidden",
          title:
            "justify-start text-gray-600 text-xs font-medium font-['Inter'] leading-5",
        },
        link: "/order",
      },
    ],
  },
  {
    id: "financial_reports",
    title: "FINANCIAL REPORTS",
    type: "group",
    disabled: true,
    children: [
      {
        id: "total-sales-info",
        title: "Overview Total Sales Info",
        type: "basic",
        icon: "sho_sidebar:overview-total-sales-info",
        classes: {
          icon: "w-4 h-4 relative overflow-hidden",
          title:
            "justify-start text-gray-600 text-xs font-medium font-['Inter'] leading-5",
        },
        link: "/overview-totals",
      },
      {
        id: "current-future-sales",
        title: "Current and Future Sales",
        type: "basic",
        icon: "sho_sidebar:current-future-sales",
        classes: {
          icon: "w-4 h-4 relative overflow-hidden",
          title:
            "justify-start text-gray-600 text-xs font-medium font-['Inter'] leading-5",
        },
        link: "/current-future",
      },
      {
        id: "gross-sales",
        title: "Gross Sales",
        type: "basic",
        icon: "sho_sidebar:gross-sales",
        classes: {
          icon: "w-4 h-4 relative overflow-hidden",
          title:
            "justify-start text-gray-600 text-xs font-medium font-['Inter'] leading-5",
        },
        link: "/gross_sales",
      },
      {
        id: "administrative",
        title: "Administrative",
        type: "basic",
        icon: "sho_sidebar:administrative",
        classes: {
          icon: "w-4 h-4 relative overflow-hidden",
          title:
            "justify-start text-gray-600 text-xs font-medium font-['Inter'] leading-5",
        },
        link: "/administrative",
      },
    ],
  },
  {
    id: "settings",
    title: "SETTINGS",
    type: "group",
    disabled: true,
    children: [
      {
        id: "users",
        title: "Users",
        type: "basic",
        icon: "sho_sidebar:users",
        classes: {
          icon: "w-4 h-4 relative overflow-hidden",
          title:
            "justify-start text-gray-600 text-xs font-medium font-['Inter'] leading-5",
        },
        link: "/users",
      },
      {
        id: "fee_taxes",
        title: "Fee and Taxes",
        type: "basic",
        icon: "sho_sidebar:fee-taxes",
        classes: {
          icon: "w-4 h-4 relative overflow-hidden",
          title:
            "justify-start text-gray-600 text-xs font-medium font-['Inter'] leading-5",
        },
        link: "/fees_taxes",
      },
      {
        id: "discounts",
        title: "Discounts",
        type: "basic",
        icon: "sho_sidebar:discounts",
        classes: {
          icon: "w-4 h-4 relative overflow-hidden",
          title:
            "justify-start text-gray-600 text-xs font-medium font-['Inter'] leading-5",
        },
        link: "/discounts",
      },
      {
        id: "productions",
        title: "Productions",
        type: "basic",
        icon: "sho_sidebar:productions",
        classes: {
          icon: "w-4 h-4 relative overflow-hidden",
          title:
            "justify-start text-gray-600 text-xs font-medium font-['Inter'] leading-5",
        },
        link: "/productions",
      },
      {
        id: "shows",
        title: "Shows",
        type: "basic",
        icon: "sho_sidebar:shows",
        classes: {
          icon: "w-4 h-4 relative overflow-hidden",
          title:
            "justify-start text-gray-600 text-xs font-medium font-['Inter'] leading-5",
        },
        link: "/shows",
      },
      {
        id: "vendors",
        title: "Other Vendors",
        type: "basic",
        icon: "sho_sidebar:vendors",
        classes: {
          icon: "w-4 h-4 relative overflow-hidden",
          title:
            "justify-start text-gray-600 text-xs font-medium font-['Inter'] leading-5",
        },
        link: "/vendors",
      },
      {
        id: "catalogs",
        title: "Catalogs",
        type: "basic",
        icon: "sho_sidebar:catalogs",
        classes: {
          icon: "w-4 h-4 relative overflow-hidden",
          title:
            "justify-start text-gray-600 text-xs font-medium font-['Inter'] leading-5",
        },
        link: "/example",
      },
    ],
  },
];
export const compactNavigation: FuseNavigationItem[] = [
  {
    id: "example",
    title: "Example",
    type: "basic",
    icon: "heroicons_outline:chart-pie",
    link: "/example",
  },
];
export const futuristicNavigation: FuseNavigationItem[] = [
  {
    id: "example",
    title: "Example",
    type: "basic",
    icon: "heroicons_outline:chart-pie",
    link: "/example",
  },
];
export const horizontalNavigation: FuseNavigationItem[] = [
  {
    id: "example",
    title: "Example",
    type: "basic",
    icon: "heroicons_outline:chart-pie",
    link: "/example",
  },
];
