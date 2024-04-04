import { useEffect, useState } from "react";
import { useUserStore } from "../../app/api/user";
import { axiosErrorHandler } from "../../app/api/axios";
import { useNavigate } from "react-router-dom";

const LogoutPage = ({}) => {
  const [loggedOut, setLoggedOut] = useState<boolean>(false);
  const { logout } = useUserStore();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Logging out...");
    try {
      // Authenticate user
      logout();
      setLoggedOut(true);
      navigate("/home");
    } catch (error) {
      let message = axiosErrorHandler(error as any);
      console.log(message);
    }
  }, []);

  if (!loggedOut) {
    return <div>Trying to log out</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-300 to-emerald-800">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-900 rounded-lg shadow-xl">
        <div className="flex justify-center mb-6">
          <span className="text-3xl font-bold justify-center pt-3">
            Erfolgreich ausgeloggt
          </span>
        </div>
      </div>
    </div>
  );
};

export default LogoutPage;
