import { BrowserRouter, Route, Routes } from "react-router-dom";
import SidebarLayout from "../components/Layout/SidebarLayout";
import LoginPage from "../pages/LoginPage";
import Test from "../pages/Test";
import AllUsersReactTable from "../pages/User/AllUsersReactTable";
import ShowUser from "../pages/User/ShowUser";
import Home from "../pages/Home";
import { AuthProvider } from "../pages/AuthProvider";

const ProtectedRoute = ({ children }: { children: any }) => {
  // const { user } = useAuth();
  // const location = useLocation();

  // if (!user) {
  //   return <Navigate to="/login" replace state={{ from: location }} />;
  // }

  return children;
};

const NoMatch = () => {
  return <p>There's nothing here: 404!</p>;
};

export const Router = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<SidebarLayout />}>
        {/* Protected */}
        <Route
          path="users/:id"
          element={
            <ProtectedRoute>
              <ShowUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="users"
          element={
            <ProtectedRoute>
              <AllUsersReactTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="users/:id/edit"
          element={
            <ProtectedRoute>
              <AllUsersReactTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="home"
          element={
            <ProtectedRoute>
              <Home minimizedSidebar={false} />
            </ProtectedRoute>
          }
        />
        {/* not Protected */}
        <Route path="/test" element={<Test />} />
      </Route>
      <Route path="*" element={<NoMatch />} />
    </Routes>
  );
};

export default function TxxRoutesOld() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </BrowserRouter>
    </>
  );
}
