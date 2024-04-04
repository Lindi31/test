// import { faPage4, faWindows } from "@fortawesome/free-brands-svg-icons";
import {
  faAdd,
  faEdit,
  faEye,
  faTrash,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { ActionBarElement } from "../../types/actionBar";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";

export const actionBarElementConnections: ActionBarElement[] = [
  {
    label: "Übersicht",
    path: "/connections",
    specific: false,
    icon: faTable,
  },

  {
    label: "divide",
    path: "/",
    specific: false,
    icon: null,
  },
  {
    label: "show",
    path: "/connection/:id",
    specific: true,
    icon: faEye,
  },
  {
    label: "edit",
    path: "/connection/edit/:id",
    specific: true,
    icon: faEdit,
  },
  {
    label: "add",
    path: "/connection/add",
    specific: false,
    icon: faAdd,
  },
  {
    label: "delete",
    path: "/connection/delete/:id",
    specific: true,
    icon: faTrash,
  },
  {
    label: "Hilfe",
    path: "/connection/help",
    specific: false,
    icon: faQuestionCircle,
  },
];

export default actionBarElementConnections;
