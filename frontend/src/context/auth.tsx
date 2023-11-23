import { ReactNode, createContext, useContext, useState } from "react";
import axios from "axios";
import { Auth } from "../types";

interface AuthContextProps {
  auth: Auth | null;
  setAuth: React.Dispatch<React.SetStateAction<Auth | null>>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps>  = ({ children }) => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")!));

  axios.defaults.headers.common["Authorization"] = `Bearer ${auth?.access_token || ""}`;

  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};

export { useAuth };