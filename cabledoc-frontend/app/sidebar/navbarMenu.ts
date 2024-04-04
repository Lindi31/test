import { faBell, faCog, faSignOut } from "@fortawesome/free-solid-svg-icons";

const menu = [
  {
    label: "Settings",
    path: "/properties",
    icon: faCog,
    function: null,
    children: [
      {
        label: "logout",
        path: "/logout/",
        icon: faSignOut,
        function: null,
        children: [],
      },
    ],
  },
  {
    label: "Notifications",
    path: "/notes",
    icon: faBell,
    function: null,
    children: [],
  },
];

export default menu;
