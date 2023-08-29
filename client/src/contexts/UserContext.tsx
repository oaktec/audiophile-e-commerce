import { createContext, useState } from "react";

export type User = {
  firstName: string;
  lastName: string;
  email: string;
  id: string;
};

interface UserContextInterface {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  isLoggedIn: boolean;
}

export const UserContext = createContext<UserContextInterface>({
  user: null,
  setUser: () => {},
  isLoggedIn: false,
});

interface UserProviderProps {
  children: React.ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const isLoggedIn = !!user;

  return (
    <UserContext.Provider value={{ user, setUser, isLoggedIn }}>
      {children}
    </UserContext.Provider>
  );
};
