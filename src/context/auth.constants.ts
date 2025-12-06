export const INITIAL_USER = {
  id: "",
  name: "",
  username: "",
  email: "",
  profileImage: "",
  bio: "",
};
export const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthStatus: async () => false as boolean,
};
import { IContext } from "@/types";
import { createContext, useContext } from "react";

export const AuthContext = createContext<IContext>(INITIAL_STATE);
export const useAuthContext = () => useContext(AuthContext);
