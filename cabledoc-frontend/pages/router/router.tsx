import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SidebarLayout from "../components/Layout/SidebarLayout";
import ErrorPage from "../pages/error-page";
import LoginPage from "../pages/LoginPage";
import Test from "../pages/Test";
import AllUsersReactTable from "../pages/User/AllUsersReactTable";
import ShowUser from "../pages/User/ShowUser";
import Home from "../pages/Home";
import AddUser from "../pages/User/AddUser";
import EditUser from "../pages/User/EditUser";
import ShowLocation from "../pages/Location/ShowLocation";
import AddLocation from "../pages/Location/AddLocation";
import AllLocations from "../pages/Location/AllLocations";
import EditLocation from "../pages/Location/EditLocation";
import AllLocateables from "../pages/Location/AllLocateables";
import LogoutPage from "../pages/Logout";
import DeleteLocation from "../pages/Location/DeleteLocation";
import AddRight from "../pages/Right/AddRight";
import AllRights from "../pages/Right/AllRights";
import EditRight from "../pages/Right/EditRight";
import AddCable from "../pages/cable/AddCable";
import AddLieferant from "../pages/Lieferant/AddLieferant";
import AllLieferanten from "../pages/Lieferant/AllLieferanten";
import EditLieferant from "../pages/Lieferant/EditLieferant";
import AllCables from "../pages/cable/AllCables";
import ShowCable from "../pages/cable/ShowCable";
import CableHelpCard from "../pages/cable/CableHelpCard";
import EditCable from "../pages/cable/EditCable";
import AddConnection from "../pages/connection/AddConnection";
import AllConnections from "../pages/connection/AllConnections";
import ShowConnection from "../pages/connection/ShowConnection";
import BundleCalc from "../pages/miscellaneous/BundleCalc";
import BundleConnect from "../pages/miscellaneous/BundleConnect";
import AttenuationCalc from "../pages/miscellaneous/AttenuationCalc";

export const router = createBrowserRouter([
  {
    element: (
      // <AuthProvider>
      // {user ? <SidebarLayout /> : <Navigate replace to={"login/"} />}
      <SidebarLayout />
      // </AuthProvider>
    ),
    errorElement: <ErrorPage />,
    // loader: () => (!user ? redirect("somethere/") : null),
    children: [
      {
        path: "/",
        element: <Home minimizedSidebar={true} />,
      },
      {
        path: "home/",
        element: <Home minimizedSidebar={true} />,
      },
      {
        path: "users",
        element: <AllUsersReactTable />,
        // element: <AllUser />,
      },
      {
        path: "user/:id",
        element: <ShowUser />,
      },
      {
        path: "user/add",
        element: <AddUser />,
      },
      {
        path: "user/edit/:id",
        element: <EditUser />,
      },
      {
        path: "rights",
        element: <AllRights />,
      },
      {
        path: "right/add",
        element: <AddRight />,
      },
      {
        path: "right/edit/:name",
        element: <EditRight />,
      },
      {
        path: "locations",
        element: <AllLocations />,
      },
      {
        path: "locateables",
        element: <AllLocateables />,
      },
      {
        path: "location/:id",
        element: <ShowLocation />,
      },
      {
        path: "location/add/:id?",
        element: <AddLocation />,
      },
      {
        path: "location/edit/:id?",
        element: <EditLocation />,
      },
      {
        path: "location/delete/:id?",
        element: <DeleteLocation />,
      },
      {
        path: "cables",
        element: <AllCables />,
      },
      {
        path: "cable/add",
        element: <AddCable />,
      },
      {
        path: "cable/help",
        element: <CableHelpCard />,
      },
      {
        path: "cable/edit/:id?",
        element: <EditCable />,
      },
      {
        path: "cable/:id",
        element: <ShowCable />,
      },
      {
        path: "lieferanten",
        element: <AllLieferanten />,
      },
      {
        path: "lieferant/add",
        element: <AddLieferant />,
      },
      {
        path: "lieferant/edit/:id",
        element: <EditLieferant />,
      },
      {
        path: "connections",
        element: <AllConnections />,
      },
      {
        path: "connection/add",
        element: <AddConnection />,
      },
      {
        path: "connection/:id",
        element: <ShowConnection />,
      },
      {
        path: "fibercalculator",
        element: <BundleCalc />,
      },
      {
        path: "bundleconnect",
        element: <BundleConnect />,
      },
      {
        path: "miscellaneous/absorptionscalculator",
        element: <AttenuationCalc />,
      },
      {
        path: "test/",
        element: <Test />,
        // loader: async () =>
        //   user === null ? redirect("/notAuthenticated") : null,
      },
    ],
  },
  {
    path: "login",
    element: <LoginPage />,
  },
  {
    path: "logout",
    element: <LogoutPage />,
  },
]);

export function TxxRoutes() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
