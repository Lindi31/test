// import { faPage4, faWindows } from "@fortawesome/free-brands-svg-icons";
import {
  faAdd,
  faEdit,
  faEye,
  faTrash,
  faTable,
  faTableCells,
} from "@fortawesome/free-solid-svg-icons";
import { ActionBarElement } from "../../types/actionBar";

export const actionBarElements: ActionBarElement[] = [
  {
    label: "Übersicht",
    path: "/locations",
    specific: false,
    icon: faTable,
  },
  {
    label: "Übersicht (alle)",
    path: "/locateables",
    specific: false,
    icon: faTableCells,
  },
  {
    label: "divide",
    path: "/",
    specific: false,
    icon: null,
  },
  {
    label: "show",
    path: "/location/:id",
    specific: true,
    icon: faEye,
  },
  {
    label: "edit",
    path: "/location/edit/:id",
    specific: true,
    icon: faEdit,
  },
  {
    label: "add",
    path: "/location/add",
    specific: false,
    icon: faAdd,
  },
  {
    label: "delete",
    path: "/location/delete/:id",
    specific: true,
    icon: faTrash,
  },
];

export default actionBarElements;
