import { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import api from "./api/api";
import { User } from "./contexts/UserContext";
import { useUser } from "./hooks/useUser";
import Router from "./routes";

function App() {
  const { setUser } = useUser();

  // Check if user is logged in
  useEffect(() => {
    api.fetch("/auth/check-session").then((data) => {
      const user = data as User;
      if (!user.id) setUser(null);
      else setUser(user);
    });
  }, [setUser]);

  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
