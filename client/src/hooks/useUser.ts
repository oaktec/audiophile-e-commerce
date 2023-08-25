import api from "@/api/api";
import { User, UserContext } from "@/contexts/UserContext";
import { useContext } from "react";

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  const { setUser } = context;

  const checkSession = () => {
    return api.get("/auth/check-session").then((res) => {
      const user = res as User;
      if (!user.id) setUser(null);
      else setUser(user);

      return user;
    });
  };

  return { ...context, checkSession };
};
