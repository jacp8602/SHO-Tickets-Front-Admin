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
        id: "dashboard",
        title: "Dashboard",
        type: "basic",
        icon: "sho_sidebar:dashboard",
        link: "/dashboard",
        activeColors: {
          text: "#10b981",
          icon: "#10b981",
          background: "#d1fae5",
        },
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
        activeColors: {
          text: "#3b82f6",
          icon: "#3b82f6",
          background: "#dbeafe",
        },
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
        activeColors: {
          text: "#8b5cf6",
          icon: "#8b5cf6",
          background: "#ede9fe",
        },
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
        activeColors: {
          text: "#f97316",
          icon: "#f97316",
          background: "#ffedd5",
        },
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
        activeColors: {
          text: "#ec4899",
          icon: "#ec4899",
          background: "#fce7f3",
        },
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
        activeColors: {
          text: "#14b8a6",
          icon: "#14b8a6",
          background: "#ccfbf1",
        },
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
        activeColors: {
          text: "#6366f1",
          icon: "#6366f1",
          background: "#e0e7ff",
        },
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
        activeColors: {
          text: "#84cc16",
          icon: "#84cc16",
          background: "#ecfccb",
        },
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
        activeColors: {
          text: "#a855f7",
          icon: "#a855f7",
          background: "#f3e8ff",
        },
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
        activeColors: {
          text: "#0ea5e9",
          icon: "#0ea5e9",
          background: "#e0f2fe",
        },
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
        activeColors: {
          text: "#f59e0b",
          icon: "#f59e0b",
          background: "#fef3c7",
        },
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
        activeColors: {
          text: "#ef4444",
          icon: "#ef4444",
          background: "#fee2e2",
        },
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
        activeColors: {
          text: "#06b6d4",
          icon: "#06b6d4",
          background: "#cffafe",
        },
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
        activeColors: {
          text: "#d946ef",
          icon: "#d946ef",
          background: "#fae8ff",
        },
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
        activeColors: {
          text: "#737373",
          icon: "#737373",
          background: "#f3f4f6",
        },
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
        activeColors: {
          text: "#64748b",
          icon: "#64748b",
          background: "#f1f5f9",
        },
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
