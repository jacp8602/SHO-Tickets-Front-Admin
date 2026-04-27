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
        link: "/venue-management",
      },
      {
        id: "purchase-sales",
        title: "In Purchase Sales",
        type: "basic",
        icon: "sho_sidebar:in-purchase-sales",
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
        link: "/venue-layouts",
      },
      {
        id: "order",
        title: "Orders",
        type: "basic",
        icon: "sho_sidebar:order",
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
        link: "/overview-totals",
      },
      {
        id: "current-future-sales",
        title: "Current and Future Sales",
        type: "basic",
        icon: "sho_sidebar:current-future-sales",
        link: "/current-future",
      },
      {
        id: "gross-sales",
        title: "Gross Sales",
        type: "basic",
        icon: "sho_sidebar:gross-sales",
        link: "/gross_sales",
      },
      {
        id: "administrative",
        title: "Administrative",
        type: "basic",
        icon: "sho_sidebar:administrative",
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
        link: "/users",
      },
      {
        id: "fee_taxes",
        title: "Fee and Taxes",
        type: "basic",
        icon: "sho_sidebar:fee-taxes",
        link: "/fees_taxes",
      },
      {
        id: "discounts",
        title: "Discounts",
        type: "basic",
        icon: "sho_sidebar:discounts",
        link: "/discounts",
      },
      {
        id: "productions",
        title: "Productions",
        type: "basic",
        icon: "sho_sidebar:productions",
        link: "/productions",
      },
      {
        id: "shows",
        title: "Shows",
        type: "basic",
        icon: "sho_sidebar:shows",
        link: "/shows",
      },
      {
        id: "vendors",
        title: "Other Vendors",
        type: "basic",
        icon: "sho_sidebar:vendors",
        link: "/vendors",
      },
      {
        id: "catalogs",
        title: "Catalogs",
        type: "basic",
        icon: "sho_sidebar:catalogs",
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
