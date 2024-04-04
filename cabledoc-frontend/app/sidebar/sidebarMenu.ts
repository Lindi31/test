// import { faPage4, faWindows } from "@fortawesome/free-brands-svg-icons";
import { faFile, faFileAlt } from "@fortawesome/free-regular-svg-icons";
import {
  faUser,
  faLocation,
  faPlug,
  faShoppingBasket,
  faAdd,
  faEdit,
  faSearch,
  faTableList,
  faTableCells,
  faLock,
  faLockOpen,
  faTruck,
  faTruckMoving,
  faWandMagic,
  faRoad,
  faEthernet,
} from "@fortawesome/free-solid-svg-icons";

const sidebarElements = [
  {
    label: "User",
    path: "/users",
    icon: faUser,
    children: [
      {
        label: "Userübersicht",
        path: "/users/alluser",
        icon: faTableList,
        children: [],
      },
      {
        label: "neuer User",
        path: "/user/add",
        icon: faAdd,
        children: [],
      },
      {
        label: "Rechte",
        path: "/rights/allrights",
        icon: faLockOpen,
        children: [],
      },
      {
        label: "neues Recht",
        path: "/right/add",
        icon: faLock,
        children: [],
      },
    ],
  },
  {
    label: "Lokationen",
    path: "/location/alllocations",
    icon: faLocation,
    children: [
      {
        label: "Standortübersicht",
        path: "/location/alllocations",
        icon: faTableList,
        children: [],
      },
      {
        label: "alle Standorte (Schränke..)",
        path: "/locateables",
        icon: faTableCells,
        children: [],
      },
      // {
      //   label: "Detail",
      //   path: "/location/12",
      //   icon: faCircleInfo,
      //   children: [],
      // },
      {
        label: "neuer Standort",
        path: "/location/add",
        icon: faAdd,
        children: [],
      },
      {
        label: "bearbeite Standort",
        path: "/location/edit/:id",
        icon: faEdit,
        children: [],
      },
      // {
      //   label: "lösche Standort",
      //   path: "/location/delete/:id",
      //   icon: faTrash,
      //   children: [],
      // },
    ],
  },
  {
    label: "Kabel",
    path: "/cables",
    icon: faPlug,
    children: [
      {
        label: "Kabelübersicht",
        path: "/cable/allcables",
        icon: faPlug,
        children: [],
      },
      {
        label: "neues Kabel",
        path: "/supplier/addsupplier",
        icon: faAdd,
        children: [],
      },
      {
        label: "neuer Lieferant",
        path: "/supplier/addsupplier",
        icon: faTruck,
        children: [],
      },
      {
        label: "Lieferanten",
        path: "/supplier/allsuppliers",
        icon: faTruckMoving,
        children: [],
      },
      {
        label: "Suchen",
        path: "/cables/search",
        icon: faSearch,
        children: [],
      },
    ],
  },
  {
    label: "Fremdleitungen",
    path: "/foreignlines",
    icon: faShoppingBasket,
    children: [],
  },
  {
    label: "Verbindungen",
    path: "/connections",
    icon: faRoad,
    children: [
      {
        label: "Verbindungsübersicht",
        path: "/connections",
        icon: faPlug,
        children: [],
      },
      {
        label: "neue Verbindung",
        path: "/connection/add",
        icon: faAdd,
        children: [],
      },
    ],
  },
  {
    label: "Faserverbindungen",
    path: "/spliceconnections",
    icon: faEthernet,
    children: [],
  },
  {
    label: "Sonstiges",
    path: null,
    icon: faWandMagic,
    children: [
      {
        label: "Bündelrechner",
        path: "/miscellaneous/fibercalculator",
        icon: faFile,
        children: [],
      },
      {
        label: "Dämpfungsrechner",
        path: "/miscellaneous/absorptionscalculator",
        icon: faFileAlt,
        children: [],
      },
      {
        label: "Bündelconnector",
        path: "/miscellaneous/bundleconnector",
        icon: faFileAlt,
        children: [],
      },
    ],
  },
  // {
  //   label: "login",
  //   path: "/login",
  //   icon: faRightToBracket,
  //   children: [],
  // },
];

export default sidebarElements;
