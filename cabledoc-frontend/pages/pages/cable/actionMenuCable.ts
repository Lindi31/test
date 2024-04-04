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

export const actionBarElementCables: ActionBarElement[] = [
  {
    label: "Übersicht",
    path: "/cables",
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
    path: "/cable/:id",
    specific: true,
    icon: faEye,
  },
  {
    label: "edit",
    path: "/cable/edit/:id",
    specific: true,
    icon: faEdit,
  },
  {
    label: "add",
    path: "/cable/add",
    specific: false,
    icon: faAdd,
  },
  {
    label: "delete",
    path: "/cable/delete/:id",
    specific: true,
    icon: faTrash,
  },
  {
    label: "Hilfe",
    path: "/cable/help",
    specific: false,
    icon: faQuestionCircle,
  },
];

export default actionBarElementCables;
