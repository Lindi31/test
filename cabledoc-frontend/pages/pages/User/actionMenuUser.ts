import {
  faAdd,
  faEdit,
  faEye,
  faTable,
} from "@fortawesome/free-solid-svg-icons";
import { ActionBarElement } from "../../types/actionBar";

const actionBarElementsUser: ActionBarElement[] = [
  {
    label: "Übersicht",
    path: "/users",
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
    path: "/user/:id",
    specific: true,
    icon: faEye,
  },
  {
    label: "edit",
    path: "/user/edit/:id",
    specific: true,
    icon: faEdit,
  },
  {
    label: "add",
    path: "/user/add",
    specific: false,
    icon: faAdd,
  },
  // {
  //   label: "delete",
  //   path: "/Admin/user/delete/:id",
  // specific: true,
  //   icon: faTrash,
  // },
];

export default actionBarElementsUser;
