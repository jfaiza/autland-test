import { DashBoard, Delegators, Staking, Validators } from "@/components/svg";

export const menusConfig = {
  mainNav: [
    {
      title: "Dashboard",
      icon: DashBoard,
      href: "/",
    },
  ],
  sidebarNav: {
    classic: [
      {
        title: "Dashboard",
        icon: DashBoard,
        href: "/",
      },
      {
        isHeader: true,
        title: "validators & delegators",
      },
      {
        title: "Validators",
        icon: Validators,
        href: "/validators",
      },
      {
        title: "Staking",
        icon: Staking,
        href: "/staking",
      },
    ],
  },
};
