import React, { FC } from "react";

//https://github.com/forinda/react-router-protected-routes-ts/tree/main/src
//https://www.robinwieruch.de/react-router/
//https://www.robinwieruch.de/react-router-authentication/

// Function component props with children
interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  // const { user, setUser, login, logout } = useUserStore();
  return <div>{children}</div>;
};

export { AuthProvider };
