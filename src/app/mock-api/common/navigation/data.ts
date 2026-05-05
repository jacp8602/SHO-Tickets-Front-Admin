/* eslint-disable */
import { FuseNavigationItem } from "@fuse/components/navigation";

export const defaultNavigation: FuseNavigationItem[] = [
  {
    id: "main",
    title: "MAIN",
    type: "group",
    disabled: true,
    classes: {
      title:
        "text-[#4A5565] font-['Inter'] text-[10px] font-semibold leading-[15px] tracking-[1.5px]",
    },
    children: [
      {
        id: "dashboard",
        title: "Dashboard",
        type: "basic",
        icon: "sho_sidebar:dashboard",
        classes: {
          icon: "w-4 h-4 shrink-0",
          title:
            "text-[#4A5565] font-['Inter'] text-[13px] font-medium leading-[19.5px]",
          // wrapper: "self-stretch h-9 inline-flex items-center",
        },
        link: "/dashboard",
        activeColors: {
          text: "#0EBE83",
          // icon: "#10b981",
          // background: "#d1fae5",
        },
      },
      {
        id: "venue-mgmt",
        title: "Venue Management",
        type: "basic",
        icon: "sho_sidebar:venue-mgmt",
        classes: {
          icon: "w-4 h-4 shrink-0",
          title:
            "text-[#4A5565] font-['Inter'] text-[13px] font-medium leading-[19.5px]",
        },
        link: "/venue-management",
        activeColors: {
          text: "#6967FD",
          // icon: "#3b82f6",
          // background: "#dbeafe",
        },
      },
      {
        id: "purchase-sales",
        title: "In Purchase Sales",
        type: "basic",
        icon: "sho_sidebar:in-purchase-sales",
        classes: {
          icon: "w-4 h-4 shrink-0",
          title:
            "text-[#4A5565] font-['Inter'] text-[13px] font-medium leading-[19.5px]",
        },
        link: "/example",
        activeColors: {
          text: "#009689",
          // icon: "#8b5cf6",
          // background: "#ede9fe",
        },
      },
    ],
  },
  {
    id: "layout-management",
    title: "LAYOUT MANAGEMENT",
    type: "group",
    disabled: true,
    classes: {
      title:
        "text-[#4A5565] font-['Inter'] text-[10px] font-semibold leading-[15px] tracking-[1.5px]",
    },
    children: [
      {
        id: "layout_mgmt",
        title: "Layout Management",
        type: "basic",
        icon: "sho_sidebar:layout-mgmt",
        classes: {
          icon: "w-4 h-4 relative overflow-hidden",
          title:
            "text-[#4A5565] font-['Inter'] text-[13px] font-medium leading-[19.5px]",
        },
        link: "/venue-layouts",
        activeColors: {
          text: "#00BC7D",
          // icon: "#f97316",
          // background: "#ffedd5",
        },
      },
      {
        id: "order",
        title: "Orders",
        type: "basic",
        icon: "sho_sidebar:order",
        classes: {
          icon: "w-4 h-4 shrink-0",
          title:
            "text-[#4A5565] font-['Inter'] text-[13px] font-medium leading-[19.5px]",
        },
        link: "/order",
        activeColors: {
          text: "#2B7FFF",
          // icon: "#ec4899",
          // background: "#fce7f3",
        },
      },
    ],
  },
  {
    id: "financial_reports",
    title: "FINANCIAL REPORTS",
    type: "group",
    disabled: true,
    classes: {
      title:
        "text-[#4A5565] font-['Inter'] text-[10px] font-semibold leading-[15px] tracking-[1.5px]",
    },
    children: [
      {
        id: "total-sales-info",
        title: "Overview Total Sales Info",
        type: "basic",
        icon: "sho_sidebar:overview-total-sales-info",
        classes: {
          icon: "w-4 h-4 shrink-0",
          title:
            "text-[#4A5565] font-['Inter'] text-[13px] font-medium leading-[19.5px]",
        },
        link: "/overview-totals",
        activeColors: {
          text: "#3B20D3",
          // icon: "#14b8a6",
          // background: "#ccfbf1",
        },
      },
      {
        id: "current-future-sales",
        title: "Current and Future Sales",
        type: "basic",
        icon: "sho_sidebar:current-future-sales",
        classes: {
          icon: "w-4 h-4 shrink-0",
          title:
            "text-[#4A5565] font-['Inter'] text-[13px] font-medium leading-[19.5px]",
        },
        link: "/current-future",
        activeColors: {
          text: "#FF6900",
          // icon: "#6366f1",
          // background: "#e0e7ff",
        },
      },
      {
        id: "gross-sales",
        title: "Gross Sales",
        type: "basic",
        icon: "sho_sidebar:gross-sales",
        classes: {
          icon: "w-4 h-4 shrink-0",
          title:
            "text-[#4A5565] font-['Inter'] text-[13px] font-medium leading-[19.5px]",
        },
        link: "/gross_sales",
        activeColors: {
          text: "#2B7FFF",
          // icon: "#84cc16",
          // background: "#ecfccb",
        },
      },
      {
        id: "administrative",
        title: "Administrative",
        type: "basic",
        icon: "sho_sidebar:administrative",
        classes: {
          icon: "w-4 h-4 shrink-0",
          title:
            "text-[#4A5565] font-['Inter'] text-[13px] font-medium leading-[19.5px]",
        },
        link: "/administrative",
        activeColors: {
          text: "#0ACCA5",
          // icon: "#a855f7",
          // background: "#f3e8ff",
        },
      },
    ],
  },
  {
    id: "settings",
    title: "SETTINGS",
    type: "group",
    disabled: true,
    classes: {
      title:
        "text-[#4A5565] font-['Inter'] text-[10px] font-semibold leading-[15px] tracking-[1.5px]",
    },
    children: [
      {
        id: "users",
        title: "Users",
        type: "basic",
        icon: "sho_sidebar:users",
        classes: {
          icon: "w-4 h-4 shrink-0",
          title:
            "text-[#4A5565] font-['Inter'] text-[13px] font-medium leading-[19.5px]",
        },
        link: "/users",
        activeColors: {
          text: "#1C9BBD",
          // icon: "#0ea5e9",
          // background: "#e0f2fe",
        },
      },
      {
        id: "fee_taxes",
        title: "Fee and Taxes",
        type: "basic",
        icon: "sho_sidebar:fee-taxes",
        classes: {
          icon: "w-4 h-4 shrink-0",
          title:
            "text-[#4A5565] font-['Inter'] text-[13px] font-medium leading-[19.5px]",
        },
        link: "/fees_taxes",
        activeColors: {
          text: "#6967FD",
          // icon: "#f59e0b",
          // background: "#fef3c7",
        },
      },
      {
        id: "discounts",
        title: "Discounts",
        type: "basic",
        icon: "sho_sidebar:discounts",
        classes: {
          icon: "w-4 h-4 shrink-0",
          title:
            "text-[#4A5565] font-['Inter'] text-[13px] font-medium leading-[19.5px]",
        },
        link: "/discounts",
        activeColors: {
          text: "#9810FA",
          // icon: "#ef4444",
          // background: "#fee2e2",
        },
      },
      {
        id: "productions",
        title: "Productions",
        type: "basic",
        icon: "sho_sidebar:productions",
        classes: {
          icon: "w-4 h-4 shrink-0",
          title:
            "text-[#4A5565] font-['Inter'] text-[13px] font-medium leading-[19.5px]",
        },
        link: "/productions",
        activeColors: {
          text: "#FD4242",
          // icon: "#06b6d4",
          // background: "#cffafe",
        },
      },
      {
        id: "shows",
        title: "Shows",
        type: "basic",
        icon: "sho_sidebar:shows",
        classes: {
          icon: "w-4 h-4 shrink-0",
          title:
            "text-[#4A5565] font-['Inter'] text-[13px] font-medium leading-[19.5px]",
        },
        link: "/shows",
        activeColors: {
          text: "#FE9A00",
          // icon: "#d946ef",
          // background: "#fae8ff",
        },
      },
      {
        id: "vendors",
        title: "Other Vendors",
        type: "basic",
        icon: "sho_sidebar:vendors",
        classes: {
          icon: "w-4 h-4 shrink-0",
          title:
            "text-[#4A5565] font-['Inter'] text-[13px] font-medium leading-[19.5px]",
        },
        link: "/vendors",
        activeColors: {
          text: "#00BC7D",
          // icon: "#737373",
          // background: "#f3f4f6",
        },
      },
      {
        id: "catalogs",
        title: "Catalogs",
        type: "basic",
        icon: "sho_sidebar:catalogs",
        classes: {
          icon: "w-4 h-4 shrink-0",
          title:
            "text-[#4A5565] font-['Inter'] text-[13px] font-medium leading-[19.5px]",
        },
        link: "/example",
        activeColors: {
          text: "#0ACBA5",
          // icon: "#64748b",
          // background: "#f1f5f9",
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
