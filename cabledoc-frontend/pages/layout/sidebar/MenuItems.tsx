import {
  IconPlug,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconUserPlus,
  IconPlus,
  IconEdit,
  IconMap,
  IconUser,
  IconUsersPlus,
  IconUserEdit,
  IconPlugConnected,
  IconRouteSquare,
  IconTruckDelivery,
  IconBrandBumble,
  IconPlugConnectedX,
  IconAntennaBars3,
  IconBrandAuth0,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Home",
  },

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "Master Data",
  },
  {
    id: uniqueId(),
    title: "Userübersicht",
    icon: IconUser,
    href: "/users/alluser",
  },

  {
    id: uniqueId(),
    title: "Rechte",
    icon: IconBrandAuth0,
    href: "/rights/allrights",
  },
  {
    navlabel: true,
    subheader: "Cable Management",
  },
  {
    id: uniqueId(),
    title: "Kabelübersicht",
    icon: IconPlug,
    href: "/cable/allcables",
  },
  {
    id: uniqueId(),
    title: "Standortübersicht",
    icon: IconMap,
    href: "/location/alllocations",
  },
  {
    id: uniqueId(),
    title: "Verbindungen",
    icon: IconPlugConnected,
    href: "/connections",
  },
  {
    id: uniqueId(),
    title: "Fremdleitungen",
    icon: IconRouteSquare,
    href: "/fremdleitung",
  },
  {
    navlabel: true,
    subheader: "Supplier",
  },
  {
    id: uniqueId(),
    title: "Lieferantenübersicht",
    icon: IconTruckDelivery,
    href: "/supplier/allsuppliers",
  },
  {
    navlabel: true,
    subheader: "Sonstiges",
  },
  {
    id: uniqueId(),
    title: "Bündelrechner",
    icon: IconBrandBumble,
    href: "/miscellaneous/fibercalculator",
  },
  {
    id: uniqueId(),
    title: "Dämpfungsrechner",
    icon: IconAntennaBars3,
    href: "/miscellaneous/absorptionscalculator",
  },
  {
    id: uniqueId(),
    title: "Bündelconnector",
    icon: IconPlugConnectedX,
    href: "/miscellaneous/bundleconnector",
  },
];

export default Menuitems;
